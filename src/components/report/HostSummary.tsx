import ReportPage from "./ReportPage";
import { networkAssets } from "@/data/reportData";

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

const HostSummary = () => {
  const half = Math.ceil(networkAssets.length / 2);
  const page1 = networkAssets.slice(0, half);
  const page2 = networkAssets.slice(half);

  const HostTable = ({ assets }: { assets: typeof networkAssets }) => (
    <div className="space-y-2">
      {assets.map((a) => (
        <div key={a.ip} className={`p-3 rounded-lg bg-[hsl(var(--obsera-surface))] ${riskBg[a.risk]}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono-ibm text-[hsl(var(--obsera-cyan))] text-xs font-bold">{a.ip}</span>
              <span className="font-mono-jb text-xs text-muted-foreground">({a.hostname})</span>
            </div>
            <span className={`${riskColor[a.risk]} px-2 py-0.5 rounded text-[8px] font-bold uppercase`}>
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
              <div className="font-mono-ibm font-bold text-[hsl(var(--obsera-cyan))]">{a.vulns}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <ReportPage pageNum={38} sectionTitle="Host-Level Summary">
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          Host-Level Summary
        </h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Detailed per-host security assessment results showing identified vulnerabilities, open services,
          and overall risk classification for each assessed system.
        </p>
        <HostTable assets={page1} />
      </ReportPage>

      <ReportPage pageNum={39} sectionTitle="Host-Level Summary">
        <HostTable assets={page2} />
      </ReportPage>
    </>
  );
};

export default HostSummary;
