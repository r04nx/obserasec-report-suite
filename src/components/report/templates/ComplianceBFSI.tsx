import React from "react";
import ReportPage from "../ReportPage";
import { bfsiData } from "@/data/complianceData";

const ComplianceBFSI = ({ data, meta }: { data: any; meta?: any }) => {
    if (!data) return null;
    const bfsiDataValue = data;

    // ... matrix logic ...
    const likelihoods = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
    const impacts = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];

    // Helper to determine cell color based on risk score (Likelihood * Impact)
    const getRiskColor = (l: number, i: number) => {
        const score = (l + 1) * (i + 1);
        if (score >= 20) return { bg: "hsl(0, 84%, 60%)", text: "white" };
        if (score >= 12) return { bg: "hsl(25, 95%, 53%)", text: "white" };
        if (score >= 6) return { bg: "hsl(45, 93%, 47%)", text: "hsl(222, 47%, 11%)" };
        if (score >= 3) return { bg: "hsl(142, 71%, 45%)", text: "white" };
        return { bg: "hsl(193, 82%, 31%)", text: "white" };
    };

    return (
        <ReportPage sectionTitle="Regulatory Compliance (RBI / SEBI)" light={true} meta={meta}>
            <div className="space-y-8">

                {/* Governance Scorecard */}
                <div className="grid grid-cols-3 gap-6 avoid-break">
                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Governance Score</h3>
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={bfsiDataValue.governanceScore > 75 ? "hsl(193, 82%, 31%)" : "hsl(45, 93%, 47%)"}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(bfsiDataValue.governanceScore / 100) * 351.8} 351.8`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-foreground">{bfsiDataValue.governanceScore}/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-1 gap-4">
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-obsera-navy">RBI Master Directions (IT Governance)</h4>
                                <p className="text-xs text-muted-foreground">Compliance Status</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded text-sm">{bfsiDataValue.rbiMasterDirectionStatus}</span>
                        </div>
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-obsera-navy">SEBI CSCRF (Stock Brokers)</h4>
                                <p className="text-xs text-muted-foreground">Cyber Security & Cyber Resilience Framework</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded text-sm">{bfsiDataValue.sebiCscrfStatus}</span>
                        </div>
                    </div>
                </div>

                {/* Risk Heatmap */}
                <div className="avoid-break mt-8">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-bold text-obsera-navy section-accent">Operational Risk Heatmap</h3>
                        <span className="text-xs text-muted-foreground italic">Based on Likelihood x Impact assessment</span>
                    </div>

                    <div className="border border-border rounded-lg p-4 bg-white flex flex-col items-center">
                        <div className="grid grid-cols-6 gap-1 w-full max-w-lg">
                            {/* Header Row */}
                            <div className="col-span-1"></div>
                            {impacts.map((imp, i) => (
                                <div key={i} className="text-xs font-bold text-center text-muted-foreground uppercase">{imp}</div>
                            ))}

                            {/* Matrix Rows */}
                            {likelihoods.map((lik, rowIdx) => (
                                <React.Fragment key={rowIdx}>
                                    <div className="text-[9px] font-bold text-right pr-2 text-muted-foreground uppercase flex items-center justify-end h-16">{lik}</div>
                                    {[...Array(5)].map((_, colIdx) => {
                                        const colors = getRiskColor(4 - rowIdx, colIdx);
                                        const score = (5 - rowIdx) * (colIdx + 1);
                                        return (
                                            <div
                                                key={`${rowIdx}-${colIdx}`}
                                                className="h-16 rounded flex flex-col items-center justify-center relative p-1 transition-all hover:brightness-110"
                                                style={{ backgroundColor: colors.bg, color: colors.text }}
                                            >
                                                <span className="text-[10px] font-black opacity-20 absolute top-1 right-1">{score}</span>
                                                {/* Detailed Metrics */}
                                                {(bfsiDataValue.riskHeatmap || []).filter((r: any) => r.likelihood === (5 - rowIdx) && r.impact === (colIdx + 1)).map((r: any, i: number) => (
                                                    <div key={i} className="w-full flex flex-col items-center justify-center">
                                                        <span className="text-[8px] font-bold text-center leading-tight mb-0.5">{r.risk}</span>
                                                        <span className="text-[6px] font-bold opacity-70 uppercase">L:{5 - rowIdx} I:{colIdx + 1}</span>
                                                    </div>
                                                ))}
                                                {(!bfsiDataValue.riskHeatmap || bfsiDataValue.riskHeatmap.filter((r: any) => r.likelihood === (5 - rowIdx) && r.impact === (colIdx + 1)).length === 0) && (
                                                    <span className="text-[8px] font-bold opacity-30 select-none">-</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            )).reverse()}
                        </div>
                        <div className="mt-2 text-xs font-bold text-muted-foreground uppercase">Impact &rarr;</div>
                    </div>
                </div>

                {/* Control Gaps Table */}
                <div className="avoid-break mt-8">
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Critical Control Deficiencies</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th className="w-1/4">Control Area</th>
                                <th className="w-1/6">Framework</th>
                                <th>Observation / Gap</th>
                                <th className="w-1/6">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(bfsiDataValue.controlGaps || []).map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="font-bold text-obsera-navy-deep">{item.control}</td>
                                    <td><span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">{item.framework}</span></td>
                                    <td className="text-sm text-foreground">{item.gap}</td>
                                    <td>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                       ${item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                                item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-amber-100 text-amber-800'}`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </ReportPage>
    );
};

export default ComplianceBFSI;
