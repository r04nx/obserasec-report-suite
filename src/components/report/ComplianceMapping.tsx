import ReportPage from "./ReportPage";
import { complianceData } from "@/data/reportData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const statusStyle: Record<string, string> = {
  Pass: "bg-[hsl(142,71%,45%)] text-white",
  Fail: "bg-[hsl(0,84%,60%)] text-white",
  Partial: "bg-[hsl(45,93%,47%)] text-[#1a1a1a]",
};

const chartTooltipStyle = {
  background: "#0A1628",
  border: "1px solid hsl(190, 100%, 50%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#fff",
};

const ComplianceMapping = () => {
  const scoreData = complianceData.frameworks.map((f) => ({
    name: f.name.split(":")[0].split(" ").slice(0, 2).join(" "),
    score: f.score,
  }));

  return (
    <>
      <ReportPage pageNum={36} sectionTitle="Compliance Mapping">
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Compliance Mapping
        </h2>

        {/* Score chart */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Compliance Scores by Framework
        </h3>
        <div className="h-40 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="score" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Framework tables */}
        {complianceData.frameworks.map((fw) => (
          <div key={fw.name} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[hsl(var(--obsera-cyan))] uppercase tracking-wider">
                {fw.name}
              </h3>
              <span className="font-mono-ibm text-xs" style={{ color: fw.score < 50 ? "hsl(0,84%,60%)" : "hsl(45,93%,47%)" }}>
                {fw.score}% Compliant
              </span>
            </div>
            <table className="report-table text-[9px]">
              <thead>
                <tr>
                  <th>Control</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Related Finding</th>
                </tr>
              </thead>
              <tbody>
                {fw.controls.map((c) => (
                  <tr key={c.control}>
                    <td className="font-mono-ibm">{c.control}</td>
                    <td>{c.title}</td>
                    <td>
                      <span className={`${statusStyle[c.status]} px-2 py-0.5 rounded text-[8px] font-bold uppercase`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{c.finding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </ReportPage>
    </>
  );
};

export default ComplianceMapping;
