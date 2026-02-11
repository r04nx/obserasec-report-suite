import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Network, Server } from "lucide-react";

const riskColor: Record<string, string> = {
  Critical: "severity-critical",
  High: "severity-high",
  Medium: "severity-medium",
  Low: "severity-low",
};

const NetworkArchitecture = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;
  const assetsList = (data.assets || []);
  const subnetsList = (data.subnets || []);
  const title = data?.title || "Network Architecture Overview";
  const subnetsTitle = data?.subnetsTitle || "Subnet Breakdown";
  const assetsTitle = data?.assetsTitle || "Asset Inventory";

  return (
    <>
      <ReportPage pageNum={11} sectionTitle={title} meta={meta}>
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
          {title}
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
          {data.description}
        </p>

        {/* Subnet Breakdown */}
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          {subnetsTitle}
        </h3>

        {subnetsList.length === 0 ? (
          <div className="mb-6"><EmptyState message="No subnet data available" icon={<Network size={24} />} height="180px" /></div>
        ) : (
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
              {subnetsList.map((s: any) => (
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
        )}
      </ReportPage>

      {assetsList.length === 0 ? (
        <ReportPage pageNum={13} sectionTitle={title} meta={meta}>
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
            {assetsTitle}
          </h3>
          <EmptyState message="No asset inventory provided" icon={<Server size={24} />} height="300px" />
        </ReportPage>
      ) : (
        (() => {
          const CHUNK_SIZE = 30;
          const chunks = [];
          for (let i = 0; i < assetsList.length; i += CHUNK_SIZE) {
            chunks.push(assetsList.slice(i, i + CHUNK_SIZE));
          }
          return chunks.map((chunk, idx) => (
            <ReportPage key={`assets-${idx}`} pageNum={13 + idx} sectionTitle={idx === 0 ? title : `${title} (Cont.)`} meta={meta} showFooter={idx === 0}>
              {idx === 0 && (
                <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
                  {assetsTitle}
                </h3>
              )}
              <div className={idx > 0 ? "pt-2" : ""}>
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
                    {chunk.map((a: any) => (
                      <tr key={a.ip}>
                        <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{a.ip}</td>
                        <td className="font-mono-jb">{a.hostname}</td>
                        <td>{a.os}</td>
                        <td>{a.type}</td>
                        <td className="font-mono-ibm text-[9px]">{a.ports}</td>
                        <td className="text-center font-mono-ibm font-bold">{a.vulns}</td>
                        <td>
                          <span className={`${riskColor[a.risk] || 'bg-gray-500'} px-2 py-0.5 rounded text-[8px] font-bold uppercase text-white`}>
                            {a.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportPage>
          ));
        })()
      )}
    </>
  );
};

export default NetworkArchitecture;
