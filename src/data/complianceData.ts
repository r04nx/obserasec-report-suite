
export const dpdpData = {
    privacyScore: 82,
    complianceStatus: "Largely Compliant",
    gapCount: 3,
    consentMetrics: [
        { name: "Granted", value: 65, color: "#10B981" }, // Emerald 500
        { name: "Withdrawn", value: 5, color: "#EF4444" }, // Red 500
        { name: "Pending", value: 30, color: "#F59E0B" }, // Amber 500
    ],
    dsrMetrics: [
        { type: "Access", received: 120, fulfilled: 115 },
        { type: "Correction", received: 45, fulfilled: 42 },
        { type: "Erasure", received: 15, fulfilled: 10 },
        { type: "Grievance", received: 8, fulfilled: 8 },
    ],
    piiInventory: [
        { category: "Customer Identity", type: "Name, Mobile, Email", lawfulBasis: "Consent", exposure: "Low" },
        { category: "Financial", type: "Bank Account, UPI ID", lawfulBasis: "Contract", exposure: "High" },
        { category: "Employee", type: "PAN, Address", lawfulBasis: "Employment", exposure: "Medium" },
    ],
    complianceMatrix: [
        { section: "Notice (Section 5)", status: "Compliant", remarks: "Privacy notices updated in 12 languages." },
        { section: "Consent (Section 6)", status: "Partial", remarks: "Legacy data re-consent pending." },
        { section: "Data Fiduciary Duties (Section 8)", status: "Compliant", remarks: "Security safeguards implemented." },
        { section: "Data Principal Rights (Section 11-14)", status: "Compliant", remarks: "DSR portal operational." },
        { section: "Cross-border Transfer (Section 16)", status: "Review", remarks: "Awaiting final negative list." },
    ]
};

export const certInData = {
    scanDate: "2026-02-08",
    assetsScanned: 142,
    vulnerabilitySummary: [
        { severity: "Critical", count: 2, color: "#EF4444" },
        { severity: "High", count: 8, color: "#F97316" },
        { severity: "Medium", count: 24, color: "#F59E0B" },
        { severity: "Low", count: 45, color: "#3B82F6" },
    ],
    topVulnerabilities: [
        { title: "SQL Injection", cve: "CVE-2024-1234", severity: "Critical", asset: "payment-gateway.api", status: "Open" },
        { title: "Remote Code Execution (Log4j)", cve: "CVE-2021-44228", severity: "Critical", asset: "legacy-logger", status: "Mitigated" },
        { title: "Weak TLS Cipher Suites", cve: "N/A", severity: "High", asset: "*.obsera.com", status: "Open" },
        { title: "Missing Security Headers", cve: "N/A", severity: "Medium", asset: "frontend-app", status: "Open" },
    ],
    auditScope: [
        { type: "Web Application", count: 5, methodology: "OWASP Top 10" },
        { type: "Network Devices", count: 12, methodology: "NIST SP 800-115" },
        { type: "Cloud Infrastructure", count: 25, methodology: "CIS Benchmarks" },
        { type: "Mobile Apps", count: 2, methodology: "MASVS" },
    ]
};

export const bfsiData = {
    governanceScore: 78,
    rbiMasterDirectionStatus: "Compliant",
    sebiCscrfStatus: "Partial",
    riskHeatmap: [
        { risk: "Data Leakage", likelihood: 4, impact: 5, score: 20 },
        { risk: "Ransomware", likelihood: 3, impact: 5, score: 15 },
        { risk: "DDoS", likelihood: 4, impact: 3, score: 12 },
        { risk: "Insider Threat", likelihood: 2, impact: 4, score: 8 },
        { risk: "Supply Chain", likelihood: 3, impact: 4, score: 12 },
    ],
    controlGaps: [
        { control: "Vendor Risk Management", framework: "RBI", gap: "Audits for non-critical vendors missing", priority: "High" },
        { control: "Data Localization", framework: "RBI", gap: "Secondary backup in diff geography", priority: "Medium" },
        { control: "MFA for Critical Apps", framework: "SEBI", gap: "Legacy trading terminal pending MFA", priority: "Critical" },
    ]
};
