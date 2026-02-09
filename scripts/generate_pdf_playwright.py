import asyncio
import os
import subprocess
import sys
import time
from http.server import SimpleHTTPRequestHandler
from threading import Thread
import socketserver

from playwright.async_api import async_playwright

PORT = 8080
DIST_DIR = "dist"

def run_build():
    print("--- Step 1: Building React App ---")
    # We need to build the app so 'dist' is fresh
    cmd = "npm run build"
    if os.name == 'nt':
        cmd = "npm.cmd run build"
    
    ret = subprocess.run(cmd, shell=True)
    if ret.returncode != 0:
        print("Build failed")
        sys.exit(1)

def start_server():
    print(f"--- Step 2: Starting Local Server on port {PORT} ---")
    os.chdir(DIST_DIR)
    Handler = SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()

async def generate_pdf():
    print("--- Step 3: Generating PDF with Playwright ---")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Define report types to generate
        report_types = ["full", "dpdp", "certin", "bfsi"]
        
        for report_type in report_types:
            print(f"\n--- Generating Report: {report_type.upper()} ---")
            
            # Navigate to the local server with query param
            url = f"http://localhost:{PORT}/?type={report_type}"
            print(f"Navigating to {url}...")
            
            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
            except Exception as e:
                print(f"Navigation failed: {e}")
                
            print("Page title:", await page.title())
            
            # Give it a moment for any animations or final React effects
            await page.wait_for_timeout(2000)
            
            # Define output path (go up one level from 'dist')
            filename = f"obserasec_report_{report_type}.pdf"
            if report_type == "full":
                filename = "obserasec_report.pdf" # Keep original name for full report
                
            output_path = os.path.abspath(os.path.join("..", "reports", filename))
            
            print(f"Printing to {output_path}...")
            
            # PDF options to mimic "Ctrl+P" -> Save as PDF
            await page.pdf(
                path=output_path,
                format="A4",
                print_background=True,
                margin={
                    "top": "0",
                    "right": "0",
                    "bottom": "0",
                    "left": "0"
                },
                display_header_footer=False,
                prefer_css_page_size=True
            )
            
            print(f"PDF Generation complete: {filename}")
            
        await browser.close()

def main():
    # 1. Build
    run_build()
    
    # 2. Start Server in background
    # We are already in project root, but run_build might not change dir. 
    # Actually run_build uses shell, doesn't change python CWD.
    # But start_server does os.chdir. So we fork the process or just use a thread?
    # Thread is easier.
    
    # Ensure reports dir exists
    if not os.path.exists("reports"):
        os.makedirs("reports")
        
    server_thread = Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Give server a second to start
    time.sleep(2)
    
    # 3. Generate PDF
    try:
        asyncio.run(generate_pdf())
    except Exception as e:
        # distinct handling for unicode errors in windows console
        try:
            print(f"Error: {e}")
        except UnicodeEncodeError:
            print(f"Error: {e}".encode('utf-8', errors='replace').decode('utf-8'))
    finally:
        print("Done.")

if __name__ == "__main__":
    main()
