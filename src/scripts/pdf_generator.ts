
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



import BrowserManager from '../utils/BrowserManager';

export const generatePDF = async (inputFile: string, outputFile: string, timeoutMs: number = 60000) => {
    const inputPath = path.resolve(process.cwd(), inputFile);
    const outputPath = path.resolve(process.cwd(), outputFile);

    console.log(`🚀 Starting PDF generation (Timeout: ${timeoutMs}ms)...`);

    let page;
    try {
        const browserManager = BrowserManager.getInstance();
        const browser = await browserManager.getBrowser();

        page = await browser.newPage();

        // Determine source URL
        const sourceUrl = inputFile.startsWith('http')
            ? inputFile
            : `file:///${path.resolve(process.cwd(), inputFile).replace(/\\/g, '/')}`;

        console.log(`🌐 Loading page: ${sourceUrl}`);

        await page.goto(sourceUrl, {
            waitUntil: 'networkidle2', // better for dev servers with persistent connections/HMR
            timeout: timeoutMs
        });

        console.log(`📄 Printing to PDF...`);
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            timeout: timeoutMs
        });

        console.log(`✅ PDF generated successfully: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error("❌ PDF Generation failed:", error);
        // If browser crashed, we might want to close it so next request spawns a fresh one
        if (BrowserManager.getInstance()['browser'] && !BrowserManager.getInstance()['browser']?.isConnected()) {
            await BrowserManager.getInstance().closeBrowser();
        }
        throw error;
    } finally {
        if (page) await page.close();
    }
};

// Check if running directly
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    generatePDF('ai_generated_report.html', 'ai_generated_report.pdf').catch(err => {
        console.error("❌ Error generating PDF:", err);
        process.exit(1);
    });
}

