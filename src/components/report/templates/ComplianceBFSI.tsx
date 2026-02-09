import React from "react";
import ReportPage from "../ReportPage";
import { bfsiData } from "@/data/complianceData";

const ComplianceBFSI = () => {
    // Risk Matrix helpers
    const likelihoods = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
    const impacts = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];

    // Helper to determine cell color based on risk score (Likelihood * Impact)
    const getRiskColor = (l: number, i: number) => {
        const score = (l + 1) * (i + 1);
        if (score >= 20) return "bg-obsera-critical text-white";
        if (score >= 12) return "bg-obsera-high text-white";
        if (score >= 6) return "bg-obsera-medium text-white";
        if (score >= 3) return "bg-obsera-low text-white";
        return "bg-obsera-info text-white";
    };

    return (
        <ReportPage sectionTitle="Regulatory Compliance (RBI / SEBI)" light={true}>
            <div className="space-y-8">

                {/* Governance Scorecard */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Governance Score</h3>
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={bfsiData.governanceScore > 75 ? "hsl(var(--obsera-cyan))" : "hsl(var(--obsera-medium))"}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(bfsiData.governanceScore / 100) * 351.8} 351.8`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-foreground">{bfsiData.governanceScore}/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-1 gap-4">
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-obsera-navy">RBI Master Directions (IT Governance)</h4>
                                <p className="text-xs text-muted-foreground">Compliance Status</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded text-sm">{bfsiData.rbiMasterDirectionStatus}</span>
                        </div>
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-obsera-navy">SEBI CSCRF (Stock Brokers)</h4>
                                <p className="text-xs text-muted-foreground">Cyber Security & Cyber Resilience Framework</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded text-sm">{bfsiData.sebiCscrfStatus}</span>
                        </div>
                    </div>
                </div>

                {/* Risk Heatmap */}
                <div>
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
                                    <div className="text-xs font-bold text-right pr-2 text-muted-foreground uppercase flex items-center justify-end h-16">{lik}</div>
                                    {[...Array(5)].map((_, colIdx) => (
                                        <div
                                            key={`${rowIdx}-${colIdx}`}
                                            className={`h-16 rounded flex items-center justify-center relative ${getRiskColor(4 - rowIdx, colIdx)}`}
                                        >
                                            {/* Mocking placement of risks based on score/coordinates could be dynamic, here static styling */}
                                            {bfsiData.riskHeatmap.filter(r => r.likelihood === (5 - rowIdx) && r.impact === (colIdx + 1)).map((r, i) => (
                                                <div key={i} className="absolute inset-0 flex items-center justify-center p-1">
                                                    <span className="text-[8px] font-bold text-center leading-tight">{r.risk}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </React.Fragment>
                            )).reverse()}
                        </div>
                        <div className="mt-2 text-xs font-bold text-muted-foreground uppercase">Impact &rarr;</div>
                    </div>
                </div>

                {/* Control Gaps Table */}
                <div>
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
                            {bfsiData.controlGaps.map((item, idx) => (
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
