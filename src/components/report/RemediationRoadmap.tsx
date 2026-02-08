import ReportPage from "./ReportPage";
import { remediationRoadmap } from "@/data/reportData";

const effortColor: Record<string, string> = {
  Low: "bg-[hsl(142,71%,45%)] text-white",
  Medium: "bg-[hsl(45,93%,47%)] text-[#1a1a1a]",
  High: "bg-[hsl(25,95%,53%)] text-white",
};

const impactColor: Record<string, string> = {
  Critical: "text-[hsl(0,84%,60%)]",
  High: "text-[hsl(25,95%,53%)]",
  Medium: "text-[hsl(45,93%,47%)]",
  Low: "text-[hsl(142,71%,45%)]",
};

const RemediationRoadmap = () => (
  <>
    <ReportPage pageNum={42} sectionTitle="Remediation Roadmap">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Remediation Roadmap
      </h2>

      {/* Immediate */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        <span className="inline-block w-3 h-3 rounded-full bg-[hsl(0,84%,60%)] mr-2" />
        Immediate Actions (0-48 hours)
      </h3>
      <table className="report-table mb-6">
        <thead>
          <tr><th>Finding</th><th>Action</th><th>Effort</th><th>Impact</th><th>Deadline</th></tr>
        </thead>
        <tbody>
          {remediationRoadmap.immediate.map((r) => (
            <tr key={r.finding}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.finding}</td>
              <td className="text-[10px]">{r.action}</td>
              <td><span className={`${effortColor[r.effort]} px-2 py-0.5 rounded text-[8px] font-bold`}>{r.effort}</span></td>
              <td className={`font-bold text-[10px] ${impactColor[r.impact]}`}>{r.impact}</td>
              <td className="font-mono-ibm text-[10px]">{r.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Short Term */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        <span className="inline-block w-3 h-3 rounded-full bg-[hsl(25,95%,53%)] mr-2" />
        Short-Term (1-4 weeks)
      </h3>
      <table className="report-table mb-6">
        <thead>
          <tr><th>Finding</th><th>Action</th><th>Effort</th><th>Impact</th><th>Deadline</th></tr>
        </thead>
        <tbody>
          {remediationRoadmap.shortTerm.map((r) => (
            <tr key={r.finding}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.finding}</td>
              <td className="text-[10px]">{r.action}</td>
              <td><span className={`${effortColor[r.effort]} px-2 py-0.5 rounded text-[8px] font-bold`}>{r.effort}</span></td>
              <td className={`font-bold text-[10px] ${impactColor[r.impact]}`}>{r.impact}</td>
              <td className="font-mono-ibm text-[10px]">{r.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportPage>

    <ReportPage pageNum={43} sectionTitle="Remediation Roadmap">
      {/* Long Term */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        <span className="inline-block w-3 h-3 rounded-full bg-[hsl(45,93%,47%)] mr-2" />
        Long-Term (1-3 months)
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr><th>Finding</th><th>Action</th><th>Effort</th><th>Impact</th><th>Deadline</th></tr>
        </thead>
        <tbody>
          {remediationRoadmap.longTerm.map((r) => (
            <tr key={r.finding}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.finding}</td>
              <td className="text-[10px]">{r.action}</td>
              <td><span className={`${effortColor[r.effort]} px-2 py-0.5 rounded text-[8px] font-bold`}>{r.effort}</span></td>
              <td className={`font-bold text-[10px] ${impactColor[r.impact]}`}>{r.impact}</td>
              <td className="font-mono-ibm text-[10px]">{r.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Timeline visual */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-4 section-accent">
        Remediation Timeline
      </h3>
      <div className="relative pl-6">
        {[
          { phase: "Phase 1: Critical Fixes", time: "0-48 hours", color: "hsl(0,84%,60%)" },
          { phase: "Phase 2: High Priority", time: "1-4 weeks", color: "hsl(25,95%,53%)" },
          { phase: "Phase 3: Medium Priority", time: "1-2 months", color: "hsl(45,93%,47%)" },
          { phase: "Phase 4: Hardening", time: "2-3 months", color: "hsl(142,71%,45%)" },
          { phase: "Phase 5: Re-Assessment", time: "90 days", color: "hsl(190,100%,50%)" },
        ].map((p, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            <div className="absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2" style={{ borderColor: p.color, background: p.color }} />
            {i < 4 && <div className="absolute left-[-13px] top-4 w-[2px] h-full bg-[hsl(var(--border))]" />}
            <div className="ml-2">
              <div className="text-xs font-bold" style={{ color: p.color }}>{p.phase}</div>
              <div className="text-[10px] text-muted-foreground font-mono-ibm">{p.time}</div>
            </div>
          </div>
        ))}
      </div>
    </ReportPage>
  </>
);

export default RemediationRoadmap;
