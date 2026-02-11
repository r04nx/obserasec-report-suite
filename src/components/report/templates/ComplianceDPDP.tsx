import React from "react";
import ReportPage from "../ReportPage";
import { dpdpData } from "@/data/complianceData";

const ComplianceDPDP = ({ data, meta }: { data: any; meta?: any }) => {
    if (!data) return null;
    const dpdpDataValue = data;

    const complianceMatrix = dpdpDataValue.complianceMatrix || [];
    const CHUNK_SIZE = 5;
    const matrixChunks = [];
    for (let i = 0; i < complianceMatrix.length; i += CHUNK_SIZE) {
        matrixChunks.push(complianceMatrix.slice(i, i + CHUNK_SIZE));
    }

    return (
        <>
            <ReportPage sectionTitle="Data Privacy & Compliance (DPDP 2023)" light={true} meta={meta}>
                <div className="space-y-8">
                    {/* Privacy Scorecard */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Tall Privacy Score Box */}
                        <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Privacy Score</h3>
                            <div className="relative w-32 h-32 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="hsl(25, 95%, 53%)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${(dpdpDataValue.privacyScore / 100) * 351.8} 351.8`}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-[hsl(25,95%,53%)]">{dpdpDataValue.privacyScore}%</span>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-xs">
                                {dpdpDataValue.complianceStatus}
                            </span>
                        </div>

                        {/* Right side container for Gaps, DSR and Applicability */}
                        <div className="col-span-2 grid grid-cols-2 gap-6 h-full">
                            <div className="bg-obsera-surface-elevated border border-border rounded-lg p-6">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Open Gaps</h3>
                                <div className="text-4xl font-bold text-foreground mb-1">{dpdpDataValue.gapCount}</div>
                                <p className="text-xs text-muted-foreground">High priority compliance gaps requiring immediate attention.</p>
                            </div>
                            <div className="bg-obsera-surface-elevated border border-border rounded-lg p-6">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">DSR Fulfillment</h3>
                                <div className="text-4xl font-bold text-foreground mb-1">{dpdpDataValue.dsrEfficiency}</div>
                                <p className="text-xs text-muted-foreground">Average operational efficiency in handling data principal requests.</p>
                            </div>
                            <div className="col-span-2 bg-obsera-surface-elevated border border-border rounded-lg p-6 flex items-center gap-6">
                                <div className="w-12 h-12 shrink-0 bg-[#060d1a] rounded flex items-center justify-center border border-[hsl(193,82%,31%,0.3)]">
                                    <svg viewBox="0 0 100 100" className="w-8 h-8 fill-[hsl(193,82%,31%)]">
                                        <path d="M50 5 L10 25 L10 55 C10 75 30 90 50 95 C70 90 90 75 90 55 L90 25 L50 5 Z M50 20 C58 20 65 27 65 35 L65 45 L70 45 L70 75 L30 75 L30 45 L35 45 L35 35 C35 27 42 20 50 20 Z M50 30 C47 30 45 32 45 35 L45 45 L55 45 L55 35 C55 32 53 30 50 30 Z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-foreground mb-1">{dpdpDataValue.applicabilityTitle}</h4>
                                    <div className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: dpdpDataValue.applicabilityText }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consent and DSR */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-[hsl(193,82%,31%)] rounded-full" />
                                <h3 className="text-lg font-bold text-obsera-navy uppercase tracking-tight">Consent Management</h3>
                            </div>
                            <div className="bg-obsera-surface-elevated border border-border rounded-lg p-6 h-64 flex flex-col items-center justify-center">
                                {/* SVG Donut Chart for Consents */}
                                <div className="relative w-40 h-40">
                                    <svg viewBox="0 0 36 36" className="w-full h-full">
                                        <path className="stroke-[#0e7490]" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="65, 100" />
                                        <path className="stroke-[#ef4444]" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="5, 100" strokeDashoffset="-65" />
                                        <path className="stroke-[#f59e0b]" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="30, 100" strokeDashoffset="-70" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-center">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Active<br />Consents</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                                    {dpdpDataValue.consentMetrics.map((m: any, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                                            <span className="text-[9px] font-semibold text-muted-foreground">{m.name} ({m.value}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 bg-[hsl(193,82%,31%)] rounded-full" />
                                <h3 className="text-lg font-bold text-obsera-navy uppercase tracking-tight">Data Principal Rights (DSR)</h3>
                            </div>
                            <div className="bg-obsera-surface-elevated border border-border rounded-lg p-6 h-64 space-y-4">
                                {dpdpDataValue.dsrMetrics.map((m: any, i: number) => {
                                    const percent = (m.fulfilled / m.received) * 100;
                                    return (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-foreground">{m.type}</span>
                                                <span className="text-muted-foreground">{m.fulfilled}/{m.received}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[hsl(193,82%,31%)]" style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* PII Inventory */}
                    <div className="avoid-break pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-[hsl(193,82%,31%)] rounded-full" />
                            <h3 className="text-lg font-bold text-obsera-navy uppercase tracking-tight">{dpdpDataValue.piiInventoryTitle}</h3>
                        </div>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th className="w-1/4">Category</th>
                                    <th>Data Elements</th>
                                    <th className="w-1/5">Lawful Basis</th>
                                    <th className="w-1/6">Risk Exposure</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dpdpDataValue.piiInventory.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="font-bold text-obsera-navy">{item.category}</td>
                                        <td className="text-xs">{item.type}</td>
                                        <td className="text-xs">{item.lawfulBasis}</td>
                                        <td>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.exposure === 'High' ? 'bg-red-50 text-red-700' :
                                                item.exposure === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-green-50 text-green-700'
                                                }`}>
                                                {item.exposure}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ReportPage>

            {/* Chunked Compliance Matrix to avoid overlap */}
            {matrixChunks.map((chunk, chunkIdx) => (
                <ReportPage key={chunkIdx} sectionTitle="Section-wise Compliance Status" meta={meta} showFooter={false}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-6 bg-obsera-teal rounded-full" />
                        <h3 className="text-xl font-bold text-obsera-navy uppercase tracking-tight">
                            Section-wise Compliance Status {matrixChunks.length > 1 ? `(Part ${chunkIdx + 1})` : ''}
                        </h3>
                    </div>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th className="w-1/3">Act Section</th>
                                <th className="w-1/6">Status</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chunk.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="font-bold text-obsera-navy-deep">{item.section}</td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${item.status === 'Compliant' ? 'bg-green-50 text-green-700 border border-green-100' :
                                            item.status === 'Partial' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'Compliant' ? 'bg-green-500' : item.status === 'Partial' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="text-xs italic text-muted-foreground">{item.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ReportPage>
            ))}
        </>
    );
};

export default ComplianceDPDP;
