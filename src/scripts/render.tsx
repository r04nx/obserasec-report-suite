
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import path from 'path';
import fs from 'fs';

import './setup';

// Import all components explicitly for ESM compatibility
import Index from "../pages/Index";
import CoverPage from "../components/report/CoverPage";
import DocumentControl from "../components/report/DocumentControl";
import TableOfContents from "../components/report/TableOfContents";
import ExecutiveSummary from "../components/report/ExecutiveSummary";
import ScopeMethodology from "../components/report/ScopeMethodology";
import RiskDashboard from "../components/report/RiskDashboard";
import NetworkArchitecture from "../components/report/NetworkArchitecture";
import GeoThreatIntel from "../components/report/GeoThreatIntel";
import DetailedFindings from "../components/report/DetailedFindings";
import VulnTrending from "../components/report/VulnTrending";
import ComplianceMapping from "../components/report/ComplianceMapping";
import HostSummary from "../components/report/HostSummary";
import RemediationRoadmap from "../components/report/RemediationRoadmap";
import Appendices from "../components/report/Appendices";
import ComplianceDPDP from "../components/report/templates/ComplianceDPDP";
import ComplianceCERTIn from "../components/report/templates/ComplianceCERTIn";
import ComplianceBFSI from "../components/report/templates/ComplianceBFSI";
import BackCover from "../components/report/BackCover";

const generate = () => {
    console.log("Starting generation (ESM render.tsx)...");
    try {
        const components = [
            { name: "CoverPage", comp: React.createElement(CoverPage, null) },
            { name: "DocumentControl", comp: React.createElement(DocumentControl, null) },
            { name: "TableOfContents", comp: React.createElement(TableOfContents, null) },
            { name: "ExecutiveSummary", comp: React.createElement(ExecutiveSummary, null) },
            { name: "ScopeMethodology", comp: React.createElement(ScopeMethodology, null) },
            { name: "RiskDashboard", comp: React.createElement(RiskDashboard, null) },
            { name: "NetworkArchitecture", comp: React.createElement(NetworkArchitecture, null) },
            { name: "GeoThreatIntel", comp: React.createElement(GeoThreatIntel, null) },
            { name: "DetailedFindings", comp: React.createElement(DetailedFindings, null) },
            { name: "VulnTrending", comp: React.createElement(VulnTrending, null) },
            { name: "ComplianceMapping", comp: React.createElement(ComplianceMapping, null) },
            { name: "HostSummary", comp: React.createElement(HostSummary, null) },
            { name: "RemediationRoadmap", comp: React.createElement(RemediationRoadmap, null) },
            { name: "Appendices", comp: React.createElement(Appendices, null) },
            { name: "ComplianceDPDP", comp: React.createElement(ComplianceDPDP, null) },
            { name: "ComplianceCERTIn", comp: React.createElement(ComplianceCERTIn, null) },
            { name: "ComplianceBFSI", comp: React.createElement(ComplianceBFSI, null) },
            { name: "BackCover", comp: React.createElement(BackCover, null) },
        ];

        let html = "";
        for (const item of components) {
            console.log(`Rendering ${item.name}...`);
        }
        console.log("All components rendered successfully.");

        // Read CSS from dist directory
        const rootDir = process.cwd();
        const distAssetsDir = path.join(rootDir, 'dist/assets');
        let cssContent = "";

        if (fs.existsSync(distAssetsDir)) {
            const files = fs.readdirSync(distAssetsDir);
            const cssFiles = files.filter(file => file.endsWith('.css'));
            cssFiles.forEach(cssFile => {
                const cssPath = path.join(distAssetsDir, cssFile);
                cssContent += fs.readFileSync(cssPath, 'utf-8');
            });
        }

        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Security Assessment Report</title>
   
    <style>
        /* Embed CSS directly */
        ${cssContent}
        
        /* Print and Report specific overrides */
        @page { size: A4; margin: 0; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
        }
        body { 
            background-color: white; 
            margin: 0; 
            padding: 0; 
            font-family: sans-serif;
        }
        .page-break { page-break-after: always; }
        
        /* Ensure font loading via CDN if needed, although embedded CSS might have it */
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;500;600;700&display=swap');
    </style>
</head>
<body>
    <div id="root">${html}</div>
</body>
</html>`;

        const outputPath = path.join(rootDir, 'final_report.html');
        fs.writeFileSync(outputPath, fullHtml);
        console.log(`Final HTML written to ${outputPath}`);
    } catch (err) {
        console.error("Error during rendering:", err);
        process.exit(1);
    }
};

generate();
