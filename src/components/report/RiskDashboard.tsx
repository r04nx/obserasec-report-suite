import React from "react";
import ReportPage from "./ReportPage";
import {
  vulnByCategory, riskTrend, vulnByHost, riskMatrix,
} from "@/data/reportData";

const riskCellColor: Record<string, string> = {
  C: "bg-[hsl(0,84%,60%)] text-white",
  H: "bg-[hsl(25,95%,53%)] text-white",
  M: "bg-[hsl(45,93%,47%)] text-[#1a1a1a]",
  L: "bg-[hsl(142,71%,45%)] text-white",
};

const RiskDashboard = () => (
  <>
    <ReportPage pageNum={9} sectionTitle="Risk Summary Dashboard" light={true}>
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Risk Summary Dashboard
      </h2>

      {/* Vuln by Category Bar Chart - CSS Version */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Vulnerabilities by Category
      </h3>
      <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
        <div className="flex items-end justify-between h-full gap-4">
          {vulnByCategory.map((item, i) => {
            const maxVal = Math.max(...vulnByCategory.map(v => v.count));
            const height = (item.count / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-xs font-bold text-muted-foreground mb-1">{item.count}</div>
                <div
                  className="w-full bg-[hsl(190,100%,50%)] rounded-t-sm transition-all hover:bg-[hsl(190,100%,60%)]"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-[9px] text-muted-foreground text-center line-clamp-2 h-6">{item.category}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Trend Line - Approximated as Bars */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Risk Trend Over Time
      </h3>
      <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
        <div className="flex items-end justify-between h-full gap-2">
          {riskTrend.map((item, i) => {
            const height = (item.score / 10) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-xs font-bold text-[hsl(0,84%,60%)] mb-1">{item.score}</div>
                <div className="w-full flex items-center justify-center relative h-full">
                  <div className="absolute bottom-0 w-0.5 bg-[hsl(0,84%,60%)] h-full opacity-20"></div>
                  <div className="w-2 h-2 rounded-full bg-[hsl(0,84%,60%)] z-10" style={{ marginBottom: `${height}%` }}></div>
                  <div className="absolute bottom-0 w-full border-t border-[hsl(0,84%,60%)] opacity-30" style={{ bottom: `${height}%` }}></div>
                </div>
                <div className="text-[10px] text-muted-foreground">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </ReportPage>

    <ReportPage pageNum={10} sectionTitle="Risk Summary Dashboard" light={true}>
      {/* Stacked Bar by Host */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Findings by Host / Subnet
      </h3>
      <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
        <div className="flex flex-col h-full gap-3 overflow-y-auto">
          {vulnByHost.map((host, i) => {
            const total = host.critical + host.high + host.medium + host.low;
            return (
              <div key={i} className="w-full">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-mono">{host.host}</span>
                  <span className="font-bold">{total} Vulns</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                  <div style={{ width: `${(host.critical / total) * 100}%` }} className="bg-[hsl(0,84%,60%)]"></div>
                  <div style={{ width: `${(host.high / total) * 100}%` }} className="bg-[hsl(25,95%,53%)]"></div>
                  <div style={{ width: `${(host.medium / total) * 100}%` }} className="bg-[hsl(45,93%,47%)]"></div>
                  <div style={{ width: `${(host.low / total) * 100}%` }} className="bg-[hsl(142,71%,45%)]"></div>
                </div>
              </div>
            );
          })}
        </div>
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
