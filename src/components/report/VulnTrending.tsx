import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";

const donutColors = ["hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)"];

const VulnTrending = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;
  const byPhase = (data.byPhase || []);
  const byService = (data.byService || []);
  const patchStatus = (data.patchStatus || []);
  const riskExposure = (data.riskExposure || []);
  const title = data.title || "Vulnerability Trending & Analytics";

  // Helper to calculate max values
  const maxPhase = Math.max(...byPhase.map((v: any) => v.discovered), 1);
  const maxService = Math.max(...byService.map((v: any) => v.critical + v.high + v.medium + v.low), 1);
  const maxExposure = Math.max(...riskExposure.map((v: any) => v.exposure), 1);

  const totalPatchSystems = patchStatus.reduce((acc: number, s: any) => acc + s.value, 0) || 1;

  return (
    <>
      <ReportPage pageNum={33} sectionTitle={title} light={true} meta={meta}>
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          {title}
        </h2>

        {/* Discovery by Phase */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Vulnerability Discovery by Phase
        </h3>

        {byPhase.length === 0 ? (
          <div className="mb-6"><EmptyState message="No discovery phase data" icon={<TrendingUp size={24} />} height="180px" /></div>
        ) : (
          <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))] mb-6">
            <div className="flex items-end justify-between h-full gap-4">
              {byPhase.map((item: any, i: number) => {
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
        )}

        {/* By Service */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
          Vulnerabilities by Service Type
        </h3>

        {byService.length === 0 ? (
          <EmptyState message="No service-type vulnerability data" icon={<TrendingUp size={24} />} height="200px" />
        ) : (
          <div className="h-56 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
            <div className="flex items-end justify-between h-full gap-4">
              {byService.map((item: any, i: number) => {
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
        )}
      </ReportPage>

      <ReportPage pageNum={34} sectionTitle={title} light={true} meta={meta}>
        {/* Patch Status Distribution */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Patch Status Distribution
        </h3>

        {patchStatus.length === 0 ? (
          <div className="mb-8"><EmptyState message="No patch status data" icon={<PieIcon size={24} />} height="200px" /></div>
        ) : (
          <div className="flex items-center gap-8 mb-8">
            <div className="w-48 h-48 flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full relative"
                style={{
                  background: `conic-gradient(
                       ${donutColors[0]} 0% ${(patchStatus?.[0]?.value / totalPatchSystems) * 100}%, 
                       ${donutColors[1]} ${(patchStatus?.[0]?.value / totalPatchSystems) * 100}% 100%
                    )`
                }}
              >
                <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">Status</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {patchStatus.map((s: any, i: number) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ background: donutColors[i % donutColors.length] }} />
                  <div>
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground font-mono-ibm">{s.value} systems ({((s.value / totalPatchSystems) * 100).toFixed(0)}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Exposure Area */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          Risk Exposure Timeline
        </h3>

        {riskExposure.length === 0 ? (
          <EmptyState message="No risk exposure timeline available" icon={<TrendingUp size={24} />} height="200px" />
        ) : (
          <div className="h-48 bg-[hsl(var(--obsera-surface))] rounded-lg p-6 border border-[hsl(var(--border))]">
            <div className="flex items-end justify-between h-full gap-1">
              {riskExposure.map((item: any, i: number) => {
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
              <span className="text-[10px] text-muted-foreground">{riskExposure[0].day}</span>
              <span className="text-[10px] text-muted-foreground">{riskExposure[riskExposure.length - 1].day}</span>
            </div>
          </div>
        )}
      </ReportPage>
    </>
  );
};

export default VulnTrending;
