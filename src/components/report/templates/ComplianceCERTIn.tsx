import React from "react";
import ReportPage from "../ReportPage";
import { certInData } from "@/data/complianceData";

const ComplianceCERTIn = () => {
    // Simple trend data for CSS chart
    const trendData = [
        { month: 'Jan', vulns: 65 },
        { month: 'Feb', vulns: 59 },
        { month: 'Mar', vulns: 80 },
        { month: 'Apr', vulns: 81 },
        { month: 'May', vulns: 56 },
        { month: 'Jun', vulns: 55 },
        { month: 'Jul', vulns: 40 },
    ];
    const maxVulns = Math.max(...trendData.map(d => d.vulns));

    return (
        <ReportPage sectionTitle="Information Security Audit (CERT-In / ISO 27001)" light={true}>
            <div className="space-y-8">

                {/* Executive Summary Row */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-5 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Assets in Scope</h4>
                        <div className="text-4xl font-bold text-obsera-navy">{certInData.assetsScanned}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total IPs and Domains audited</p>
                    </div>

                    <div className="col-span-1 bg-obsera-surface-elevated border border-border rounded-lg p-5 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Critical Issues</h4>
                        <div className="text-4xl font-bold text-obsera-critical">
                            {certInData.vulnerabilitySummary.find(v => v.severity === 'Critical')?.count || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Requires immediate patching ( &lt; 24h )</p>
                    </div>

                    <div className="col-span-2 bg-obsera-surface-elevated border border-border rounded-lg p-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-4">Vulnerability Distribution</h4>
                        {/* Simple CSS Bar Chart for Distribution */}
                        <div className="h-24 w-full flex items-end gap-2 px-4 pb-2">
                            {certInData.vulnerabilitySummary.map((item, i) => {
                                const maxCount = Math.max(...certInData.vulnerabilitySummary.map(v => v.count));
                                const heightPercent = (item.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{item.count}</div>
                                        <div
                                            className="w-full rounded-t-sm transition-all"
                                            style={{
                                                height: `${heightPercent}%`,
                                                backgroundColor: item.color,
                                                maxHeight: '100%'
                                            }}
                                        ></div>
                                        <span className="text-[9px] uppercase font-semibold text-muted-foreground truncate w-full text-center">{item.severity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Audit Scope Table */}
                <div>
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
                            {certInData.auditScope.map((item, idx) => (
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
                <div>
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
                                {certInData.topVulnerabilities.map((vuln, idx) => (
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

                {/* Remediation Trend - CSS Bar Chart */}
                <div>
                    <h3 className="text-lg font-bold text-obsera-navy mb-4 section-accent">Vulnerability Discovery Trend (6 Months)</h3>
                    <div className="h-48 border border-border rounded-lg p-6 bg-white flex items-end gap-3">
                        {trendData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div
                                    className="w-full bg-obsera-cyan/20 rounded-t flex flex-col justify-end items-center relative group-hover:bg-obsera-cyan/30 transition-colors"
                                    style={{ height: `${(d.vulns / maxVulns) * 100}%` }}
                                >
                                    <div className="w-full h-1 bg-obsera-cyan absolute top-0"></div>
                                    <span className="mb-2 text-xs font-bold text-obsera-cyan">{d.vulns}</span>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </ReportPage>
    );
};

export default ComplianceCERTIn;
