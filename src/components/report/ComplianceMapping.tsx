import React from "react";
import ReportPage from "./ReportPage";
import { complianceData } from "@/data/reportData";

const statusStyle: Record<string, string> = {
  Pass: "bg-[hsl(142,71%,45%)] text-white",
  Fail: "bg-[hsl(0,84%,60%)] text-white",
  Partial: "bg-[hsl(45,93%,47%)] text-[#1a1a1a]",
};

const ComplianceMapping = () => {
  const scoreData = complianceData.frameworks.map((f) => ({
    name: f.name.split(":")[0].split(" ").slice(0, 2).join(" "),
    score: f.score,
  }));

  return (
    <>
      <ReportPage pageNum={36} sectionTitle="Compliance Mapping" light={true}>
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Compliance Mapping
        </h2>

        {/* Score chart - CSS Bar Chart */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Compliance Scores by Framework
        </h3>
        <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
          <div className="flex items-end justify-between h-full gap-4">
            {scoreData.map((item, i) => {
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-xs font-bold text-muted-foreground mb-1">{item.score}%</div>
                  <div
                    className="w-full bg-[hsl(0,84%,60%)] rounded-t-sm opacity-80 hover:opacity-100"
                    style={{ height: `${item.score}%` }}
                  ></div>
                  <div className="text-[9px] text-muted-foreground text-center line-clamp-2 h-4">{item.name}</div>
                </div>
              );
            })}
          </div>
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
