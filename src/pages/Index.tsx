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
import BackCover from "@/components/report/BackCover";

const Index = () => {
  const handleExportPDF = () => {
    window.print();
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
      <div className="flex flex-col items-center gap-4 py-8">
        <CoverPage />
        <DocumentControl />
        <TableOfContents />
        <ExecutiveSummary />
        <ScopeMethodology />
        <RiskDashboard />
        <NetworkArchitecture />
        <GeoThreatIntel />
        <DetailedFindings />
        <VulnTrending />
        <ComplianceMapping />
        <HostSummary />
        <RemediationRoadmap />
        <Appendices />
        <BackCover />
      </div>
    </div>
  );
};

export default Index;
