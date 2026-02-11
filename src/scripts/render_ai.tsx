
import { generateReport, defaultConfig } from './comprehensiveRenderer';
import { emptyReportData } from '../data/emptyReportData';

console.log("🤖 Loading Empty Data Payload...");

// Merging explicit overrides with the full empty dataset to prevent partial data leakage
const customData = {
    ...emptyReportData,
    detailedfindings: {
        title: "Detailed Findings",
        description: "No findings provided.",
        findings: []
    }
};

import path from 'path';

// Resolve absolute path for cover image to work with Puppeteer
const coverBgPath = path.resolve(process.cwd(), 'public/assets/cover_bg.png');
// Convert to file URL format (handles Windows backslashes)
const coverBgUrl = `file://${coverBgPath.replace(/\\/g, '/')}`;

console.log(`🖼️  Using Cover Image: ${coverBgUrl}`);

// Config override to ensure output file name differs
const configOverride: any = {
    meta: {
        ...emptyReportData.meta,
        coverUrl: coverBgUrl
    },
    output: {
        filename: "ai_generated_report.html",
        format: "html",
        includeStyles: true
    },
    components: [
        { name: "CoverPage", enabled: true, order: 1 },
        { name: "DocumentControl", enabled: true, order: 2 },
        { name: "TableOfContents", enabled: true, order: 3 },
        { name: "ExecutiveSummary", enabled: true, order: 4 },
        { name: "ScopeMethodology", enabled: true, order: 5 },
        { name: "RiskDashboard", enabled: true, order: 6 },
        { name: "NetworkArchitecture", enabled: true, order: 7 },
        { name: "GeoThreatIntel", enabled: true, order: 8 },
        { name: "DetailedFindings", enabled: false, order: 9 },
        { name: "VulnTrending", enabled: true, order: 10 },
        { name: "ComplianceMapping", enabled: true, order: 11 },
        { name: "HostSummary", enabled: true, order: 12 },
        { name: "MermaidDiagram", enabled: true, order: 13 },
        { name: "EntityGraph", enabled: true, order: 14 },
        { name: "RemediationRoadmap", enabled: true, order: 15 },
        { name: "Appendices", enabled: true, order: 16 },
        { name: "BackCover", enabled: true, order: 20 }
    ]
};

generateReport({ ...defaultConfig, ...configOverride }, customData);
