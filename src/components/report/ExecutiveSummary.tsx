import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { ListChecks, ShieldAlert, PieChart, MessageSquare } from "lucide-react";

const MetricCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--obsera-surface))] text-center">
    <div className="text-3xl font-bold mb-1" style={{ color }}>{value || 0}</div>
    <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

const ExecutiveSummary = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;

  const { title, metricsTitle, riskScoreTitle, distributionTitle, riskStatementTitle,
    critical = 0, high = 0, medium = 0, low = 0, informational = 0, totalVulnerabilities = 0,
    overallRiskScore = 0, systemsTested = 0, systemsCompromised = 0, riskStatement } = data;

  const severityDistribution = [
    { name: "Critical", value: critical, color: "hsl(0, 84%, 60%)" },
    { name: "High", value: high, color: "hsl(25, 95%, 53%)" },
    { name: "Medium", value: medium, color: "hsl(45, 93%, 47%)" },
    { name: "Low", value: low, color: "hsl(142, 71%, 45%)" },
    { name: "Info", value: informational, color: "hsl(210, 80%, 55%)" },
  ];

  const hasMetrics = totalVulnerabilities > 0 || systemsTested > 0;

  return (
    <>
      <ReportPage pageNum={4} sectionTitle={title || "Executive Summary"} light={true} meta={meta}>
        {/* Header image */}
        <div className="w-full h-32 rounded-lg overflow-hidden mb-6 relative">
          <img
            src={data.headerImageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"}
            alt="Cybersecurity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/80 to-transparent flex items-center pl-6">
            <h2 className="text-2xl font-bold text-white">{title || "Executive Summary"}</h2>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {data.description || "This report provides a high-level overview of the security assessment conducted on the scoped infrastructure."}
        </p>

        {/* Key Metrics */}
        <div className="avoid-break">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
            {metricsTitle || "Key Metrics Overview"}
          </h3>
        </div>

        {!hasMetrics ? (
          <div className="mb-6"><EmptyState message="No performance metrics available" icon={<ListChecks size={24} />} height="150px" /></div>
        ) : (
          <>
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
          </>
        )}

        <div className="avoid-break mt-6">
          {/* Risk Score Gauge */}
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
            {riskScoreTitle || "Overall Risk Score"}
          </h3>
        </div>
        <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={overallRiskScore > 7 ? "hsl(var(--obsera-critical))" : "hsl(var(--obsera-teal))"}
                strokeWidth="8"
                strokeDasharray={`${(overallRiskScore / 10) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-bold">
              {overallRiskScore}
            </span>
          </div>
          <div>
            <div className="text-lg font-bold uppercase">{overallRiskScore > 7 ? 'High Risk' : overallRiskScore > 4 ? 'Medium Risk' : 'Low Risk'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {overallRiskScore}/10 — {overallRiskScore > 7 ? 'Immediate remediation required.' : 'Standard remediation schedule applies.'}
            </p>
          </div>
        </div>
      </ReportPage>

      <ReportPage pageNum={5} sectionTitle={title || "Executive Summary"} light={true} meta={meta}>
        <div className="avoid-break">
          {/* Severity Distribution Pie - CSS Conic Gradient */}
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
            {distributionTitle || "Vulnerability Distribution by Severity"}
          </h3>
        </div>

        {totalVulnerabilities === 0 ? (
          <div className="mb-8"><EmptyState message="No distribution data" icon={<PieChart size={24} />} height="200px" /></div>
        ) : (
          <div className="flex items-center gap-6 mb-8">
            <div className="w-56 h-56 flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full relative"
                style={{
                  background: (() => {
                    let lastPercentage = 0;
                    const gradientParts = severityDistribution
                      .filter(s => s.value > 0)
                      .map(s => {
                        const percentage = (s.value / totalVulnerabilities) * 100;
                        const start = lastPercentage;
                        const end = lastPercentage + percentage;
                        lastPercentage = end;
                        return `${s.color} ${start}% ${end}%`;
                      });
                    return `conic-gradient(${gradientParts.length > 0 ? gradientParts.join(', ') : 'hsl(var(--muted)) 0% 100%'})`;
                  })()
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
                    ({((s.value / (totalVulnerabilities || 1)) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="avoid-break mt-8">
          {/* Risk Statement */}
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
            {riskStatementTitle || "Executive Risk Statement"}
          </h3>
        </div>

        {!riskStatement ? (
          <EmptyState message="No risk statement provided" icon={<MessageSquare size={24} />} height="100px" />
        ) : (
          <div className="p-5 rounded-lg border-l-4 border-[hsl(var(--obsera-critical))] bg-[hsl(var(--obsera-surface))]">
            <p className="text-xs leading-relaxed text-foreground/80">{riskStatement}</p>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--obsera-cyan))]/20">
          <h4 className="text-xs font-bold text-[hsl(var(--obsera-cyan))] mb-2 uppercase tracking-wider">
            {data.recommendationTitle || "Key Recommendation"}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {data.recommendationText || "Prioritize the remediation of all critical and high-severity findings immediately. A follow-up assessment should be scheduled to validate remediation effectiveness."}
          </p>
        </div>
      </ReportPage>
    </>
  );
};

export default ExecutiveSummary;
