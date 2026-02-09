import React from "react";
import ReportPage from "./ReportPage";
import { executiveSummary, severityDistribution } from "@/data/reportData";

const MetricCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--obsera-surface))] text-center">
    <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
    <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

const ExecutiveSummary = () => {
  const { critical, high, medium, low, informational, totalVulnerabilities, overallRiskScore, systemsTested, systemsCompromised, riskStatement } = executiveSummary;

  return (
    <>
      <ReportPage pageNum={4} sectionTitle="Executive Summary" light={true}>
        {/* Header image */}
        <div className="w-full h-32 rounded-lg overflow-hidden mb-6 relative">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
            alt="Cybersecurity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/80 to-transparent flex items-center pl-6">
            <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          This section provides a high-level overview of the security assessment conducted on Acme Corporation's network infrastructure between January 15 – February 5, 2026.
        </p>

        {/* Key Metrics */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
          Key Metrics Overview
        </h3>

        <div className="grid grid-cols-5 gap-3 mb-6">
          <MetricCard label="Critical" value={critical} color="hsl(0, 84%, 60%)" />
          <MetricCard label="High" value={high} color="hsl(25, 95%, 53%)" />
          <MetricCard label="Medium" value={medium} color="hsl(45, 93%, 47%)" />
          <MetricCard label="Low" value={low} color="hsl(142, 71%, 45%)" />
          <MetricCard label="Info" value={informational} color="hsl(210, 80%, 55%)" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-lg border border-[hsl(var(--obsera-cyan))]/20 bg-[hsl(var(--obsera-surface))] text-center">
            <div className="text-2xl font-bold text-[hsl(var(--obsera-cyan))]">{totalVulnerabilities}</div>
            <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Total Findings</div>
          </div>
          <div className="p-4 rounded-lg border border-[hsl(var(--obsera-cyan))]/20 bg-[hsl(var(--obsera-surface))] text-center">
            <div className="text-2xl font-bold text-[hsl(var(--obsera-cyan))]">{systemsTested}</div>
            <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Systems Tested</div>
          </div>
          <div className="p-4 rounded-lg border border-[hsl(var(--obsera-critical))] bg-[hsl(var(--obsera-surface))] text-center">
            <div className="text-2xl font-bold text-[hsl(var(--obsera-critical))]">{systemsCompromised}</div>
            <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Compromised</div>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
          Overall Risk Score
        </h3>
        <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth="8"
                strokeDasharray={`${(overallRiskScore / 10) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-bold text-[hsl(var(--obsera-critical))]">
              {overallRiskScore}
            </span>
          </div>
          <div>
            <div className="text-lg font-bold text-[hsl(var(--obsera-critical))]">HIGH RISK</div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {overallRiskScore}/10 — Immediate remediation required for critical findings.
            </p>
          </div>
        </div>
      </ReportPage>

      <ReportPage pageNum={5} sectionTitle="Executive Summary" light={true}>
        {/* Severity Distribution Pie - CSS Conic Gradient */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
          Vulnerability Distribution by Severity
        </h3>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-56 h-56 flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full relative"
              style={{
                background: `conic-gradient(
                     ${severityDistribution[0].color} 0% ${(severityDistribution[0].value / totalVulnerabilities) * 100}%, 
                     ${severityDistribution[1].color} ${(severityDistribution[0].value / totalVulnerabilities) * 100}% ${((severityDistribution[0].value + severityDistribution[1].value) / totalVulnerabilities) * 100}%, 
                     ${severityDistribution[2].color} ${((severityDistribution[0].value + severityDistribution[1].value) / totalVulnerabilities) * 100}% ${((severityDistribution[0].value + severityDistribution[1].value + severityDistribution[2].value) / totalVulnerabilities) * 100}%,
                     ${severityDistribution[3].color} ${((severityDistribution[0].value + severityDistribution[1].value + severityDistribution[2].value) / totalVulnerabilities) * 100}% 100%
                  )`
              }}
            >
              <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">Severity</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {severityDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                <span className="text-muted-foreground w-16">{s.name}</span>
                <span className="font-mono-ibm font-bold">{s.value}</span>
                <span className="text-muted-foreground">
                  ({((s.value / totalVulnerabilities) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Statement */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
          Executive Risk Statement
        </h3>
        <div className="p-5 rounded-lg border-l-4 border-[hsl(var(--obsera-critical))] bg-[hsl(var(--obsera-surface))]">
          <p className="text-xs leading-relaxed text-foreground/80">{riskStatement}</p>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--obsera-cyan))]/20">
          <h4 className="text-xs font-bold text-[hsl(var(--obsera-cyan))] mb-2 uppercase tracking-wider">
            Key Recommendation
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            ObseraSEC strongly recommends that Acme Corporation prioritizes the remediation of all 12 critical
            and 31 high-severity findings within the next 30 days. A follow-up assessment should be scheduled
            within 90 days to validate remediation effectiveness and reassess the overall security posture.
          </p>
        </div>
      </ReportPage>
    </>
  );
};

export default ExecutiveSummary;
