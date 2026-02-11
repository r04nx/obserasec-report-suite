
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { generateReport, defaultConfig } from './scripts/comprehensiveRenderer';
import { demoFullReportData } from './data/demoFullReportData';
import { generatePDF } from './scripts/pdf_generator';
import BrowserManager from './utils/BrowserManager';
import { fileURLToPath } from 'url';
import cluster from 'cluster';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const numCPUs = os.cpus().length;

// Report generation logic (shared but executed per worker)
const handleReportRequest = async (payload: any, res: express.Response) => {
    try {
        // Use a unique ID for temp files - include worker PID to avoid collisions
        const requestId = `${process.pid}_${Date.now()}`;
        const htmlFilename = `temp_report_${requestId}.html`;
        const pdfFilename = `temp_report_${requestId}.pdf`;

        // Prepare config
        const config = {
            ...defaultConfig,
            meta: {
                ...defaultConfig.meta,
                ...payload.meta
            },
            output: {
                ...defaultConfig.output,
                filename: htmlFilename
            }
        };

        // Inject cover image absolute path if needed
        // Fix: Convert to Base64 to ensure it loads in PDF
        if (!config.meta.coverUrl || (typeof config.meta.coverUrl === 'string' && !config.meta.coverUrl.startsWith('file://') && !config.meta.coverUrl.startsWith('http') && !config.meta.coverUrl.startsWith('data:'))) {
            try {
                // Try multiple paths to find the asset
                const possiblePaths = [
                    path.join(process.cwd(), 'public', 'assets', 'cover_bg.png'),
                    path.join(process.cwd(), 'dist', 'client', 'assets', 'cover_bg.png'),
                    path.join(__dirname, '../public/assets/cover_bg.png')
                ];

                let coverBgPath = '';
                for (const p of possiblePaths) {
                    if (fs.existsSync(p)) {
                        coverBgPath = p;
                        break;
                    }
                }

                if (coverBgPath) {
                    const bitmap = fs.readFileSync(coverBgPath);
                    const base64Image = Buffer.from(bitmap).toString('base64');
                    // Ensure proper MIME type is prepended
                    config.meta.coverUrl = `data:image/png;base64,${base64Image}`;
                    console.log(`🖼️  [Worker ${process.pid}] Injected Base64 cover from: ${coverBgPath}`);
                } else {
                    console.warn(`⚠️  Cover image not found in any checked paths: ${possiblePaths.join(', ')}`);
                }
            } catch (err) {
                console.error("Failed to load cover image:", err);
            }
        }

        const customData = { ...payload };

        // 1. Generate HTML
        console.log(`📊 [Worker ${process.pid}] Generating HTML...`);
        const result = await generateReport(config, customData);

        if (!result || !result.success) {
            throw new Error("Failed to generate HTML report");
        }

        // 2. Generate PDF
        console.log(`📄 [Worker ${process.pid}] Converting to PDF...`);
        // Pass a longer timeout for production robustness (2 mins)
        const pdfPath = await generatePDF(htmlFilename, pdfFilename, 120000);

        // 3. Stream PDF back to client
        console.log(`🚀 [Worker ${process.pid}] Streaming PDF response...`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=security_report.pdf');

        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

        // Cleanup temp files after stream ends
        fileStream.on('close', () => {
            try {
                if (fs.existsSync(result.outputPath)) fs.unlinkSync(result.outputPath);
                if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
            } catch (e) {
                console.error(`[Worker ${process.pid}] Error cleaning up:`, e);
            }
        });

    } catch (error) {
        console.error(`❌ [Worker ${process.pid}] Error processing request:`, error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate report", details: error.message });
        }
    }
};

if (cluster.isPrimary) {
    console.log(`🚀 Master process ${process.pid} is running`);
    console.log(`🔥 Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`❌ Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });

} else {
    // Worker Process
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.static(path.join(process.cwd(), 'public'))); // Serve static files explicitly from current working directory's public folder
    app.use(express.static('public')); // Serve static files from public directory

    app.post('/api/generate-report', async (req, res) => {
        console.log(`📩 [Worker ${process.pid}] Received POST request`);
        await handleReportRequest(req.body, res);
    });

    app.get('/api/generate-report', async (req, res) => {
        console.log(`📩 [Worker ${process.pid}] Received GET request`);
        try {
            const dataParam = req.query.data as string;
            const dataUrlParam = req.query.dataurl as string;
            let payload = {};

            if (dataUrlParam) {
                console.log(`🌐 [Worker ${process.pid}] Fetching payload from URL: ${dataUrlParam}`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                try {
                    const fetchRes = await fetch(dataUrlParam, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!fetchRes.ok) throw new Error(`Fetch failed: ${fetchRes.statusText}`);
                    payload = await fetchRes.json();
                } catch (err: any) {
                    clearTimeout(timeoutId);
                    if (err.name === 'AbortError') throw new Error("Timeout fetching data from URL");
                    throw err;
                }
            } else if (req.query.demo) {
                console.log(`🚀 [Worker ${process.pid}] Demo mode requested. Generating full report.`);
                payload = demoFullReportData;
            } else if (dataParam) {
                payload = JSON.parse(decodeURIComponent(dataParam));
            } else {
                return res.status(400).json({ error: "Missing 'data' or 'dataurl' query parameter" });
            }

            await handleReportRequest(payload, res);
        } catch (e) {
            console.error(`❌ [Worker ${process.pid}] GET Error:`, e);
            res.status(400).json({ error: "Invalid request", details: e.message });
        }
    });

    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', worker: process.pid });
    });

    app.get('/', async (req, res) => {
        console.log(`🌐 [Worker ${process.pid}] Serving web report view...`);
        try {
            const dataParam = req.query.data as string;
            const dataUrlParam = req.query.dataurl as string;
            let payload = {};

            if (req.query.demo) {
                payload = demoFullReportData;
            } else if (dataUrlParam) {
                // Reuse fetch logic? For now, simple fetch here or refactor.
                // Let's duplicate briefly for speed, or better, refactor handleReportRequest to return HTML if requested.
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                const fetchRes = await fetch(dataUrlParam, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!fetchRes.ok) throw new Error(`Fetch failed: ${fetchRes.statusText}`);
                payload = await fetchRes.json();
            } else if (dataParam) {
                payload = JSON.parse(decodeURIComponent(dataParam));
            }

            // Generate HTML only
            const requestId = `${process.pid}_${Date.now()}`;
            const config = {
                ...defaultConfig,
                meta: { ...defaultConfig.meta, ...payload['meta'] },
                output: { ...defaultConfig.output, filename: `temp_web_${requestId}.html` }
            };

            // Inject base64 cover for web view to ensure it renders without 404s
            if (!payload['meta']) payload['meta'] = {};
            if (!payload['meta'].coverUrl || (typeof payload['meta'].coverUrl === 'string' && !payload['meta'].coverUrl.startsWith('data:'))) {
                try {
                    const coverBgPath = path.resolve(process.cwd(), 'public/assets/cover_bg.png');
                    if (fs.existsSync(coverBgPath)) {
                        const bitmap = fs.readFileSync(coverBgPath);
                        const base64Image = Buffer.from(bitmap).toString('base64');
                        const dataUri = `data:image/png;base64,${base64Image}`;
                        payload['meta'].coverUrl = dataUri;
                        // Also update config.meta for renderer
                        config.meta.coverUrl = dataUri;
                        console.log(`🖼️  [Worker ${process.pid}] Injected Base64 cover background for Web View`);
                    } else {
                        console.warn(`⚠️ [Worker ${process.pid}] Cover image not found at ${coverBgPath}`);
                    }
                } catch (e) {
                    console.error(`⚠️ [Worker ${process.pid}] Failed to inject base64 cover:`, e);
                }
            }

            const result = await generateReport(config, payload);
            if (result && result.success) {
                const html = fs.readFileSync(result.outputPath, 'utf-8');
                res.send(html);
                // cleanup
                fs.unlinkSync(result.outputPath);
            } else {
                res.status(500).send("Failed to render report.");
            }
        } catch (e) {
            console.error(`❌ [Worker ${process.pid}] Web View Error:`, e);
            res.status(500).send(`Error generating report: ${e.message}`);
        }
    });

    app.listen(PORT, () => {
        console.log(`✅ Worker ${process.pid} listening on port ${PORT}`);
        // Warm up browser
        BrowserManager.getInstance().getBrowser().then(() => {
            console.log(`🔥 [Worker ${process.pid}] Browser warmed up and ready`);
        }).catch(err => console.error(`⚠️ [Worker ${process.pid}] Browser warm-up failed:`, err));
    });
}
