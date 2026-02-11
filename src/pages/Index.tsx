import React from "react";
import { useSearchParams } from "react-router-dom";
import { useReportData } from "@/hooks/useReportData";
import CoverPage from "@/components/report/CoverPage";
import DocumentControl from "@/components/report/DocumentControl";
import TableOfContents from "@/components/report/TableOfContents";
import ExecutiveSummary from "@/components/report/ExecutiveSummary";
import ScopeMethodology from "@/components/report/ScopeMethodology";
import RiskDashboard from "@/components/report/RiskDashboard";
import NetworkArchitecture from "@/components/report/NetworkArchitecture";
import GeoThreatIntel from "@/components/report/GeoThreatIntel";
import DetailedFindings from "@/components/report/DetailedFindings";
import VulnTrending from "@/components/report/VulnTrending";
import ComplianceMapping from "@/components/report/ComplianceMapping";
import HostSummary from "@/components/report/HostSummary";
import RemediationRoadmap from "@/components/report/RemediationRoadmap";
import Appendices from "@/components/report/Appendices";
import ComplianceDPDP from "@/components/report/templates/ComplianceDPDP";
import ComplianceCERTIn from "@/components/report/templates/ComplianceCERTIn";
import ComplianceBFSI from "@/components/report/templates/ComplianceBFSI";
import BackCover from "@/components/report/BackCover";
import EntityGraph from "@/components/report/EntityGraph";
import MermaidDiagram from "@/components/report/MermaidDiagram";

const Index = () => {
  const handleExportPDF = () => {
    window.print();
  };

  const reportData = useReportData();
  const [searchParams] = useSearchParams();
  const reportType = searchParams.get("type") || "full";
  const shouldPrint = searchParams.get("print") === "true";

  React.useEffect(() => {
    if (shouldPrint) {
      // Small delay to ensure rendering is complete
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint]);

  const renderContent = () => {
    // Memoize common props to prevent unnecessary re-renders
    const commonProps = React.useMemo(() => ({
      meta: {
        ...reportData.meta,
        // Ensure date is present, fallback if needed
        date: reportData.meta?.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    }), [reportData.meta]);

    switch (reportType) {
      case "dpdp":
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ComplianceDPDP data={reportData.compliance?.dpdp} {...commonProps} />
            <BackCover {...commonProps} />
          </>
        );
      case "certin":
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ComplianceCERTIn data={reportData.compliance?.certin} {...commonProps} />
            <BackCover {...commonProps} />
          </>
        );
      case "sebi":
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ComplianceBFSI data={reportData.compliance?.sebi} {...commonProps} />
            <BackCover {...commonProps} />
          </>
        );
      case "rbi":
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ComplianceBFSI data={reportData.compliance?.rbi} {...commonProps} />
            <BackCover {...commonProps} />
          </>
        );
      case "bfsi":
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ComplianceBFSI data={reportData.compliance?.sebi} {...commonProps} />
            <BackCover {...commonProps} />
          </>
        );
      case "full": // default
      default:
        return (
          <>
            <CoverPage data={reportData} {...commonProps} />
            <DocumentControl data={reportData.docControl} {...commonProps} />
            <TableOfContents data={reportData.toc} {...commonProps} />
            <ExecutiveSummary data={reportData.execSummary} {...commonProps} />
            <ScopeMethodology data={reportData.scope} {...commonProps} />
            <RiskDashboard
              data={{
                severity: reportData.severityDist,
                category: reportData.categoryDist,
                trend: reportData.riskTrend,
                hosts: reportData.hostFindings,
                riskMatrix: reportData.riskDashboard?.riskMatrix || reportData.riskMatrix
              }}
              {...commonProps}
            />
            <NetworkArchitecture data={{ assets: reportData.networkAssets, subnets: reportData.subnets }} {...commonProps} />
            <GeoThreatIntel data={reportData.geoData} {...commonProps} />
            <DetailedFindings data={reportData.findings} {...commonProps} />
            <VulnTrending data={reportData.trending} {...commonProps} />
            <ComplianceMapping data={reportData.complianceMapping} {...commonProps} />
            <HostSummary data={reportData.networkAssets} {...commonProps} />
            <EntityGraph data={reportData.entityGraph} {...commonProps} />
            <MermaidDiagram data={reportData.mermaidDiagram} {...commonProps} />
            <RemediationRoadmap data={reportData.remediation} {...commonProps} />
            <Appendices data={{
              portScan: reportData.portScan || reportData.portScanResults,
              glossary: reportData.glossary,
              toolOutputTitle: reportData.toolOutputTitle,
              toolOutputText: reportData.toolOutputText
            }} {...commonProps} />

            <ComplianceDPDP data={reportData.compliance?.dpdp} {...commonProps} />
            <ComplianceCERTIn data={reportData.compliance?.certin} {...commonProps} />
            <ComplianceBFSI data={reportData.compliance?.sebi} {...commonProps} />
            <ComplianceBFSI data={reportData.compliance?.rbi} {...commonProps} />

            <BackCover {...commonProps} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a]">
      {/* Export Button */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={handleExportPDF}
          className="px-6 py-3 bg-[hsl(190,100%,50%)] text-[#0A1628] font-bold rounded-lg shadow-lg hover:bg-[hsl(190,100%,60%)] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to PDF
        </button>
      </div>

      {/* Report Pages */}
      <div className="report-container flex flex-col items-center gap-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
