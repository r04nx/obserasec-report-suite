import React from "react";
import CoverPage from "./CoverPage";
import RiskDashboard from "./RiskDashboard";
import GenericSection from "./GenericSection";
import DetailedFindings from "./DetailedFindings";
import HostSummary from "./HostSummary";
import DocumentControl from "./DocumentControl";
import TableOfContents from "./TableOfContents";
import ExecutiveSummary from "./ExecutiveSummary";
import ScopeMethodology from "./ScopeMethodology";
import NetworkArchitecture from "./NetworkArchitecture";
import GeoThreatIntel from "./GeoThreatIntel";
import VulnTrending from "./VulnTrending";
import ComplianceMapping from "./ComplianceMapping";
import RemediationRoadmap from "./RemediationRoadmap";
import Appendices from "./Appendices";
import BackCover from "./BackCover";

interface DynamicBlock {
    type: string;
    props: any;
}

interface DynamicReportProps {
    layout: DynamicBlock[];
    meta: any;
    rawReportData: any; // For backward compatibility if needed
}

const componentRegistry: Record<string, React.FC<any>> = {
    cover: CoverPage,
    risk_dashboard: RiskDashboard,
    text_section: GenericSection,
    detailed_findings: DetailedFindings,
    host_summary: HostSummary,
    doc_control: DocumentControl,
    toc: TableOfContents,
    exec_summary: ExecutiveSummary,
    scope: ScopeMethodology,
    network_arch: NetworkArchitecture,
    geo_intel: GeoThreatIntel,
    vuln_trending: VulnTrending,
    compliance_mapping: ComplianceMapping,
    remediation: RemediationRoadmap,
    appendices: Appendices,
    back_cover: BackCover,
};

const DynamicReport: React.FC<DynamicReportProps> = ({ layout, meta, rawReportData }) => {
    if (!layout || !Array.isArray(layout)) {
        return (
            <div className="p-10 text-white bg-red-900/20 border border-red-500 rounded">
                Error: Dynamic layout is missing or invalid.
            </div>
        );
    }

    // Helper to resolve specific data slices for legacy components
    const resolveData = (type: string, manualData: any, fullReport: any) => {
        if (manualData) return manualData;

        // Intelligent mapping for standard components
        switch (type) {
            case 'toc':
                return fullReport.toc || [];
            case 'exec_summary':
                return fullReport.execSummary || {};
            case 'cover':
                return fullReport; // Cover often uses top-level meta
            case 'doc_control':
                return fullReport.docControl || {};
            case 'scope':
                return fullReport.scope || {};
            case 'network_arch':
                return {
                    assets: fullReport.networkAssets,
                    subnets: fullReport.subnets
                };
            case 'geo_intel':
                return fullReport.geoData || {};
            case 'detailed_findings':
                return fullReport.findings || [];
            case 'vuln_trending':
                return {
                    trending: fullReport.trending,
                    history: fullReport.riskTrend
                };
            case 'compliance_mapping':
                return fullReport.complianceMapping || {};
            case 'host_summary':
                // The HostSummary component expects a list of assets (ip, hostname, risk, etc.)
                // In the new JSON, this is stored under 'networkAssets', not 'hostSummary' (which has aggregate counts).
                return fullReport.networkAssets || [];
            case 'remediation':
                return fullReport.remediation || {};
            case 'appendices':
                return {
                    portScan: fullReport.portScan,
                    glossary: fullReport.glossary
                };
            default:
                // For RiskDashboard and others that might expect root
                return fullReport;
        }
    };

    return (
        <>
            {layout.map((block, index) => {
                const Component = componentRegistry[block.type];
                if (!Component) {
                    console.warn(`Unknown component type: ${block.type}`);
                    return null;
                }

                const componentData = resolveData(block.type, block.props.data, rawReportData);

                return (
                    <Component
                        key={`${block.type}-${index}`}
                        {...block.props}
                        meta={meta}
                        data={componentData}
                    />
                );
            })}
        </>
    );
};

export default DynamicReport;
