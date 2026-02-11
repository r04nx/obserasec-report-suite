import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Server } from "lucide-react";
import { portScanResults, glossary } from "@/data/reportData";

const Appendices = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;
  const { portScan, glossary: glossaryList } = data;

  return (
    <>
      {(portScan || []).length === 0 ? (
        <ReportPage pageNum={44} sectionTitle="Appendices" meta={meta}>
          <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
            Appendices
          </h2>
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
            A. Port Scan Results
          </h3>
          <EmptyState message="No port scan results available" icon={<Server size={32} />} height="200px" />
        </ReportPage>
      ) : (
        (() => {
          const CHUNK_SIZE = 35;
          const chunks = [];
          const scanResults = portScan || [];
          for (let i = 0; i < scanResults.length; i += CHUNK_SIZE) {
            chunks.push(scanResults.slice(i, i + CHUNK_SIZE));
          }
          return chunks.map((chunk, idx) => (
            <ReportPage key={`portscan-${idx}`} pageNum={44 + idx} sectionTitle="Appendices" meta={meta} showFooter={idx === 0}>
              {idx === 0 && (
                <>
                  <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
                    Appendices
                  </h2>
                  <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
                    A. Port Scan Results
                  </h3>
                </>
              )}
              <div className={idx > 0 ? "pt-2" : ""}>
                <table className="report-table text-[8px]">
                  <thead>
                    <tr><th>IP Address</th><th>Port</th><th>Protocol</th><th>Service</th><th>Version</th><th>State</th></tr>
                  </thead>
                  <tbody>
                    {chunk.map((p: any, i: number) => (
                      <tr key={i}>
                        <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{p.ip}</td>
                        <td className="font-mono-ibm">{p.port}</td>
                        <td className="font-mono-ibm">{p.protocol}</td>
                        <td>{p.service}</td>
                        <td className="font-mono-jb">{p.version}</td>
                        <td><span className="bg-[hsl(142,71%,45%)] text-white px-1.5 py-0.5 rounded text-[7px] font-bold">{p.state}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportPage>
          ));
        })()
      )}

      {/* Glossary */}
      <ReportPage pageNum={44 + Math.max(1, Math.ceil((portScan || []).length / 35))} sectionTitle="Appendices" meta={meta} showFooter={false}>
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          B. Glossary of Terms
        </h3>
        <table className="report-table mb-8">
          <thead>
            <tr><th>Term</th><th>Definition</th></tr>
          </thead>
          <tbody>
            {(glossaryList || []).map((g: any) => (
              <tr key={g.term}>
                <td className="font-mono-ibm font-bold text-[hsl(var(--obsera-cyan))] whitespace-nowrap">{g.term}</td>
                <td className="text-[9px] text-foreground/80">{g.definition}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          C. CVSS v3.1 Scoring Methodology
        </h3>
        <div className="space-y-3 text-[10px] text-foreground/80 leading-relaxed">
          <p>The Common Vulnerability Scoring System (CVSS) v3.1 provides a standardized framework for rating the severity of security vulnerabilities. Scores range from 0.0 to 10.0:</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { range: "0.0", label: "None", color: "hsl(210, 20%, 60%)" },
              { range: "0.1–3.9", label: "Low", color: "hsl(142, 71%, 45%)" },
              { range: "4.0–6.9", label: "Medium", color: "hsl(45, 93%, 47%)" },
              { range: "7.0–8.9", label: "High", color: "hsl(25, 95%, 53%)" },
              { range: "9.0–10.0", label: "Critical", color: "hsl(0, 84%, 60%)" },
            ].map((s) => (
              <div key={s.label} className="p-2 rounded bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
                <div className="font-bold font-mono-ibm" style={{ color: s.color }}>{s.range}</div>
                <div className="text-[9px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <p>CVSS scores incorporate Base, Temporal, and Environmental metrics. This report uses Base scores. The Base metric group includes Attack Vector, Attack Complexity, Privileges Required, User Interaction, Scope, Confidentiality Impact, Integrity Impact, and Availability Impact.</p>
        </div>

        {/* Sample tool output */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 mt-6 section-accent">
          {data.toolOutputTitle || "D. Sample Tool Output"}
        </h3>
        <div className="bg-[hsl(var(--obsera-navy-deep))] rounded-lg p-4 border border-[hsl(var(--border))]">
          <pre className="font-mono-jb text-[8px] text-[hsl(var(--obsera-cyan))] leading-relaxed whitespace-pre-wrap">{data.toolOutputText || "No sample output provided."}</pre>
        </div>
      </ReportPage>
    </>
  );
};

export default Appendices;
