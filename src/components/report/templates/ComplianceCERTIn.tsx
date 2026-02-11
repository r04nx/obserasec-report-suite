import React from "react";
import ReportPage from "../ReportPage";
import { certInData } from "@/data/complianceData";

const ComplianceCERTIn = ({ data, meta }: { data: any; meta?: any }) => {
    if (!data) return null;
    const certInDataValue = data;

    // ... rest of the logic ...
    const trendData = (certInDataValue.trendData || [
        { month: 'Jan', vulns: 65 },
        { month: 'Feb', vulns: 59 },
        { month: 'Mar', vulns: 80 },
        { month: 'Apr', vulns: 81 },
        { month: 'May', vulns: 56 },
        { month: 'Jun', vulns: 55 },
        { month: 'Jul', vulns: 40 },
    ]);
    const maxVulns = Math.max(...trendData.map((d: any) => d.vulns), 1);

    return (
        <ReportPage sectionTitle="Information Security Audit (CERT-In / ISO 27001)" light={true} meta={meta}>
            <div className="space-y-8">

                {/* Executive Summary Row */}
                <div className="grid grid-cols-4 gap-6 avoid-break">
                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-5 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Assets in Scope</h4>
                        <div className="text-4xl font-bold text-obsera-navy">{certInDataValue.assetsScanned || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total IPs and Domains audited</p>
                    </div>

                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-5 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Critical Issues</h4>
                        <div className="text-4xl font-bold text-obsera-critical">
                            {(certInDataValue.vulnerabilitySummary || []).find((v: any) => v.severity === 'Critical')?.count || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Requires immediate patching ( &lt; 24h )</p>
                    </div>

                    <div className="col-span-2 bg-obsera-surface-elevated border border-border rounded-lg p-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4">Vulnerability Distribution</h4>
                        <div className="h-32 w-full flex items-end gap-3 px-4 pb-4 bg-slate-50/50 rounded-lg border border-slate-100">
                            {(certInDataValue.vulnerabilitySummary || certInDataValue.vulnerabilityDistribution || []).map((item: any, i: number) => {
                                const summary = certInDataValue.vulnerabilitySummary || certInDataValue.vulnerabilityDistribution || [];
                                const maxCount = Math.max(...summary.map((v: any) => v.count), 1);
                                const heightPercent = (item.count / maxCount) * 100;

                                // Explicit HSL mapping for PDF stability
                                const barColor =
                                    item.severity === 'Critical' ? 'hsl(0, 84%, 60%)' :
                                        item.severity === 'High' ? 'hsl(25, 95%, 53%)' :
                                            item.severity === 'Medium' ? 'hsl(45, 93%, 47%)' :
                                                item.severity === 'Low' ? 'hsl(142, 71%, 45%)' :
                                                    '#44AC96';

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                        <div className="text-[10px] font-black text-slate-700 opacity-80 mb-1">{item.count}</div>
                                        <div
                                            className="w-full rounded-t flex flex-col justify-between items-center relative overflow-hidden shadow-sm"
                                            style={{
                                                height: `${Math.max(4, heightPercent)}%`,
                                                backgroundColor: barColor,
                                                minHeight: item.count > 0 ? '6px' : '2px'
                                            }}
                                        >
                                            <div className="w-full h-1 bg-white opacity-20 absolute top-0" />
                                        </div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 truncate w-full text-center mt-1">{item.severity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Audit Scope Table */}
                <div className="avoid-break mt-8">
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Audit Scope & Methodology</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Asset Category</th>
                                <th>Count</th>
                                <th>Testing Methodology / Standard</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(certInDataValue.auditScope || []).map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="font-medium text-foreground">{item.type}</td>
                                    <td>{item.count}</td>
                                    <td className="text-muted-foreground italic">{item.methodology}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Vulnerabilities */}
                <div className="avoid-break mt-10">
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Top Critical Findings</h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th className="w-1/4">Vulnerability Title</th>
                                    <th className="w-1/6">CVE / ID</th>
                                    <th className="w-1/6">Severity</th>
                                    <th className="w-1/4">Affected Asset</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(certInDataValue.topVulnerabilities || []).map((vuln: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="font-bold text-obsera-navy-deep text-xs">{vuln.title}</td>
                                        <td className="font-mono text-[10px] text-muted-foreground">{vuln.cve}</td>
                                        <td>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                          ${vuln.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                                    vuln.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {vuln.severity}
                                            </span>
                                        </td>
                                        <td className="text-xs text-muted-foreground">{vuln.asset}</td>
                                        <td>
                                            <span className={`text-[10px] font-medium 
                            ${vuln.status === 'Open' ? 'text-red-600' : 'text-green-600'}`}>
                                                {vuln.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="avoid-break mt-10">
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Vulnerability Discovery Trend (6 Months)</h3>
                    <div className="h-48 border border-border rounded-lg p-6 bg-slate-50/30 flex items-end gap-3">
                        {trendData.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div
                                    className="w-full bg-[rgba(68,172,150,0.15)] rounded-t flex flex-col justify-end items-center relative border-x border-t border-[rgba(68,172,150,0.2)]"
                                    style={{ height: `${Math.max(5, (d.vulns / maxVulns) * 100)}%` }}
                                >
                                    <div className="w-full h-1 bg-[#44AC96] absolute top-0"></div>
                                    <span className="mb-1 text-[10px] font-black text-[#44AC96]">{d.vulns}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold tracking-tight uppercase">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </ReportPage>
    );
};

export default ComplianceCERTIn;
