import ReportPage from "./ReportPage";
import { findings, type Finding } from "@/data/reportData";

const severityColor: Record<string, string> = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
  Info: "severity-info",
};

const cvssColor = (score: number) => {
  if (score >= 9) return "hsl(0, 84%, 60%)";
  if (score >= 7) return "hsl(25, 95%, 53%)";
  if (score >= 4) return "hsl(45, 93%, 47%)";
  return "hsl(142, 71%, 45%)";
};

const evidenceImages: Record<string, string> = {
  "OSEC-F001": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
  "OSEC-F002": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
  "OSEC-F004": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80",
  "OSEC-F007": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
};

const FindingCard = ({ finding, pageNum }: { finding: Finding; pageNum: number }) => (
  <ReportPage pageNum={pageNum} sectionTitle="Detailed Findings">
    <div className="avoid-break">
      {/* Finding Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono-ibm text-[hsl(var(--obsera-cyan))] text-lg font-bold">
            {finding.id}
          </span>
          <span className={`${severityColor[finding.severity]} px-3 py-1 rounded text-[10px] font-bold uppercase`}>
            {finding.severity}
          </span>
        </div>
        {finding.cve && (
          <span className="font-mono-jb text-[10px] text-muted-foreground bg-[hsl(var(--obsera-surface))] px-2 py-1 rounded">
            {finding.cve}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold mb-3">{finding.title}</h3>

      {/* CVSS Bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono-ibm text-muted-foreground w-20">CVSS {finding.cvss}</span>
        <div className="cvss-bar flex-1">
          <div
            className="cvss-bar-fill"
            style={{
              width: `${(finding.cvss / 10) * 100}%`,
              background: cvssColor(finding.cvss),
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <span className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Category: </span>
        <span className="text-xs text-[hsl(var(--obsera-cyan))]">{finding.category}</span>
      </div>

      {/* Affected Hosts */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Affected Hosts
      </h4>
      <div className="flex flex-wrap gap-1 mb-4">
        {finding.affectedHosts.map((h) => (
          <span key={h} className="font-mono-ibm text-[9px] bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] px-2 py-1 rounded">
            {h}
          </span>
        ))}
      </div>

      {/* Description */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Description
      </h4>
      <p className="text-xs text-foreground/80 leading-relaxed mb-4">{finding.description}</p>

      {/* Evidence */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Evidence / Proof of Concept
      </h4>
      {evidenceImages[finding.id] && (
        <div className="w-full h-24 rounded-lg overflow-hidden mb-2 relative">
          <img src={evidenceImages[finding.id]} alt="Evidence" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
        </div>
      )}
      <div className="bg-[hsl(var(--obsera-navy-deep))] rounded-lg p-3 mb-4 border border-[hsl(var(--border))]">
        <pre className="font-mono-jb text-[9px] text-[hsl(var(--obsera-cyan))] whitespace-pre-wrap leading-relaxed">
          {finding.evidence}
        </pre>
      </div>

      {/* Impact */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Impact
      </h4>
      <div className="p-3 rounded-lg border-l-4 border-[hsl(var(--obsera-high))] bg-[hsl(var(--obsera-surface))] mb-4">
        <p className="text-xs text-foreground/80 leading-relaxed">{finding.impact}</p>
      </div>

      {/* Remediation */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Remediation
      </h4>
      <div className="p-3 rounded-lg border-l-4 border-[hsl(var(--obsera-low))] bg-[hsl(var(--obsera-surface))] mb-4">
        <pre className="font-mono-ibm text-[9px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
          {finding.remediation}
        </pre>
      </div>

      {/* References */}
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
        References
      </h4>
      <div className="flex flex-wrap gap-2">
        {finding.references.map((r) => (
          <span key={r} className="font-mono-ibm text-[8px] text-[hsl(var(--obsera-cyan))] underline">{r}</span>
        ))}
      </div>
    </div>
  </ReportPage>
);

const DetailedFindings = () => {
  return (
    <>
      <ReportPage pageNum={16} sectionTitle="Detailed Findings">
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Detailed Findings
        </h2>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          This section provides a comprehensive breakdown of all vulnerabilities identified during the 
          assessment. Each finding includes severity rating, CVSS score, affected hosts, detailed description, 
          evidence, impact analysis, and remediation steps.
        </p>

        {/* Summary table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>CVSS</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr key={f.id}>
                <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{f.id}</td>
                <td className="text-[9px]">{f.title}</td>
                <td>
                  <span className={`${severityColor[f.severity]} px-2 py-0.5 rounded text-[8px] font-bold uppercase`}>
                    {f.severity}
                  </span>
                </td>
                <td className="font-mono-ibm font-bold" style={{ color: cvssColor(f.cvss) }}>{f.cvss}</td>
                <td className="text-[9px]">{f.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportPage>

      {findings.map((f, i) => (
        <FindingCard key={f.id} finding={f} pageNum={17 + i} />
      ))}
    </>
  );
};

export default DetailedFindings;
