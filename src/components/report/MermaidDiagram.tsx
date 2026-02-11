import React, { useEffect, useRef } from 'react';
import ReportPage from "./ReportPage";
import mermaid from 'mermaid';
import EmptyState from "./EmptyState";
import { Table } from "lucide-react";

interface MermaidDiagramProps {
  data: any;
  meta?: any;
}

// Custom Mermaid component that works in both browser and Node.js (SSR)
const Mermaid = ({ chart, config }: { chart: string; config: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isBrowser = typeof window !== 'undefined';
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (isBrowser && containerRef.current && chart) {
      setError(null);
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            fontFamily: '"IBM Plex Mono", "JetBrains Mono", "Arial", monospace',
            fontSize: '11px',
            primaryColor: '#f1f5f9',
            primaryTextColor: '#0f172a',
            primaryBorderColor: '#94a3b8',
            lineColor: '#64748b',
            secondaryColor: '#f8fafc',
            tertiaryColor: '#ffffff',
            mainBkg: '#f8fafc',
            nodeBorder: '#94a3b8',
            clusterBkg: '#f1f5f9',
            clusterBorder: '#cbd5e1',
            defaultLinkColor: '#64748b',
            titleColor: '#0f172a',
            edgeLabelBackground: '#ffffff',
            ...config?.themeVariables
          },
          ...config
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        mermaid.render(id, chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        }).catch(err => {
          console.error("Mermaid render error:", err);
          setError("Failed to render diagram. Check Mermaid syntax.");
        });
      } catch (err) {
        console.error('Mermaid initialization or render failed:', err);
        setError("Failed to render diagram");
      }
    }
  }, [chart, config, isBrowser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border border-dashed border-red-200 bg-red-50 rounded-lg">
        <span className="text-sm font-bold text-red-500 mb-2">Diagram Error</span>
        <span className="text-xs text-center">{error}</span>
      </div>
    )
  }

  return (
    <div
      className="mermaid w-full flex justify-center"
      ref={containerRef}
      style={{ minHeight: '100px' }}
    />
  );
};

const MermaidDiagram = ({ data, meta }: MermaidDiagramProps) => {
  if (!data) return null;
  const {
    title = "System Architecture Diagram",
    subtitle = "Interactive system visualization",
    diagramCode,
    config = {}
  } = data || {};

  if (!diagramCode) return null;

  return (
    <ReportPage pageNum={45} sectionTitle={title} meta={meta}>
      <div className="avoid-break">
        <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-2 section-accent">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Mermaid Diagram Container */}
        <div className="w-full mb-8 flex justify-center bg-[hsl(var(--obsera-surface))] rounded-lg border border-[hsl(var(--border))] p-6 min-h-[400px]">
          <div className="w-full h-full flex items-center justify-center">
            <Mermaid chart={diagramCode} config={config} />
          </div>
        </div>

        {/* Legend removed for cleaner dynamic look, or could be made dynamic */}
      </div>
    </ReportPage>
  );
};


export default MermaidDiagram;
