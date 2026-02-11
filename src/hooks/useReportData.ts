import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as mockData from "../data/reportData";
import { ObseraReportData } from "../data/reportData";

export const useReportData = (): ObseraReportData => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<ObseraReportData | null>(null);

    useEffect(() => {
        // 1. Check for immediate global data (injected via Puppeteer)
        if ((window as any).REPORT_DATA) {
            console.log("Found global REPORT_DATA");
            setData((window as any).REPORT_DATA);
            return;
        }

        // 2. Listen for future updates
        const handleUpdate = () => {
            console.log("REPORT_DATA updated via event");
            setData((window as any).REPORT_DATA);
        };
        window.addEventListener('report-data-updated', handleUpdate);

        // 3. Fallback to URL params
        const rawData = searchParams.get("data") || searchParams.get("DATA");
        const dataUrl = searchParams.get("dataUrl") || searchParams.get("dataurl");

        if (rawData) {
            try {
                const decoded = JSON.parse(decodeURIComponent(rawData));
                setData(decoded);
            } catch (e) {
                console.error("Failed to parse data URL param", e);
            }
        } else if (dataUrl) {
            console.log("Fetching report data from:", dataUrl);
            fetch(dataUrl)
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.json();
                })
                .then((json) => {
                    console.log("Successfully loaded external data:", json);
                    setData(json);
                })
                .catch((e) => {
                    console.error("FAILED TO FETCH DATA.", e);
                });
        }

        return () => window.removeEventListener('report-data-updated', handleUpdate);
    }, [searchParams]);

    const isDemoMode = searchParams.get("demo") === "true";

    if (data) return data;

    // Only fallback to mock data if demo=true is explicitly requested
    if (isDemoMode) {
        return {
            meta: mockData.reportMeta,
            docControl: mockData.documentControl,
            execSummary: mockData.executiveSummary,
            toc: mockData.tocSections,
            severityDist: mockData.severityDistribution,
            categoryDist: mockData.vulnByCategory,
            riskTrend: mockData.riskTrend,
            hostSummary: mockData.vulnByHost,
            hostFindings: mockData.vulnByHost,
            scope: mockData.scopeData,
            networkAssets: mockData.networkAssets,
            subnets: mockData.subnets,
            geoData: mockData.geoData,
            findings: mockData.findings,
            trending: mockData.vulnTrending,
            remediation: mockData.remediationRoadmap,
            complianceMapping: mockData.complianceData,
            compliance: {
                dpdp: (mockData as any).dpdpData,
                certin: (mockData as any).certInData,
                sebi: (mockData as any).bfsiData,
                rbi: (mockData as any).bfsiData,
            },
            portScan: mockData.portScanResults,
            riskMatrix: mockData.riskMatrix,
            glossary: mockData.glossary,
            entityGraph: mockData.entityGraphData,
            mermaidDiagram: mockData.mermaidDiagramData,
        };
    }

    // Return an empty structure if not in demo mode and no dynamic data provided
    // This allows verification that the report is driven by the payload
    return {
        meta: { ...mockData.reportMeta, reportId: "EMPTY-SCAN", date: new Date().toLocaleDateString() }, // Keep basic scan info stub
        docControl: [],
        execSummary: { stats: [], description: "No data available in payload." },
        toc: [],
        severityDist: [],
        categoryDist: [],
        riskTrend: [],
        hostSummary: [],
        hostFindings: [],
        scope: { items: [] },
        networkAssets: [],
        subnets: [],
        geoData: { totalBlocked: 0, uniqueIPs: 0, c2Servers: 0, attackOrigins: [] },
        findings: [],
        trending: [],
        remediation: [],
        complianceMapping: [],
        compliance: {
            dpdp: null,
            certin: null,
            sebi: null,
            rbi: null,
        },
        portScan: [],
        riskMatrix: [],
        glossary: [],
        entityGraph: { nodes: [], links: [] },
        mermaidDiagram: null,
    } as any;
};
