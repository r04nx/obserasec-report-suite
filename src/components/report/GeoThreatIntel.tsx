import React from "react";
import ReportPage from "./ReportPage";
import EmptyState from "./EmptyState";
import { Globe } from "lucide-react";

const GeoThreatIntel = ({ data, meta }: { data: any; meta?: any }) => {
  if (!data) return null;
  const attackOrigins = (data.attackOrigins || []);
  const title = data?.title || "Geographical Threat Intelligence";
  const mapTitle = data?.mapTitle || "Attack Origin Heatmap";
  const originsTitle = data?.originsTitle || "Top Attack Origins";

  return (
    <ReportPage pageNum={14} sectionTitle={title} meta={meta}>
      <h2 className="text-2xl font-bold text-[hsl(193,82%,31%)] mb-6 section-accent">
        {title}
      </h2>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6 avoid-break">
        <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
          <div className="text-2xl font-bold text-[#44AC96] font-mono-ibm">
            {(data.totalBlocked || 0).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Attacks Blocked</div>
        </div>
        <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
          <div className="text-2xl font-bold text-[hsl(var(--obsera-high))] font-mono-ibm">
            {(data.uniqueIPs || 0).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">Unique IPs</div>
        </div>
        <div className="p-4 rounded-lg bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))] text-center">
          <div className="text-2xl font-bold text-[hsl(var(--obsera-critical))] font-mono-ibm">
            {data.c2Servers || 0}
          </div>
          <div className="text-[10px] font-mono-ibm uppercase tracking-wider text-muted-foreground">C2 Servers</div>
        </div>
      </div>

      {/* Minimal OSM Map Implementation */}
      <div className="avoid-break mt-6">
        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
          {mapTitle}
        </h3>

        {attackOrigins.length === 0 ? (
          <div className="mb-6"><EmptyState message="No geographic threat data available" icon={<Globe size={32} />} height="350px" /></div>
        ) : (
          <div className="relative bg-[hsl(var(--obsera-surface))] rounded-lg border border-[hsl(var(--border))] overflow-hidden mb-6 h-[400px]">
            {/* Map Tiles Container */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#f8f9fa]">
              <div className="relative w-[512px] h-[512px] opacity-40 grayscale contrast-[0.8] brightness-[1.1] scale-[1.5]">
                <div className="flex flex-wrap w-full h-full">
                  <img src="https://tile.openstreetmap.org/1/0/0.png" className="w-1/2 h-1/2" alt="" />
                  <img src="https://tile.openstreetmap.org/1/1/0.png" className="w-1/2 h-1/2" alt="" />
                  <img src="https://tile.openstreetmap.org/1/0/1.png" className="w-1/2 h-1/2" alt="" />
                  <img src="https://tile.openstreetmap.org/1/1/1.png" className="w-1/2 h-1/2" alt="" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-1 right-2 text-[6px] text-muted-foreground z-20">
              © OpenStreetMap contributors
            </div>

            {/* Markers Overlay */}
            <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {attackOrigins.map((o: any, i: number) => {
                const zoom = 1;
                const tileSize = 256;
                const scale = 1.5;
                const mapSize = Math.pow(2, zoom) * tileSize * scale;

                const latRad = (o.lat * Math.PI) / 180;
                const xBase = (o.lng + 180) / 360 * mapSize;
                const yBase = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * mapSize;

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

              {/* Target marker */}
              {(() => {
                const lat = 19.07;
                const lng = 72.87;
                const latRad = (lat * Math.PI) / 180;
                const zoom = 1;
                const tileSize = 256;
                const scale = 1.5;
                const mapSize = Math.pow(2, zoom) * tileSize * scale;
                const x = ((lng + 180) / 360 * mapSize) + (800 - mapSize) / 2;
                const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * mapSize) - (mapSize - 400) / 2;

                return (
                  <g>
                    <circle cx={x} cy={y} r={8} fill="none" stroke="#44AC96" strokeWidth="2" />
                    <circle cx={x} cy={y} r={3} fill="#44AC96" />
                    <text x={x} y={y + 15} textAnchor="middle" fill="#44AC96" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">
                      TARGET
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        )}
      </div>
    </ReportPage>
  );
};

export default GeoThreatIntel;
