import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Server } from "lucide-react";

const riskBg: Record<string, string> = {
  Critical: "border-l-4 border-l-[hsl(0,84%,60%)]",
  High: "border-l-4 border-l-[hsl(25,95%,53%)]",
  Medium: "border-l-4 border-l-[hsl(45,93%,47%)]",
  Low: "border-l-4 border-l-[hsl(142,71%,45%)]",
};

const riskColor: Record<string, string> = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
};

const HostSummary = ({ data, meta }: { data: any; meta?: any }) => {
  const assets = (Array.isArray(data) ? data : (data?.assets || []));
  const title = data?.title || "Host-Level Summary";
  const description = data?.description || "Detailed per-host security assessment results showing identified vulnerabilities, open services, and overall risk classification for each assessed system.";

  const half = Math.ceil(assets.length / 2);
  const page1 = assets.slice(0, half);
  const page2 = assets.slice(half);

  const HostTable = ({ assets }: { assets: any[] }) => (
    <div className="grid grid-cols-1 gap-2 mb-8">
      {assets.map((a) => (
        <div key={a.ip} className={`p-3 rounded-lg bg-[hsl(var(--obsera-surface))] ${riskBg[a.risk] || ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono-ibm text-[hsl(var(--obsera-cyan))] text-xs font-bold">{a.ip}</span>
              <span className="font-mono-jb text-xs text-muted-foreground">({a.hostname})</span>
            </div>
            <span className={`${riskColor[a.risk] || 'severity-info'} px-2 py-0.5 rounded text-[8px] font-bold uppercase`}>
              {a.risk}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[9px]">
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">OS</span>
              <div className="text-foreground/80">{a.os}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">Type</span>
              <div className="text-foreground/80">{a.type}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">Ports</span>
              <div className="font-mono-ibm text-foreground/80">{a.ports}</div>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">Vulns</span>
              <div className="font-mono-ibm font-bold text-[hsl(193,82%,31%)]">{a.vulns}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {assets.length === 0 ? (
        <ReportPage pageNum={38} sectionTitle={title} meta={meta}>
          <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
            {title}
          </h2>
          <EmptyState message="No network assets data available" icon={<Server size={32} />} height="300px" />
        </ReportPage>
      ) : (
        (() => {
          const firstPageSize = 10;
          const subsequentPageSize = 12;
          const chunks = [];

          // First chunk
          chunks.push(assets.slice(0, firstPageSize));

          // Subsequent chunks
          for (let i = firstPageSize; i < assets.length; i += subsequentPageSize) {
            chunks.push(assets.slice(i, i + subsequentPageSize));
          }

          return chunks.map((chunk, idx) => (
            <ReportPage key={idx} pageNum={38 + idx} sectionTitle={idx === 0 ? title : `${title} (Cont.)`} meta={meta} showFooter={idx === 0}>
              {idx === 0 && (
                <>
                  <h2 className="text-2xl font-bold text-[hsl(193,82%,31%)] mb-6 section-accent">
                    {title}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {description}
                  </p>
                </>
              )}
              <div className={idx > 0 ? "pt-2" : ""}>
                <HostTable assets={chunk} />
              </div>
            </ReportPage>
          ));
        })()
      )}
    </>
  );
};

export default HostSummary;
