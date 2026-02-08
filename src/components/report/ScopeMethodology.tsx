import ReportPage from "./ReportPage";
import { scopeData } from "@/data/reportData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const ScopeMethodology = () => {
  const timelineData = scopeData.timeline.map((t) => ({
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
      <ReportPage pageNum={7} sectionTitle="Scope & Methodology">
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Scope & Methodology
        </h2>

        {/* Scope Table */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Assessment Scope
        </h3>
        <table className="report-table mb-8">
          <thead>
            <tr>
              <th>IP Range / Subnet</th>
              <th>Description</th>
              <th>Live Hosts</th>
            </tr>
          </thead>
          <tbody>
            {scopeData.ipRanges.map((r) => (
              <tr key={r.range}>
                <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.range}</td>
                <td>{r.description}</td>
                <td className="font-mono-ibm text-center">{r.hosts}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={2}>Total</td>
              <td className="font-mono-ibm text-center text-[hsl(var(--obsera-cyan))]">
                {scopeData.ipRanges.reduce((a, b) => a + b.hosts, 0)}
              </td>
            </tr>
          </tbody>
        </table>

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

      <ReportPage pageNum={8} sectionTitle="Scope & Methodology">
        {/* Tools Table */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Tools Used
        </h3>
        <table className="report-table mb-8">
          <thead>
            <tr><th>Tool</th><th>Version</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            {scopeData.tools.map((t) => (
              <tr key={t.name}>
                <td className="font-semibold text-[hsl(var(--obsera-cyan))]">{t.name}</td>
                <td className="font-mono-ibm">{t.version}</td>
                <td className="text-muted-foreground">{t.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Timeline Bar Chart */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Testing Timeline (Days)
        </h3>
        <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
              <XAxis type="number" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} domain={[0, 22]} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} width={100} />
              <Tooltip
                contentStyle={{
                  background: "#0A1628",
                  border: "1px solid hsl(190, 100%, 50%)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="duration" fill="hsl(190, 100%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportPage>
    </>
  );
};

export default ScopeMethodology;
