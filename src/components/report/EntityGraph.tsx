import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ReportPage from './ReportPage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Entity {
  id: string;
  name: string;
  type: 'user' | 'system' | 'vulnerability' | 'threat' | 'control' | 'data';
  risk: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  metadata?: Record<string, any>;
}

interface Connection {
  source: string;
  target: string;
  type: 'access' | 'exploit' | 'protects' | 'contains' | 'communicates' | 'relates';
  strength: number; // 1-10
  description?: string;
  bidirectional?: boolean;
}

interface EntityGraphProps {
  data: any;
  meta?: any;
}

const EntityGraph = ({ data, meta }: EntityGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 350 });

  const {
    title = "Entity Relationship Graph",
    subtitle = "Visual mapping of critical vulnerabilities and their potential lateral movement paths",
    entities = [],
    connections = [],
    showLabels = true,
  } = data || {};

  // Color Palette
  const colors = {
    background: '#ffffff',
    entity: {
      user: '#3b82f6', // blue-500
      system: '#64748b', // slate-500
      vulnerability: '#ef4444', // red-500
      threat: '#f97316', // orange-500
      control: '#22c55e', // green-500
      data: '#a855f7' // purple-500
    },
    risk: {
      critical: '#be123c', // rose-700
      high: '#c2410c', // orange-700
      medium: '#b45309', // amber-700
      low: '#15803d' // green-700
    },
    label: '#0f172a',
    textSecondary: '#64748b'
  };

  const finalEntities = entities.length > 0 ? entities : [];
  const finalConnections = connections.length > 0 ? connections : [];

  const graphData = {
    nodes: finalEntities.map((e: Entity) => ({ ...e, val: e.risk === 'critical' ? 8 : 4 })),
    links: finalConnections.map((c: Connection) => ({ ...c }))
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 400
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 400
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ReportPage pageNum={46} sectionTitle={title} meta={meta}>
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-critical))] mb-2 section-accent">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Graph Area */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          GRAPH VISUALIZATION
        </span>
      </div>

      <div
        ref={containerRef}
        className="force-graph-container w-full mb-8 border border-slate-100 rounded-lg bg-slate-50/30 overflow-hidden"
        style={{ height: '400px' }}
      >
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeAutoColorBy="type"
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 11 / globalScale;
            ctx.font = `${fontSize}px "Inter", "Arial", sans-serif`;

            // Draw circle (dot)
            const radius = (node.risk === 'critical' ? 6 : node.risk === 'high' ? 4.5 : 3.5) / globalScale;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            const nodeColor = colors.risk[node.risk as keyof typeof colors.risk] || colors.entity[node.type as keyof typeof colors.entity];
            ctx.fillStyle = nodeColor;
            ctx.fill();

            // Add subtle glow for critical items
            if (node.risk === 'critical') {
              ctx.shadowColor = nodeColor;
              ctx.shadowBlur = 10 / globalScale;
            } else {
              ctx.shadowBlur = 0;
            }

            // Draw label
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = colors.label;
            ctx.fillText(label, node.x, node.y + radius + 2 / globalScale);

            // Reset shadow
            ctx.shadowBlur = 0;

            node.__radius = radius;
          }}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.__radius || 5, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
          linkColor={() => 'rgba(203, 213, 225, 0.4)'}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={d => (d as any).strength * 0.001}
          cooldownTicks={100}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 pb-6 border-b border-slate-100">
        {Object.entries(colors.entity).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{type}</span>
          </div>
        ))}
      </div>

      {/* Details Table */}
      <div className="mt-4">
        <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">
          ENTITY DETAILS
        </h4>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-200">
                <TableHead className="h-8 text-[11px] font-bold text-slate-700">Entity</TableHead>
                <TableHead className="h-8 text-[11px] font-bold text-slate-700">Type</TableHead>
                <TableHead className="h-8 text-[11px] font-bold text-slate-700">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalEntities.map((entity: Entity) => (
                <TableRow key={entity.id} className="h-9 border-b border-slate-100 last:border-0">
                  <TableCell className="py-1 text-[11px] font-medium text-slate-900">{entity.name}</TableCell>
                  <TableCell className="py-1 text-[11px] capitalize text-slate-600">{entity.type}</TableCell>
                  <TableCell className="py-1 text-[11px]">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold tracking-tight
                        ${entity.risk === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' :
                        entity.risk === 'high' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          entity.risk === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                      {entity.risk.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ReportPage>
  );
};

export default EntityGraph;
