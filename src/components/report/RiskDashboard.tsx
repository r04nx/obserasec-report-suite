import ReportPage from "./ReportPage";
import {
  vulnByCategory, riskTrend, severityDistribution, vulnByHost, riskMatrix,
} from "@/data/reportData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const chartTooltipStyle = {
  background: "#0A1628",
  border: "1px solid hsl(190, 100%, 50%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#fff",
};

const riskCellColor: Record<string, string> = {
  C: "bg-[hsl(0,84%,60%)] text-white",
  H: "bg-[hsl(25,95%,53%)] text-white",
  M: "bg-[hsl(45,93%,47%)] text-[#1a1a1a]",
  L: "bg-[hsl(142,71%,45%)] text-white",
};

const RiskDashboard = () => (
  <>
    <ReportPage pageNum={9} sectionTitle="Risk Summary Dashboard">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Risk Summary Dashboard
      </h2>

      {/* Vuln by Category Bar Chart */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Vulnerabilities by Category
      </h3>
      <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vulnByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="category" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 9 }} />
            <YAxis tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="count" fill="hsl(190, 100%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Trend Line */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Risk Trend Over Time
      </h3>
      <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={riskTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <YAxis domain={[0, 10]} tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ fill: "hsl(0, 84%, 60%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ReportPage>

    <ReportPage pageNum={10} sectionTitle="Risk Summary Dashboard">
      {/* Stacked Bar by Host */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Findings by Host / Subnet
      </h3>
      <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-4 border border-[hsl(var(--border))] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vulnByHost}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 20%)" />
            <XAxis dataKey="host" tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 9 }} />
            <YAxis tick={{ fill: "hsl(210, 20%, 60%)", fontSize: 10 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="critical" stackId="a" fill="hsl(0, 84%, 60%)" />
            <Bar dataKey="high" stackId="a" fill="hsl(25, 95%, 53%)" />
            <Bar dataKey="medium" stackId="a" fill="hsl(45, 93%, 47%)" />
            <Bar dataKey="low" stackId="a" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Matrix */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Risk Matrix (Likelihood × Impact)
      </h3>
      <div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
        <table className="w-full text-center text-[10px]">
          <thead>
            <tr>
              {riskMatrix[0].map((h, i) => (
                <th key={i} className={`p-2 ${i === 0 ? "bg-transparent" : "bg-[hsl(var(--obsera-navy))] text-[hsl(var(--obsera-cyan))] font-mono-ibm"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskMatrix.slice(1).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`p-2 font-bold ${ci === 0 ? "bg-[hsl(var(--obsera-navy))] text-[hsl(var(--obsera-cyan))] font-mono-ibm text-left text-[9px]" : riskCellColor[cell] || ""}`}
                  >
                    {ci === 0 ? cell : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportPage>
  </>
);

export default RiskDashboard;
