# ObseraOne Security Report Suite

ObseraOne is a high-performance, dynamic security reporting engine designed to generate premium, audit-ready PDF reports from vulnerability scan data. It features a modern React-based visualization layer and a dedicated Puppeteer-based generation server.

## 🚀 Key Features

- **Dynamic Data Injection**: Supports multiple data ingestion methods (URL parameters, direct JSON URLs, and global object injection).
- **Premium Aesthetics**: Built with a custom design system featuring HSL-tailored colors, glassmorphism, and high-fidelity data visualizations.
- **Automated PDF Generation**: Fully integrated Puppeteer server that transforms web-based dashboards into pixel-perfect PDF documents.
- **Compliance Templates**: Pre-built templates for **DPDP**, **CERT-In**, and **BFSI** (RBI/SEBI) regulatory frameworks.
- **Interactive Visualizations**: High-performance charts for risk trending, vulnerability distribution, and network entity graphing.

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Variables (Custom Design System)
- **Icons**: Lucide React
- **Generation**: Puppeteer, Node.js (Vite + Express)
- **Visuals**: Recharts, Mermaid.js, D3 (Force-directed graphs)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation

```bash
git clone <repository-url>
cd obserasec_suite
pnpm install
```

### Running Locally

1. **Start the Development Server**:
   ```bash
   pnpm run dev
   ```
   *The report will be available at `http://localhost:5173/`.*

2. **Start the PDF Generation Server**:
   ```bash
   npx tsx src/server.ts
   ```

## 📄 Generating Reports

The generation server provides an API to convert report data into PDFs.

### PDF Generation API
- **Endpoint**: `POST /generate`
- **Body**: `{ "data": Object, "format": "pdf" }`

### AI-Native Dynamic Mode (V2)
The report now supports a fully decoupled, layout-driven architecture. This allows AI agents and LLMs to construct custom report structures without adhering to a rigid JSON schema.
- **Path**: `http://localhost:5173/?dataUrl=/dynamic_demo_payload.json`
- **Key Feature**: The `layout` array in JSON defines the order and props of components.
- **Generic Support**: Use the `text_section` component type to render arbitrary AI-generated text, grids, and tables.

## 📊 Data Structure

The report expects a JSON payload matching the `ObseraReportData` interface. See `src/data/reportData.ts` for the full schema. A complete example is provided in:
`public/demo_report_data.json`

## 🤝 Project Structure

- `src/components/report`: All individual report sections (Cover, Risk Dashboard, etc.).
- `src/hooks/useReportData.ts`: Core logic for data ingestion and mapping.
- `src/server.ts`: Puppeteer-based rendering and PDF conversion logic.
- `src/index.css`: Implementation of the ObseraDesign system using Tailwind and HSL variables.

---
© 2026 ObseraSEC Security. Confidential.
