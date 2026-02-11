# PDF Report Generator API

This service generates comprehensive security assessment reports in PDF format. It uses the Vite development server (port 8080) for rendering the React-based report, ensuring that the PDF output exactly matches the web view.

## Architecture

1.  **Vite Server (Port 8080):** Serves the React application. 
2.  **Backend Server (Port 3000):** Orchestrates PDF generation using Puppeteer pointing to the Vite server.
3.  **Puppeteer:** Navigates to the Vite URL, waits for diagrams/charts to render, and prints to PDF.

## Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Start the services:**
    - Terminal 1: `pnpm run dev` (Vite)
    - Terminal 2: `pnpm start` (Backend)


## Endpoints

### 1. `POST /api/generate-report`

Generates a PDF report based on the provided JSON payload.

*   **URL:** `/api/generate-report`
*   **Method:** `POST`
*   **Content-Type:** `application/json`
*   **Body:** See `examples/report_data_schema.json` for the full structure.

**Response:**
*   Returns a PDF file stream (`application/pdf`).

### 2. `GET /api/generate-report`

Generates a PDF report from a URL or demo data.

*   **URL:** `/api/generate-report`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `demo=true`: Generates a report with sample data.
    *   `dataurl=<URL>`: Fetches JSON payload from the specified URL.
    *   `data=<JSON_STRING>`: Uses URL-encoded JSON string as payload.

### 3. `GET /` (Web View)

Renders the report as an interactive HTML page. Useful for debugging layout and content before PDF generation.

*   **URL:** `/`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `demo=true`: Renders with sample data.
    *   `dataurl=<URL>`: Fetches JSON payload from the specified URL.

## JSON Data Structure

The report data is a JSON object comprising several sections. A complete example is available in `examples/report_data_schema.json`.

**Top-level keys:**
*   `meta`: Report metadata (title, client, date, etc.)
*   `docControl`: Version history, authors, reviewers.
*   `execSummary`: Executive summary metrics and text.
*   `scope`: Scope and methodology details.
*   `networkAssets`: List of assets.
*   `findings`: Array of detailed vulnerability findings.
*   `complianceMapping`: Complaince status against frameworks (ISO, NIST, etc.).
*   `mermaidDiagram`: Data for generating architecture diagrams.
*   `entityGraph`: Data for relationship graphs.

**Example `findings` item:**
```json
{
  "id": "OSEC-F001",
  "title": "Remote Code Execution via SMBv1",
  "severity": "Critical",
  "cvss": 9.8,
  "description": "...",
  "remediation": "..."
}
```
