import React from "react";
import ReportPage from "../ReportPage";
import { dpdpData } from "@/data/complianceData";

const ComplianceDPDP = () => {
    return (
        <ReportPage sectionTitle="Data Privacy & Compliance (DPDP 2023)" light={true}>
            <div className="space-y-8">

                {/* Executive Summary / Scorecard */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Privacy Score</h3>
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={dpdpData.privacyScore > 80 ? "hsl(var(--obsera-teal))" : "hsl(var(--obsera-high))"}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(dpdpData.privacyScore / 100) * 351.8} 351.8`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-foreground">{dpdpData.privacyScore}%</span>
                            </div>
                        </div>
                        <span className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {dpdpData.complianceStatus}
                        </span>
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-5">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Open Gaps</h4>
                            <div className="text-4xl font-bold text-obsera-critical mb-1">{dpdpData.gapCount}</div>
                            <p className="text-xs text-muted-foreground">High priority compliance gaps requiring immediate attention.</p>
                        </div>
                        <div className="bg-obsera-surface-elevated border border-border rounded-lg p-5">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">DSR Fulfillment</h4>
                            <div className="text-4xl font-bold text-obsera-teal">96%</div>
                            <p className="text-xs text-muted-foreground">Average operational efficiency in handling data principal requests.</p>
                        </div>
                        <div className="col-span-2 bg-obsera-navy/5 border border-obsera-navy/10 rounded-lg p-4 flex items-center gap-4">
                            <div className="p-2 bg-obsera-navy text-white rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground text-sm">DPDP Act Applicability Confirmed</h4>
                                <p className="text-xs text-muted-foreground">Organization is classified as a <strong>Significant Data Fiduciary</strong> based on volume and sensitivity of processed PII.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Consent Metrics - CSS Gradient Pie */}
                    <div>
                        <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Consent Management</h3>
                        <div className="h-64 border border-border rounded-lg p-4 bg-white flex flex-col items-center justify-center">
                            <div
                                className="w-40 h-40 rounded-full relative"
                                style={{
                                    background: `conic-gradient(
                         ${dpdpData.consentMetrics[0].color} 0% 65%, 
                         ${dpdpData.consentMetrics[2].color} 65% 95%, 
                         ${dpdpData.consentMetrics[1].color} 95% 100%
                      )`
                                }}
                            >
                                <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-muted-foreground">Total</span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {dpdpData.consentMetrics.map((m, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                                        <span className="text-xs text-muted-foreground">{m.name} ({m.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* DSR Metrics - CSS Bar Chart */}
                    <div>
                        <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Data Principal Rights (DSR)</h3>
                        <div className="h-64 border border-border rounded-lg p-4 bg-white flex flex-col justify-center gap-3">
                            {dpdpData.dsrMetrics.map((m, i) => (
                                <div key={i} className="w-full">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-obsera-navy">{m.type}</span>
                                        <span className="text-muted-foreground">{m.fulfilled}/{m.received}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div className="h-full bg-obsera-teal rounded-full" style={{ width: `${(m.fulfilled / m.received) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PII Inventory Table */}
                <div>
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Personal Data Inventory (Sample)</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Data Elements</th>
                                <th>Lawful Basis</th>
                                <th>Risk Exposure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dpdpData.piiInventory.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="font-medium text-foreground">{item.category}</td>
                                    <td className="text-muted-foreground">{item.type}</td>
                                    <td>{item.lawfulBasis}</td>
                                    <td>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                       ${item.exposure === 'High' ? 'bg-red-100 text-red-800' :
                                                item.exposure === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {item.exposure}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Compliance Matrix */}
                <div>
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Section-wise Compliance Status</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th className="w-1/3">Act Section</th>
                                <th className="w-1/6">Status</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dpdpData.complianceMatrix.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="font-bold text-obsera-navy-deep">{item.section}</td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border
                       ${item.status === 'Compliant' ? 'bg-green-50 text-green-700 border-green-200' :
                                                item.status === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Compliant' ? 'bg-green-500' : item.status === 'Partial' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground text-xs italic">{item.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </ReportPage>
    );
};

export default ComplianceDPDP;
