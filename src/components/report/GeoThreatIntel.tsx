import React from "react";
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

    {/* Minimal OSM Map Implementation */}
    <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
      Attack Origin Heatmap
    </h3>
    <div className="relative bg-[hsl(var(--obsera-surface))] rounded-lg border border-[hsl(var(--border))] overflow-hidden mb-6 h-[400px]">
      {/* Map Tiles Container */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#f8f9fa]">
        <div className="relative w-[512px] h-[512px] opacity-40 grayscale contrast-[0.8] brightness-[1.1] scale-[1.5]">
          {/* Zoom 1 Tiles (2x2) */}
          <div className="flex flex-wrap w-full h-full">
            <img src="https://tile.openstreetmap.org/1/0/0.png" className="w-1/2 h-1/2" alt="" />
            <img src="https://tile.openstreetmap.org/1/1/0.png" className="w-1/2 h-1/2" alt="" />
            <img src="https://tile.openstreetmap.org/1/0/1.png" className="w-1/2 h-1/2" alt="" />
            <img src="https://tile.openstreetmap.org/1/1/1.png" className="w-1/2 h-1/2" alt="" />
          </div>
        </div>
      </div>

      {/* Overlay for Attribution */}
      <div className="absolute bottom-1 right-2 text-[6px] text-muted-foreground z-20">
        © OpenStreetMap contributors
      </div>

      {/* Markers Overlay */}
      <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {geoData.attackOrigins.map((o, i) => {
          // Simple Mercator Projection for Zoom 1 scaled to 800x400
          // The map above is 512x512 scaled by 1.5 = 768x768. 
          // We want to center it in 800x400.

          const zoom = 1;
          const tileSize = 256;
          const scale = 1.5;
          const mapSize = Math.pow(2, zoom) * tileSize * scale; // 768

          const lonRad = (o.lng * Math.PI) / 180;
          const latRad = (o.lat * Math.PI) / 180;

          const xBase = (o.lng + 180) / 360 * Math.pow(2, zoom) * tileSize * scale;
          const yBase = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom) * tileSize * scale;

          // Adjust to center in 800x400
          const x = xBase + (800 - mapSize) / 2;
          const y = yBase - (mapSize - 400) / 2;

          const r = Math.max(6, Math.min(20, o.attacks / 200));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="hsl(0, 84%, 60%)" opacity="0.3" />
              <circle cx={x} cy={y} r={r * 0.6} fill="hsl(0, 84%, 60%)" opacity="0.6" />
              <circle cx={x} cy={y} r={3} fill="hsl(0, 84%, 60%)" />
              <text x={x} y={y - r - 4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontFamily="IBM Plex Mono" className="font-bold">
                {o.country}
              </text>
            </g>
          );
        })}

        {/* Target marker (Mumbai, India approx: 19.07, 72.87) */}
        {(() => {
          const lat = 19.07;
          const lng = 72.87;
          const latRad = (lat * Math.PI) / 180;
          const scale = 1.5;
          const mapSize = 768;
          const x = ((lng + 180) / 360 * mapSize) + (800 - mapSize) / 2;
          const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * mapSize) - (mapSize - 400) / 2;

          return (
            <g>
              <circle cx={x} cy={y} r={8} fill="none" stroke="hsl(190, 100%, 50%)" strokeWidth="2" />
              <circle cx={x} cy={y} r={3} fill="hsl(190, 100%, 50%)" />
              <text x={x} y={y + 15} textAnchor="middle" fill="hsl(190, 100%, 50%)" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">
                TARGET
              </text>
            </g>
          );
        })()}
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
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${o.attacks > 2000 ? "severity-critical" : o.attacks > 500 ? "severity-high" : "severity-medium"
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
