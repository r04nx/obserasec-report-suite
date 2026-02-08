import ReportPage from "./ReportPage";
import { geoData } from "@/data/reportData";

const GeoThreatIntel = () => (
  <ReportPage pageNum={14} sectionTitle="Geographical Threat Intelligence">
    <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
      Geographical Threat Intelligence
    </h2>

    {/* Stats cards */}
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
        <div className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] font-mono-ibm">
          {geoData.totalBlocked.toLocaleString()}
        </div>
        <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Attacks Blocked</div>
      </div>
      <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
        <div className="text-2xl font-bold text-[hsl(var(--obsera-high))] font-mono-ibm">
          {geoData.uniqueIPs.toLocaleString()}
        </div>
        <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Unique IPs</div>
      </div>
      <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
        <div className="text-2xl font-bold text-[hsl(var(--obsera-critical))] font-mono-ibm">
          {geoData.c2Servers}
        </div>
        <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">C2 Servers</div>
      </div>
    </div>

    {/* World Map SVG */}
    <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
      Attack Origin Heatmap
    </h3>
    <div className="relative bg-[hsl(var(--obsera-surface))] rounded-lg border border-[hsl(var(--border))] p-4 mb-6">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {/* Simplified world map outline */}
        <rect width="800" height="400" fill="none" />
        {/* Grid */}
        {[...Array(9)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="hsl(216, 30%, 15%)" strokeWidth="0.5" />
        ))}
        {[...Array(17)].map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="hsl(216, 30%, 15%)" strokeWidth="0.5" />
        ))}
        
        {/* Continent outlines (simplified) */}
        {/* North America */}
        <path d="M100,80 L180,60 L220,90 L240,130 L200,180 L160,200 L130,180 L100,140 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />
        {/* South America */}
        <path d="M180,210 L220,200 L240,240 L250,300 L230,340 L200,360 L180,320 L170,260 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />
        {/* Europe */}
        <path d="M370,70 L420,60 L440,80 L430,110 L400,120 L380,110 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />
        {/* Africa */}
        <path d="M370,140 L430,130 L450,180 L440,260 L420,300 L380,290 L360,240 L360,180 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />
        {/* Asia */}
        <path d="M440,60 L580,50 L680,70 L700,120 L660,160 L600,170 L520,150 L480,130 L450,100 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />
        {/* Australia */}
        <path d="M620,280 L680,270 L720,290 L710,320 L660,330 L630,310 Z" 
          fill="hsl(216, 50%, 18%)" stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" opacity="0.6" />

        {/* Attack origin markers */}
        {geoData.attackOrigins.map((o, i) => {
          const x = ((o.lng + 180) / 360) * 800;
          const y = ((90 - o.lat) / 180) * 400;
          const r = Math.max(6, Math.min(20, o.attacks / 200));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="hsl(0, 84%, 60%)" opacity="0.3" />
              <circle cx={x} cy={y} r={r * 0.6} fill="hsl(0, 84%, 60%)" opacity="0.6" />
              <circle cx={x} cy={y} r={3} fill="hsl(0, 84%, 60%)" />
              <text x={x} y={y - r - 4} textAnchor="middle" fill="#fff" fontSize="8" fontFamily="IBM Plex Mono">
                {o.country}
              </text>
            </g>
          );
        })}

        {/* Target marker (India) */}
        <circle cx={520} cy={160} r={8} fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="2" />
        <circle cx={520} cy={160} r={3} fill="hsl(190, 100%, 50%)" />
        <text x={520} y={150} textAnchor="middle" fill="hsl(190, 100%, 50%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">
          TARGET
        </text>
      </svg>
    </div>

    {/* Attack Origins Table */}
    <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
      Top Attack Origins
    </h3>
    <table className="report-table">
      <thead>
        <tr>
          <th>Country</th>
          <th>Attacks Detected</th>
          <th>Percentage</th>
          <th>Threat Level</th>
        </tr>
      </thead>
      <tbody>
        {geoData.attackOrigins.map((o) => (
          <tr key={o.country}>
            <td className="font-semibold">{o.country}</td>
            <td className="font-mono-ibm">{o.attacks.toLocaleString()}</td>
            <td className="font-mono-ibm">{((o.attacks / geoData.totalBlocked) * 100).toFixed(1)}%</td>
            <td>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                o.attacks > 2000 ? "severity-critical" : o.attacks > 500 ? "severity-high" : "severity-medium"
              }`}>
                {o.attacks > 2000 ? "Critical" : o.attacks > 500 ? "High" : "Medium"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </ReportPage>
);

export default GeoThreatIntel;
