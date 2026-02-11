import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Search } from "lucide-react";
import { type Finding } from "@/data/reportData";

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

const FindingCard = ({ finding, pageNum, meta }: { finding: Finding; pageNum: number; meta?: any }) => (
  <ReportPage pageNum={pageNum} sectionTitle="Detailed Findings" meta={meta}>
    <div className="avoid-break">
      {/* Finding Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 max-w-[80%]">
          <span className="font-mono-ibm text-[hsl(var(--obsera-cyan))] text-xs font-bold break-all">
            {finding.id}
          </span>
          <span className={`${severityColor[finding.severity]} px-3 py-1 rounded text-[10px] font-bold uppercase shrink-0`}>
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
        {finding.evidenceTitle || "Evidence / Proof of Concept"}
      </h4>
      {(finding.evidenceImageUrl || evidenceImages[finding.id]) && (
        <div className="w-full h-24 rounded-lg overflow-hidden mb-2 relative">
          <img src={finding.evidenceImageUrl || evidenceImages[finding.id]} alt="Evidence" className="w-full h-full object-cover opacity-60" />
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

const DetailedFindings = ({ data, meta }: { data: any; meta?: any }) => {
  const rawFindings = (Array.isArray(data) ? data : (data?.findings || []));
  const title = data?.title || "Detailed Findings";
  const description = data?.description || "This section provides a summary of unique vulnerabilities identified during the assessment. Redundant findings have been consolidated to highlight critical exposure areas.";

  // 1. Clean Title and Deduplicate
  const uniqueFindingsMap = new Map();

  rawFindings.forEach((f: any) => {
    // Strip "detected by sfp_..." from title
    const cleanTitle = f.title.split(" detected by ")[0];
    const key = `${cleanTitle}-${f.severity}`;

    if (!uniqueFindingsMap.has(key)) {
      uniqueFindingsMap.set(key, {
        ...f,
        title: cleanTitle,
        count: 1
      });
    } else {
      uniqueFindingsMap.get(key).count += 1;
    }
  });

  const findingsList = Array.from(uniqueFindingsMap.values())
    .sort((a, b) => {
      const severityOrder: any = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.cvss - a.cvss;
    });

  // Paginate table for unique findings (25 per page to avoid footer overlap)
  const CHUNK_SIZE = 36;
  const findingChunks = [];
  for (let i = 0; i < findingsList.length; i += CHUNK_SIZE) {
    findingChunks.push(findingsList.slice(i, i + CHUNK_SIZE));
  }

  // Filter for detail cards (still filtered by severity)
  const detailCards = findingsList
    .filter((f: any) => f.severity === "Critical" || f.severity === "High" || f.severity === "Medium")
    .slice(0, 100);

  return (
    <>
      {findingChunks.map((chunk, chunkIdx) => (
        <ReportPage
          key={`table-page-${chunkIdx}`}
          pageNum={16 + chunkIdx}
          sectionTitle={chunkIdx === 0 ? title : `${title} (Cont.)`}
          meta={meta}
          showFooter={chunkIdx === 0}
        >
          {chunkIdx === 0 && (
            <>
              <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
                {title}
              </h2>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                {description}
              </p>
            </>
          )}

          {findingsList.length === 0 ? (
            <EmptyState message="No vulnerabilities found" icon={<Search size={32} />} height="300px" />
          ) : (
            <div className="w-full">
              <table className="report-table w-full border border-[hsl(var(--border))]">
                <thead>
                  <tr className="bg-[hsl(var(--obsera-navy))]">
                    <th className="text-left py-2 px-3">Finding Title</th>
                    <th className="text-left py-2 px-3 w-20">Severity</th>
                    <th className="text-left py-2 px-3 w-16">CVSS</th>
                    <th className="text-left py-2 px-3 w-24 text-center">Occurrences</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((f: any, idx: number) => (
                    <tr key={`${f.title}-${idx}`} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--obsera-surface))]">
                      <td className="text-[10px] py-1.5 px-3 font-semibold text-[hsl(var(--obsera-cyan))] leading-snug">
                        {f.title}
                      </td>
                      <td className="py-1.5 px-3">
                        <span className={`${severityColor[f.severity] || 'severity-info'} px-1.5 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap`}>
                          {f.severity}
                        </span>
                      </td>
                      <td className="font-mono-ibm font-bold py-1.5 px-3 text-[10px]" style={{ color: cvssColor(f.cvss || 0) }}>
                        {f.cvss || 0}
                      </td>
                      <td className="text-[10px] py-1.5 px-3 font-mono-ibm text-center bg-[hsl(var(--obsera-surface-elevated))] font-bold text-muted-foreground">
                        {f.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReportPage>
      ))}

      {detailCards.map((f: any, i: number) => (
        <FindingCard key={`${f.title}-${i}`} finding={f} pageNum={16 + findingChunks.length + i} meta={meta} />
      ))}
    </>
  );
};

export default DetailedFindings;
