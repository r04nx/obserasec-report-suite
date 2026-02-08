import ReportPage from "./ReportPage";
import { networkAssets, subnets } from "@/data/reportData";

const riskColor: Record<string, string> = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
};

const NetworkArchitecture = () => (
  <>
    <ReportPage pageNum={12} sectionTitle="Network Architecture">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Network Architecture Overview
      </h2>

      {/* Header image */}
      <div className="w-full h-28 rounded-lg overflow-hidden mb-6 relative">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
          alt="Data Center"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/80 to-transparent" />
      </div>

      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
        The assessed network infrastructure spans five primary network segments across the headquarters 
        and one branch office. The architecture follows a traditional three-tier model with core, 
        distribution, and access layers, supplemented by a DMZ for public-facing services.
      </p>

      {/* Subnet Breakdown */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Subnet Breakdown
      </h3>
      <table className="report-table mb-6">
        <thead>
          <tr>
            <th>Subnet</th>
            <th>Name</th>
            <th>VLAN</th>
            <th>Hosts</th>
            <th>Gateway</th>
          </tr>
        </thead>
        <tbody>
          {subnets.map((s) => (
            <tr key={s.subnet}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{s.subnet}</td>
              <td>{s.name}</td>
              <td className="font-mono-ibm">{s.vlan}</td>
              <td className="font-mono-ibm text-center">{s.hosts}</td>
              <td className="font-mono-ibm">{s.gateway}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportPage>

    <ReportPage pageNum={13} sectionTitle="Network Architecture">
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        Asset Inventory
      </h3>
      <table className="report-table text-[9px]">
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Hostname</th>
            <th>OS / Platform</th>
            <th>Type</th>
            <th>Open Ports</th>
            <th>Vulns</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {networkAssets.map((a) => (
            <tr key={a.ip}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{a.ip}</td>
              <td className="font-mono-jb">{a.hostname}</td>
              <td>{a.os}</td>
              <td>{a.type}</td>
              <td className="font-mono-ibm text-[9px]">{a.ports}</td>
              <td className="text-center font-mono-ibm font-bold">{a.vulns}</td>
              <td>
                <span className={`${riskColor[a.risk]} px-2 py-0.5 rounded text-[8px] font-bold uppercase`}>
                  {a.risk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportPage>
  </>
);

export default NetworkArchitecture;
