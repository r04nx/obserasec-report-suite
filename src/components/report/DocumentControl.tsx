import ReportPage from "./ReportPage";
import { documentControl } from "@/data/reportData";

const DocumentControl = () => {
  return (
    <ReportPage pageNum={2} sectionTitle="Document Control">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Document Control
      </h2>

      {/* Version History */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 mt-6">
        Version History
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Author</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {documentControl.versions.map((v) => (
            <tr key={v.version}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{v.version}</td>
              <td className="font-mono-ibm">{v.date}</td>
              <td>{v.author}</td>
              <td>{v.changes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Authors */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Authors
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr><th>Name</th><th>Role</th><th>Email</th></tr>
        </thead>
        <tbody>
          {documentControl.authors.map((a) => (
            <tr key={a.email}>
              <td className="font-semibold">{a.name}</td>
              <td>{a.role}</td>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{a.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reviewers */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Reviewers
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr><th>Name</th><th>Role</th><th>Email</th></tr>
        </thead>
        <tbody>
          {documentControl.reviewers.map((r) => (
            <tr key={r.email}>
              <td className="font-semibold">{r.name}</td>
              <td>{r.role}</td>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{r.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Distribution */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        Distribution List
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr><th>Name</th><th>Role</th></tr>
        </thead>
        <tbody>
          {documentControl.distribution.map((d) => (
            <tr key={d.name}>
              <td className="font-semibold">{d.name}</td>
              <td>{d.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Disclaimer */}
      <div className="mt-8 p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--obsera-surface))]">
        <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">
          Disclaimer & Confidentiality Notice
        </h3>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          This document is the confidential property of ObseraSEC and is intended solely for the use of the
          recipient(s) listed above. It contains proprietary information regarding security vulnerabilities
          identified during the assessment. Unauthorized disclosure, copying, or distribution of this
          document is strictly prohibited. The findings herein are based on the state of the systems at the
          time of assessment and may not reflect subsequent changes. ObseraSEC assumes no liability for
          damages arising from the use or misuse of this information.
        </p>
      </div>
    </ReportPage>
  );
};

export default DocumentControl;
