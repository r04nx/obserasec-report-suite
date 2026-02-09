
import subprocess
import os
import sys
from pypdf import PdfWriter

def run_command(command, cwd=None, shell=True, timeout=None):
    print(f"Running: {command}")
    try:
        result = subprocess.run(command, cwd=cwd, shell=shell, text=True, capture_output=True, timeout=timeout)
        if result.returncode != 0:
            print(f"Error executing command: {command}")
            print("Stdout:", result.stdout)
            print("Stderr:", result.stderr)
            return False
        return True
    except subprocess.TimeoutExpired:
        print(f"Timeout expired for command: {command}")
        return False

def wsl_path(win_path):
    if ':' not in win_path:
        return win_path
    drive, rest = win_path.split(':', 1)
    drive_letter = drive.lower()
    wsl_path = f"/mnt/{drive_letter}{rest.replace(os.sep, '/')}"
    return wsl_path

def main():
    # We assume we are running from the project root (.. from this script)
    # Or we can detect it
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(project_root)
    
    reports_dir = os.path.join(project_root, "reports")
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)

    print("--- Step 1: Building React App ---")
    if not run_command("npm run build"):
        sys.exit(1)

    print("--- Step 2: SSR HTML Generation ---")
    if not run_command("npx tsx src/scripts/render.tsx"):
        sys.exit(1)

    html_path = os.path.join(reports_dir, "obserasec_report.html")
    if not os.path.exists(html_path):
        # Check if it was generated in root by mistake
        root_html = os.path.join(project_root, "final_report.html")
        if os.path.exists(root_html):
             os.rename(root_html, html_path)
        else:
            print(f"Error: {html_path} not found.")
            sys.exit(1)

    print("--- Step 3: Preparing HTML for WeasyPrint (WSL) ---")
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix asset paths for WeasyPrint
    content = content.replace('"/assets/', '"dist/assets/')
    content = content.replace("'/assets/", "'dist/assets/")
    content = content.replace('url(/assets/', 'url(dist/assets/')
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("--- Step 4: Generating PDF using Chunked Renderer (WSL) ---")
    
    # Chunking Logic
    parts = content.split('<div class="a4-page')
    header = parts[0]
    pages = parts[1:]
    
    print(f"Found {len(pages)} pages to render.")
    
    pdf_files = []
    merger = PdfWriter()
    
    for i in range(len(pages)):
        page_content = '<div class="a4-page' + pages[i]
        current_html = header + page_content
        if i < len(pages) - 1:
            current_html += "</div></div></body></html>"
        
        temp_html_name = f"temp_page_{i}.html"
        temp_pdf_name = f"temp_page_{i}.pdf"
        temp_html_path = os.path.join(reports_dir, temp_html_name)
        temp_pdf_path = os.path.join(reports_dir, temp_pdf_name)
        
        with open(temp_html_path, 'w', encoding='utf-8') as f:
            f.write(current_html)
            
        print(f"Rendering Page {i+1}/{len(pages)}...")
        
        # We need to use WSL to run weasyprint
        wsl_html = wsl_path(temp_html_path)
        wsl_pdf = wsl_path(temp_pdf_path)
        
        wsl_cmd = f"wsl bash -c \"source .venv/bin/activate && weasyprint '{wsl_html}' '{wsl_pdf}' --presentational-hints\""
        
        if run_command(wsl_cmd, timeout=300):
            pdf_files.append(temp_pdf_path)
            merger.append(temp_pdf_path)
            try: os.remove(temp_html_path)
            except: pass
        else:
            print(f"Error rendering page {i+1}")
            sys.exit(1)

    final_pdf_path = os.path.join(reports_dir, "obserasec_report.pdf")
    merger.write(final_pdf_path)
    merger.close()
    
    # Cleanup temp PDFs
    for p in pdf_files:
        try: os.remove(p)
        except: pass

    print(f"--- SUCCESS: PDF Generated at {final_pdf_path} ---")

if __name__ == "__main__":
    main()

