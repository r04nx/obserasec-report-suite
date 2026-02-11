import puppeteer from 'puppeteer';

class BrowserManager {
    private static instance: BrowserManager;
    private browser: puppeteer.Browser | null = null;
    private isLaunching: boolean = false;

    private constructor() { }

    public static getInstance(): BrowserManager {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }

    public async getBrowser(): Promise<puppeteer.Browser> {
        if (this.browser && this.browser.isConnected()) {
            return this.browser;
        }

        if (this.isLaunching) {
            // Wait for launch to complete
            await new Promise(resolve => {
                const check = setInterval(() => {
                    if (this.browser && this.browser.isConnected()) {
                        clearInterval(check);
                        resolve(true);
                    }
                }, 100);
            });
            if (this.browser) return this.browser;
        }

        this.isLaunching = true;
        console.log("🚀 Launching new browser instance...");

        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });
            console.log("✅ Browser launched successfully");
        } catch (error) {
            console.error("❌ Failed to launch browser:", error);
            throw error;
        } finally {
            this.isLaunching = false;
        }

        if (!this.browser) throw new Error("Browser failed to initialize");
        return this.browser;
    }

    public async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log("🛑 Browser closed");
        }
    }
}

export default BrowserManager;
