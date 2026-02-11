import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Target, Wrench, Clock } from "lucide-react";

const ScopeMethodology = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;

  const { ipRanges, tools, timeline, title, description } = data;

  const timelineData = (timeline || []).map((t: any) => ({
    name: t.phase,
    start: t.start,
    duration: t.duration,
  }));

  const methodSteps = [
    { num: "01", title: "Reconnaissance", desc: "OSINT gathering, DNS enumeration, network mapping" },
    { num: "02", title: "Scanning", desc: "Port scanning, service detection, vulnerability scanning" },
    { num: "03", title: "Enumeration", desc: "Service enumeration, user discovery, share mapping" },
    { num: "04", title: "Exploitation", desc: "Vulnerability validation, exploit development, access" },
    { num: "05", title: "Post-Exploitation", desc: "Privilege escalation, lateral movement, data access" },
    { num: "06", title: "Reporting", desc: "Analysis, documentation, remediation guidance" },
  ];

  return (
    <>
      <ReportPage pageNum={7} sectionTitle={title || "Scope & Methodology"} light={true} meta={meta}>
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          {title || "Scope & Methodology"}
        </h2>

        {/* Scope Table */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Assessment Scope
        </h3>

        {!ipRanges || ipRanges.length === 0 ? (
          <div className="mb-8"><EmptyState message="No scope IP ranges defined" icon={<Target size={24} />} height="200px" /></div>
        ) : (
          <table className="report-table mb-8">
            <thead>
              <tr>
                <th>IP Range / Subnet</th>
                <th>Description</th>
                <th>Live Hosts</th>
              </tr>
            </thead>
            <tbody>
              {ipRanges.map((r: any) => (
                <tr key={r.range}>
                  <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.range}</td>
                  <td>{r.description}</td>
                  <td className="font-mono-ibm text-center">{r.hosts}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={2}>Total</td>
                <td className="font-mono-ibm text-center text-[hsl(var(--obsera-cyan))]">
                  {ipRanges.reduce((a: number, b: any) => a + b.hosts, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Methodology */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Methodology
        </h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {methodSteps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
                <span className="font-mono-ibm text-[hsl(var(--obsera-cyan))] text-xs font-bold">{s.num}</span>
                <div>
                  <div className="text-xs font-semibold">{s.title}</div>
                  <div className="text-[9px] text-muted-foreground">{s.desc}</div>
                </div>
              </div>
              {i < methodSteps.length - 1 && (
                <span className="text-[hsl(var(--obsera-cyan))] text-lg">→</span>
              )}
            </div>
          ))}
        </div>
      </ReportPage>

      <ReportPage pageNum={8} sectionTitle={title || "Scope & Methodology"} light={true} meta={meta}>
        {/* Tools Table */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Tools Used
        </h3>

        {!tools || tools.length === 0 ? (
          <div className="mb-8"><EmptyState message="No tools information available" icon={<Wrench size={24} />} height="180px" /></div>
        ) : (
          <table className="report-table mb-8">
            <thead>
              <tr><th>Tool</th><th>Version</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              {tools.map((t: any) => (
                <tr key={t.name}>
                  <td className="font-semibold text-[hsl(var(--obsera-cyan))]">{t.name}</td>
                  <td className="font-mono-ibm">{t.version}</td>
                  <td className="text-muted-foreground">{t.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Timeline Bar Chart - CSS Horizontal Bar */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Testing Timeline (Days)
        </h3>

        {!timeline || timeline.length === 0 ? (
          <EmptyState message="Testing timeline not populated" icon={<Clock size={24} />} height="200px" />
        ) : (
          <div className="min-h-32 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
            <div className="flex flex-col justify-center h-full gap-3">
              {timelineData.map((item: any, i: number) => {
                const maxDuration = Math.max(...timelineData.map((t: any) => t.duration), 1);
                const width = (item.duration / (maxDuration * 1.5)) * 100; // Scaled for better visualization
                return (
                  <div key={i} className="flex items-center gap-2 group w-full">
                    <div className="w-24 text-[10px] font-bold text-muted-foreground text-right truncate">{item.name}</div>
                    <div className="flex-1 bg-slate-100 rounded-r-sm h-6 relative">
                      <div
                        className="h-full bg-[hsl(190,100%,50%)] absolute left-0 top-0 opacity-80 hover:opacity-100 transition-all flex items-center px-2"
                        style={{
                          width: `${width}% `,
                        }}
                      >
                        <span className="text-[9px] font-bold text-[#0A1628] whitespace-nowrap">{item.duration}d</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ReportPage>
    </>
  );
};

export default ScopeMethodology;
