
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Helper for ESM directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORT_URL = 'http://localhost:8080/?print=true'; // Adjust based on your dev server URL
const OUTPUT_PATH = path.join(__dirname, '../data/reportData.ts');
const FINAL_PDF_PATH = 'c:/Users/Wissen/Downloads/report/obserasec_suite/output/ObseraSec_Report.pdf';
const JSON_DATA_PATH = path.join(__dirname, '../data/final_report.json');

async function renderReport() {
    console.log('Starting PDF Rendering...');

    if (!fs.existsSync(JSON_DATA_PATH)) {
        console.error(`Error: Data file not found at ${JSON_DATA_PATH}`);
        process.exit(1);
    }

    // Read the generated JSON data
    const reportData = fs.readFileSync(JSON_DATA_PATH, 'utf-8');

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to A4 size roughly for rendering consistency
    await page.setViewport({ width: 1200, height: 1600 });

    // Prepare Data URL
    const base64Data = Buffer.from(reportData).toString('base64');
    const dataUrl = `data:application/json;base64,${base64Data}`;
    const finalUrl = `${REPORT_URL}&dataurl=${encodeURIComponent(dataUrl)}`;

    try {
        // 1. Prepare Data URL (using the local file path as a reference or serving it)
        // Since the user asked for dataurl parameter, we will use the base64 one but with a shorter payload if needed, 
        // OR better yet, we use a local HTTP server to serve the JSON if it's too large.
        // However, for 18k findings, base64 URL might exceed browser limits (~2MB).
        // Let's use the local file serving approach: 
        // 1. Copy final_report.json to public/ folder if needed, or just use direct injection which is most reliable.

        console.log(`Navigating to ${REPORT_URL}...`);
        await page.goto(REPORT_URL, { waitUntil: 'networkidle0', timeout: 180000 });
        console.log('Navigation successful.');

        console.log(`Injecting report data (${reportData.length} bytes)...`);
        await page.evaluate((data) => {
            try {
                const parsed = JSON.parse(data);
                (window as any).REPORT_DATA = parsed;
                window.dispatchEvent(new CustomEvent('report-data-updated'));
                console.log("Data injection and event dispatch complete.");
            } catch (e) {
                console.error("Injection failed", e);
            }
        }, reportData);

        // 3. Wait for content to stabilize (massive reports need time to layout 500+ pages)
        console.log('Waiting for content to stabilize and charts to render (120s)...');
        await new Promise(r => setTimeout(r, 120000));

        // 4. Print to PDF
        console.log(`Generating PDF at ${FINAL_PDF_PATH}... (This can take up to 15 minutes for 18k findings)`);

        // Ensure output dir exists
        const outputDir = path.dirname(FINAL_PDF_PATH);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        await page.pdf({
            path: FINAL_PDF_PATH,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '0mm',
                right: '0mm'
            },
            displayHeaderFooter: false,
            timeout: 900000 // 15 minutes for massive PDF generation
        });

        console.log('PDF generated successfully!');

    } catch (error) {
        console.error('Rendering failed:', error);
    } finally {
        await browser.close();
    }
}

renderReport();
