
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
const numCPUs = Math.min(os.cpus().length, 2); // Cap at 2 workers for local stability with Puppeteer

const VITE_SERVER_URL = process.env.VITE_SERVER_URL || 'http://localhost:8080';

// Report generation logic (shared but executed per worker)
const handleReportRequest = async (payload: any, res: express.Response, queryParams: any = {}) => {
    try {
        // Use a unique ID for temp files - include worker PID to avoid collisions
        const requestId = `${process.pid}_${Date.now()}`;
        const pdfFilename = `temp_report_${requestId}.pdf`;

        console.log(`📊 [Worker ${process.pid}] Preparing report for PDF conversion...`);

        // Strategy selection: 
        // 1. If we want to use the Vite dev server for rendering (max fidelity)
        // 2. Otherwise use the standalone comprehensiveRenderer

        let sourceUrl: string;

        if (process.env.USE_VITE_RENDER === 'true' || queryParams.vitesource === 'true' || true) { // Defaulting to true for now as requested
            // Use Vite server. Construct URL with parameters
            const url = new URL(VITE_SERVER_URL);
            url.searchParams.set('print', 'true');
            if (queryParams.demo) url.searchParams.set('demo', 'true');
            if (queryParams.type) url.searchParams.set('type', queryParams.type);

            // If we have a payload and NOT in demo mode, we might need a way to pass it.
            // For now, let's support it via dataurl or data parameter if it's small enough.
            if (!queryParams.demo && payload) {
                const dataString = JSON.stringify(payload);
                if (dataString.length < 4000) { // URL length limit safe range
                    url.searchParams.set('data', encodeURIComponent(dataString));
                } else {
                    // Too large for GET - for now, we'd need a temp file or the standalone renderer
                    console.warn(`⚠️ [Worker ${process.pid}] Payload too large for Vite GET, falling back to local renderer`);
                    return await handleStandaloneRender(payload, res, requestId);
                }
            }
            sourceUrl = url.toString();
        } else {
            return await handleStandaloneRender(payload, res, requestId);
        }

        // 2. Generate PDF via Puppeteer hitting Vite
        console.log(`📄 [Worker ${process.pid}] Converting URL to PDF: ${sourceUrl}`);
        const pdfPath = await generatePDF(sourceUrl, pdfFilename, 120000);

        // 3. Stream PDF back to client
        await streamFileAndCleanup(pdfPath, res, []);
    } catch (error) {
        console.error(`❌ [Worker ${process.pid}] Error processing request:`, error);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Failed to generate report",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
};

// Standalone renderer fallback
const handleStandaloneRender = async (payload: any, res: express.Response, requestId: string) => {
    const htmlFilename = `temp_report_${requestId}.html`;
    const pdfFilename = `temp_report_${requestId}.pdf`;

    const config = {
        ...defaultConfig,
        meta: { ...defaultConfig.meta, ...payload.meta },
        output: { ...defaultConfig.output, filename: htmlFilename }
    };

    // Inject base64 cover
    const coverBgPath = path.resolve(process.cwd(), 'public/assets/cover_bg.png');
    if (fs.existsSync(coverBgPath)) {
        const base64Image = Buffer.from(fs.readFileSync(coverBgPath)).toString('base64');
        config.meta.coverUrl = `data:image/png;base64,${base64Image}`;
    }

    const result = await generateReport(config, payload);
    const pdfPath = await generatePDF(htmlFilename, pdfFilename, 120000);

    await streamFileAndCleanup(pdfPath, res, [result.outputPath]);
};

// Common streaming logic
const streamFileAndCleanup = async (filePath: string, res: express.Response, extraFiles: string[]) => {
    console.log(`🚀 [Worker ${process.pid}] Streaming response...`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=security_report.pdf');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('close', () => {
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            extraFiles.forEach(f => {
                if (fs.existsSync(f)) fs.unlinkSync(f);
            });
        } catch (e) {
            console.error(`[Worker ${process.pid}] Error cleaning up:`, e);
        }
    });
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
        await handleReportRequest(req.body, res, req.query);
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
                // Return 400 or just empty payload for demo? User might want default report.
                // Let's stick to requiring one for now or default to demo if prompted.
                return res.status(400).json({ error: "Missing 'data' or 'dataurl' query parameter" });
            }

            await handleReportRequest(payload, res, req.query);
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
