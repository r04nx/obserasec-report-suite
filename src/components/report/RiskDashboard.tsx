import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { BarChart, TrendingUp, Network, Table } from "lucide-react";
import {
  riskMatrix,
} from "@/data/reportData";

const riskCellColors: Record<string, string> = {
  C: "hsl(0, 84%, 60%)",
  H: "hsl(25, 95%, 53%)",
  M: "hsl(45, 93%, 47%)",
  L: "hsl(142, 71%, 45%)",
};

const categoryColors = [
  "hsl(193, 82%, 31%)", // Deep Cyan (Brand)
  "hsl(167, 43%, 47%)", // Original Brand Teal
  "hsl(190, 80%, 45%)", // Bright Cyan
  "hsl(210, 60%, 50%)", // Blue
  "hsl(230, 50%, 45%)", // Indigo
  "hsl(25, 95%, 53%)",  // High Severity Orange
  "hsl(45, 93%, 47%)",  // Medium Severity Yellow
];

interface RiskDashboardProps {
  data: any;
  meta?: any;
  title?: string;
  categoryTitle?: string;
  trendTitle?: string;
  hostsTitle?: string;
  matrixTitle?: string;
}

const RiskDashboard = ({ data, meta, title, categoryTitle, trendTitle, hostsTitle, matrixTitle }: RiskDashboardProps) => {
  if (!data) return null;
  const { category, trend, hosts, riskMatrix, riskCellColor } = data;

  const finalTitle = title || data.title || "Risk Summary Dashboard";
  const finalCategoryTitle = categoryTitle || data.categoryTitle || "Vulnerabilities by Category";
  const finalTrendTitle = trendTitle || data.trendTitle || "Risk Trend Over Time";
  const finalHostsTitle = hostsTitle || data.hostsTitle || "Findings by Host / Subnet";
  const finalMatrixTitle = matrixTitle || data.matrixTitle || "Risk Matrix (Likelihood × Impact)";

  // Use provided matrix or null (don't fallback to hardcoded data/reportData.ts if we want true dynamic)
  const matrix = riskMatrix;
  const cellColors = riskCellColor || riskCellColors;

  return (
    <>
      <ReportPage pageNum={9} sectionTitle={finalTitle} light={true} meta={meta}>
        <h2 className="text-2xl font-bold text-[hsl(193,82%,31%)] mb-6 section-accent">
          {finalTitle}
        </h2>

        {/* Vuln by Category Bar Chart - CSS Version */}
        <div className="avoid-break">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
            {finalCategoryTitle}
          </h3>
        </div>

        {!category || category.length === 0 ? (
          <div className="mb-6"><EmptyState message="No category data available" icon={<BarChart size={24} />} height="224px" /></div>
        ) : (
          <div className="bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6 h-72 bg-slate-50/30">
            <div className="flex items-end justify-between h-full gap-4 pb-2">
              {category.slice(0, 7).map((item: any, i: number) => {
                const maxVal = Math.max(...category.map((v: any) => v.count), 1);
                const barHeight = (item.count / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end max-w-[12%]">
                    <div className="text-[11px] font-black text-slate-700 opacity-80 mb-2">{item.count}</div>
                    <div className="relative w-full h-40 mb-3 transition-all">
                      <div
                        className="absolute bottom-0 w-full rounded-t shadow-sm"
                        style={{
                          height: `${Math.max(4, barHeight)}%`,
                          minHeight: '4px',
                          backgroundColor: categoryColors[i % categoryColors.length]
                        }}
                      >
                        <div className="w-full h-1 bg-white opacity-20 absolute top-0" />
                      </div>
                    </div>
                    <div className="text-[9px] font-black text-slate-500 text-center line-clamp-2 h-10 flex items-center justify-center uppercase tracking-tighter leading-none">
                      {item.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Risk Trend Line - Approximated as Bars */}
        <div className="avoid-break mt-10">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
            {finalTrendTitle}
          </h3>
        </div>

        {!trend || trend.length === 0 ? (
          <EmptyState message="No trend data available" icon={<TrendingUp size={24} />} height="192px" />
        ) : (
          <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
            <div className="flex items-end justify-between h-full gap-2">
              {trend.map((item: any, i: number) => {
                const height = (item.score / 10) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[11px] font-black text-[hsl(193,82%,31%)] mb-2 font-mono-ibm">{item.score}</div>
                    <div className="w-full flex items-center justify-center relative h-full">
                      <div className="absolute bottom-0 w-1 bg-[hsl(193,82%,31%)] h-full opacity-[0.05]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[hsl(193,82%,31%)] z-10 shadow-sm" style={{ marginBottom: `${height}%` }}></div>
                      <div className="absolute bottom-0 w-full border-t border-[hsl(193,82%,31%)] opacity-[0.2]" style={{ bottom: `${height}%` }}></div>
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ReportPage>

      <ReportPage pageNum={10} sectionTitle={finalTitle} light={true} meta={meta}>
        {/* Stacked Bar by Host */}
        <div className="avoid-break">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
            {finalHostsTitle}
          </h3>
        </div>

        {!hosts || hosts.length === 0 ? (
          <div className="mb-6"><EmptyState message="No host findings available" icon={<Network size={24} />} height="224px" /></div>
        ) : (
          <div className="bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
            <div className="flex flex-col gap-4">
              {hosts.map((host: any, i: number) => {
                const total = host.critical + host.high + host.medium + host.low;
                return (
                  <div key={i} className="w-full">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="font-mono">{host.host}</span>
                      <span className="font-bold">{total} Vulns</span>
                    </div>
                    <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                      <div style={{ width: `${(host.critical / (total || 1)) * 100}%` }} className="bg-[hsl(0,84%,60%)]"></div>
                      <div style={{ width: `${(host.high / (total || 1)) * 100}%` }} className="bg-[hsl(25,95%,53%)]"></div>
                      <div style={{ width: `${(host.medium / (total || 1)) * 100}%` }} className="bg-[hsl(45,93%,47%)]"></div>
                      <div style={{ width: `${(host.low / (total || 1)) * 100}%` }} className="bg-[hsl(142,71%,45%)]"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Risk Matrix */}
        <div className="avoid-break mt-10">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
            {finalMatrixTitle}
          </h3>
        </div>

        {!matrix || matrix.length <= 1 ? (
          <EmptyState message="Risk matrix not populated" icon={<Table size={24} />} height="200px" />
        ) : (
          <div className="overflow-hidden rounded-lg border border-[hsl(var(--border))]">
            <table className="w-full text-center text-[10px]">
              <thead>
                <tr>
                  {matrix[0].map((h: any, i: number) => (
                    <th key={i} className={`p-2 ${i === 0 ? "bg-transparent" : "bg-[hsl(var(--obsera-navy))] text-[hsl(193,82%,31%)] font-mono-ibm"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.slice(1).map((row: any, ri: number) => (
                  <tr key={ri}>
                    {row.map((cell: any, ci: number) => {
                      const bgColor = ci === 0 ? "hsl(var(--obsera-navy))" : cellColors[cell] || "transparent";
                      const textColor = ci === 0 ? "hsl(193, 82%, 31%)" : (cell === 'M' ? '#1a1a1a' : 'white');
                      return (
                        <td
                          key={ci}
                          className={`p-2 font-bold ${ci === 0 ? "font-mono-ibm text-left text-[9px]" : ""}`}
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportPage>
    </>
  );
};

export default RiskDashboard;
