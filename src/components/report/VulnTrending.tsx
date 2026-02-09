import React from "react";
import ReportPage from "./ReportPage";
import { vulnTrending } from "@/data/reportData";

const donutColors = ["hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)"];

const VulnTrending = () => {
  // Helper to calculate max values
  const maxPhase = Math.max(...vulnTrending.byPhase.map(v => v.discovered));
  const maxService = Math.max(...vulnTrending.byService.map(v => v.critical + v.high + v.medium + v.low));
  const maxExposure = Math.max(...vulnTrending.riskExposure.map(v => v.exposure));

  return (
    <>
      <ReportPage pageNum={33} sectionTitle="Vulnerability Trending" light={true}>
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Vulnerability Trending & Analytics
        </h2>

        {/* Discovery by Phase - Approximated Line as Bar */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Vulnerability Discovery by Phase
        </h3>
        <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
          <div className="flex items-end justify-between h-full gap-4">
            {vulnTrending.byPhase.map((item, i) => {
              const height = (item.discovered / maxPhase) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-xs font-bold text-muted-foreground mb-1">{item.discovered}</div>
                  <div
                    className="w-full bg-[hsl(190,100%,50%)] rounded-t-sm opacity-80 hover:opacity-100"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-[9px] text-muted-foreground text-center line-clamp-2 h-4">{item.phase}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Service - Grouped Bar - Approximated as Stacked */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Vulnerabilities by Service Type
        </h3>
        <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
          <div className="flex items-end justify-between h-full gap-4">
            {vulnTrending.byService.map((item, i) => {
              const total = item.critical + item.high + item.medium + item.low;
              const heightPercent = (total / maxService) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-muted-foreground mb-1">{total}</div>
                  <div className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden" style={{ height: `${heightPercent}%` }}>
                    <div style={{ flex: item.low }} className="bg-[hsl(142,71%,45%)]"></div>
                    <div style={{ flex: item.medium }} className="bg-[hsl(45,93%,47%)]"></div>
                    <div style={{ flex: item.high }} className="bg-[hsl(25,95%,53%)]"></div>
                    <div style={{ flex: item.critical }} className="bg-[hsl(0,84%,60%)]"></div>
                  </div>
                  <div className="text-[9px] text-muted-foreground text-center h-4 truncate">{item.service}</div>
                </div>
              );
            })}
          </div>
        </div>
      </ReportPage>

      <ReportPage pageNum={34} sectionTitle="Vulnerability Trending" light={true}>
        {/* Patched vs Unpatched Donut - CSS Conic */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Patch Status Distribution
        </h3>
        <div className="flex items-center gap-8 mb-8">
          <div className="w-48 h-48 flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full relative"
              style={{
                background: `conic-gradient(
                     ${donutColors[0]} 0% ${(vulnTrending.patchStatus[0].value / 86) * 100}%, 
                     ${donutColors[1]} ${(vulnTrending.patchStatus[0].value / 86) * 100}% 100%
                  )`
              }}
            >
              <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">Status</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {vulnTrending.patchStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ background: donutColors[i] }} />
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground font-mono-ibm">{s.value} systems ({((s.value / 86) * 100).toFixed(0)}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Exposure Area - CSS Area (Bars) */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Risk Exposure Timeline
        </h3>
        <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
          <div className="flex items-end justify-between h-full gap-1">
            {vulnTrending.riskExposure.map((item, i) => {
              const height = (item.exposure / maxExposure) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-[hsl(190,100%,50%)]/50 to-[hsl(190,100%,50%)]/80 rounded-t-sm"
                    style={{ height: `${height}%`, minHeight: '1px' }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 px-2">
            <span className="text-[10px] text-muted-foreground">{vulnTrending.riskExposure[0].day}</span>
            <span className="text-[10px] text-muted-foreground">{vulnTrending.riskExposure[vulnTrending.riskExposure.length - 1].day}</span>
          </div>
        </div>
      </ReportPage>
    </>
  );
};

export default VulnTrending;
