
import fs from 'fs';
import path from 'path';
import {
    reportMeta,
    documentControl,
    executiveSummary,
    tocSections,
    severityDistribution,
    vulnByCategory,
    riskTrend,
    vulnByHost,
    scopeData,
    networkAssets,
    subnets,
    geoData,
    findings,
    vulnTrending,
    remediationRoadmap,
    complianceData,
    entityGraphData,
    mermaidDiagramData
} from '../data/reportData';

// Reconstruct the object as seen in useReportData.ts including the "missing" properties as undefined/null
// to accurately reflect what the app uses.

const defaultData = {
    meta: reportMeta,
    docControl: documentControl,
    execSummary: executiveSummary,
    toc: tocSections,
    severityDist: severityDistribution,
    categoryDist: vulnByCategory,
    riskTrend: riskTrend,
    hostSummary: vulnByHost,
    hostFindings: vulnByHost,
    scope: scopeData,
    networkAssets: networkAssets,
    subnets: subnets,
    geoData: geoData,
    findings: findings,
    trending: vulnTrending,
    remediation: remediationRoadmap,
    complianceMapping: complianceData,
    compliance: {
        dpdp: undefined,
        certin: undefined,
        sebi: undefined,
        rbi: undefined,
    },
    entityGraph: entityGraphData,
    mermaidDiagram: mermaidDiagramData,
};

const outputPath = path.resolve(process.cwd(), 'default_payload.json');
fs.writeFileSync(outputPath, JSON.stringify(defaultData, null, 2));

console.log(`✅ Default payload dumped to ${outputPath}`);
