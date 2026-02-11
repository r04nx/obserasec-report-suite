import React from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import path from 'path';
import fs from 'fs';

import './setup';

// Import all report components
import CoverPage from "../components/report/CoverPage";
import DocumentControl from "../components/report/DocumentControl";
import TableOfContents from "../components/report/TableOfContents";
import ExecutiveSummary from "../components/report/ExecutiveSummary";
import ScopeMethodology from "../components/report/ScopeMethodology";
import RiskDashboard from "../components/report/RiskDashboard";
import NetworkArchitecture from "../components/report/NetworkArchitecture";
import GeoThreatIntel from "../components/report/GeoThreatIntel";
import DetailedFindings from "../components/report/DetailedFindings";
import VulnTrending from "../components/report/VulnTrending";
import ComplianceMapping from "../components/report/ComplianceMapping";
import HostSummary from "../components/report/HostSummary";
import MermaidDiagram from "../components/report/MermaidDiagram";
import EntityGraph from "../components/report/EntityGraph";
import RemediationRoadmap from "../components/report/RemediationRoadmap";
import Appendices from "../components/report/Appendices";
import ComplianceDPDP from "../components/report/templates/ComplianceDPDP";
import ComplianceCERTIn from "../components/report/templates/ComplianceCERTIn";
import ComplianceBFSI from "../components/report/templates/ComplianceBFSI";
import BackCover from "../components/report/BackCover";

// Component configuration interface
interface ComponentConfig {
  name: string;
  enabled: boolean;
  order: number;
  data?: any;
  customProps?: any;
}

interface ReportConfig {
  meta: {
    client: string;
    date: string;
    assessmentId: string;
    reportTitle?: string;
    subtitle?: string;
    version?: string;
    classification?: string;
  };
  components: ComponentConfig[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  output: {
    filename?: string;
    format?: 'html' | 'pdf';
    includeStyles?: boolean;
  };
}

// Default configuration
const defaultConfig: ReportConfig = {
  meta: {
    client: "Acme Corporation Ltd.",
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    assessmentId: "OSEC-2026-0142",
    reportTitle: "Security Assessment Report",
    subtitle: "Infrastructure & Compliance",
    version: "1.0",
    classification: "CONFIDENTIAL"
  },
  components: [
    { name: "CoverPage", enabled: true, order: 1 },
    { name: "DocumentControl", enabled: true, order: 2 },
    { name: "TableOfContents", enabled: true, order: 3 },
    { name: "ExecutiveSummary", enabled: true, order: 4 },
    { name: "ScopeMethodology", enabled: true, order: 5 },
    { name: "RiskDashboard", enabled: true, order: 6 },
    { name: "NetworkArchitecture", enabled: true, order: 7 },
    { name: "GeoThreatIntel", enabled: true, order: 8 },
    { name: "DetailedFindings", enabled: true, order: 9 },
    { name: "VulnTrending", enabled: true, order: 10 },
    { name: "ComplianceMapping", enabled: true, order: 11 },
    { name: "HostSummary", enabled: true, order: 12 },
    { name: "MermaidDiagram", enabled: true, order: 13 },
    { name: "EntityGraph", enabled: true, order: 14 },
    { name: "RemediationRoadmap", enabled: true, order: 15 },
    { name: "Appendices", enabled: true, order: 16 },
    { name: "ComplianceDPDP", enabled: false, order: 17 },
    { name: "ComplianceCERTIn", enabled: false, order: 18 },
    { name: "ComplianceBFSI", enabled: false, order: 19 },
    { name: "BackCover", enabled: true, order: 20 }
  ],
  theme: {
    primaryColor: "#44AC96",
    secondaryColor: "#0A1628",
    fontFamily: "IBM Plex Sans"
  },
  output: {
    filename: "comprehensive_security_report.html",
    format: "html",
    includeStyles: true
  }
};

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  CoverPage,
  DocumentControl,
  TableOfContents,
  ExecutiveSummary,
  ScopeMethodology,
  RiskDashboard,
  NetworkArchitecture,
  GeoThreatIntel,
  DetailedFindings,
  VulnTrending,
  ComplianceMapping,
  HostSummary,
  MermaidDiagram,
  EntityGraph,
  RemediationRoadmap,
  Appendices,
  ComplianceDPDP,
  ComplianceCERTIn,
  ComplianceBFSI,
  BackCover
};

// Sample data for demonstration
const sampleData = {
  tableOfContents: {
    sections: [
      { num: "1", title: "Executive Summary", page: 4 },
      { num: "1.1", title: "Key Metrics Overview", page: 4 },
      { num: "1.2", title: "Risk Assessment Score", page: 5 },
      { num: "1.3", title: "Executive Risk Statement", page: 6 },
      { num: "2", title: "Scope & Methodology", page: 7 },
      { num: "2.1", title: "Assessment Scope", page: 7 },
      { num: "2.2", title: "Methodology", page: 8 },
      { num: "2.3", title: "Tools & Timeline", page: 8 },
      { num: "3", title: "Risk Summary Dashboard", page: 9 },
      { num: "3.1", title: "Vulnerability Distribution", page: 9 },
      { num: "3.2", title: "Risk Trend Analysis", page: 10 },
      { num: "3.3", title: "Risk Matrix", page: 11 },
      { num: "4", title: "Network Architecture Overview", page: 12 },
      { num: "4.1", title: "Asset Inventory", page: 12 },
      { num: "4.2", title: "Subnet Breakdown", page: 13 },
      { num: "5", title: "Geographical Threat Intelligence", page: 14 },
      { num: "6", title: "Detailed Findings", page: 16 },
      { num: "6.1", title: "Critical Findings", page: 16 },
      { num: "6.2", title: "High Findings", page: 20 },
      { num: "6.3", title: "Medium Findings", page: 26 },
      { num: "6.4", title: "Low Findings", page: 30 },
      { num: "7", title: "Vulnerability Trending & Analytics", page: 33 },
      { num: "8", title: "Compliance Mapping", page: 36 },
      { num: "9", title: "Host-Level Summary", page: 38 },
      { num: "10", title: "System Architecture Diagrams", page: 45 },
      { num: "11", title: "Entity Relationship Analysis", page: 46 },
      { num: "12", title: "Remediation Roadmap", page: 42 },
      { num: "13", title: "Appendices", page: 44 },
      { num: "13.1", title: "Port Scan Results", page: 44 },
      { num: "13.2", title: "Glossary", page: 46 },
      { num: "13.3", title: "CVSS Methodology", page: 47 }
    ]
  },
  executiveSummary: {
    title: "Executive Summary",
    description: "This report provides a comprehensive analysis of the security posture of the assessed infrastructure.",
    critical: 5,
    high: 12,
    medium: 28,
    low: 45,
    informational: 67,
    totalVulnerabilities: 157,
    overallRiskScore: 7.2,
    systemsTested: 234,
    systemsCompromised: 3,
    riskStatement: "The assessment revealed critical vulnerabilities in the web application layer that require immediate attention. Multiple high-severity Findings indicate inadequate security controls in the authentication and authorization mechanisms.",
    recommendationText: "Immediate remediation of critical Findings is required within 48 hours. A comprehensive security hardening program should be implemented within 30 days."
  },
  riskDashboard: {
    title: "Risk Summary Dashboard",
    category: [
      { category: "Web Applications", count: 45 },
      { category: "Network Services", count: 32 },
      { category: "Operating Systems", count: 28 },
      { category: "Databases", count: 18 },
      { category: "Cloud Services", count: 34 }
    ],
    trend: [
      { month: "Jan", score: 6.5 },
      { month: "Feb", score: 7.1 },
      { month: "Mar", score: 6.8 },
      { month: "Apr", score: 7.2 },
      { month: "May", score: 7.5 },
      { month: "Jun", score: 7.2 }
    ],
    hosts: [
      { host: "192.168.1.0/24", critical: 2, high: 5, medium: 8, low: 12 },
      { host: "10.0.0.0/16", critical: 1, high: 3, medium: 6, low: 9 },
      { host: "172.16.0.0/12", critical: 2, high: 4, medium: 14, low: 24 }
    ]
  },
  mermaidDiagram: {
    title: "Network Security Architecture",
    subtitle: "Comprehensive security infrastructure visualization",
    diagramCode: `graph TB
    subgraph "Internet"
        I[Internet]
    end
    
    subgraph "DMZ"
        FW[Firewall]
        LB[Load Balancer]
        WAF[Web Application Firewall]
    end
    
    subgraph "Application Layer"
        APP1[Application Server 1]
        APP2[Application Server 2]
        APP3[Application Server 3]
    end
    
    subgraph "Data Layer"
        DB1[(Primary Database)]
        DB2[(Replica Database)]
        CACHE[Redis Cache]
    end
    
    subgraph "Security Monitoring"
        SIEM[SIEM System]
        IDS[Intrusion Detection]
        LOG[Log Management]
    end
    
    I --> FW
    FW --> WAF
    WAF --> LB
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> DB1
    APP2 --> DB1
    APP3 --> DB1
    DB1 --> DB2
    
    APP1 --> CACHE
    APP2 --> CACHE
    APP3 --> CACHE
    
    FW -.-> SIEM
    WAF -.-> IDS
    APP1 -.-> LOG
    APP2 -.-> LOG
    APP3 -.-> LOG
    
    IDS --> SIEM
    LOG --> SIEM`,
    type: "graph",
    theme: "default",
    config: {
      themeVariables: {
        primaryColor: '#44AC96',
        primaryTextColor: '#0A1628',
        primaryBorderColor: '#0A1628',
        lineColor: '#44AC96'
      }
    }
  },
  entityGraph: {
    title: "Entity Relationship Analysis",
    subtitle: "Detailed correlation between security entities and threats",
    entities: [
      { id: 'admin', name: 'Admin User', type: 'user', risk: 'critical', description: 'System administrator with elevated privileges' },
      { id: 'webserver', name: 'Web Server', type: 'system', risk: 'high', description: 'Apache web server hosting applications' },
      { id: 'database', name: 'Database', type: 'system', risk: 'critical', description: 'MySQL database with sensitive data' },
      { id: 'sqli', name: 'SQL Injection', type: 'vulnerability', risk: 'critical', description: 'Critical SQL injection vulnerability' },
      { id: 'apt', name: 'APT Group', type: 'threat', risk: 'high', description: 'Advanced persistent threat group' },
      { id: 'waf', name: 'WAF', type: 'control', risk: 'medium', description: 'Web application firewall' },
      { id: 'sensitivedata', name: 'PII Data', type: 'data', risk: 'critical', description: 'Personally identifiable information' }
    ],
    connections: [
      { source: 'admin', target: 'webserver', type: 'access', strength: 9, description: 'has access' },
      { source: 'webserver', target: 'database', type: 'communicates', strength: 10, description: 'queries' },
      { source: 'sqli', target: 'webserver', type: 'exploit', strength: 10, description: 'exploits' },
      { source: 'apt', target: 'sqli', type: 'exploit', strength: 8, description: 'uses' },
      { source: 'waf', target: 'webserver', type: 'protects', strength: 7, description: 'protects' },
      { source: 'database', target: 'sensitivedata', type: 'contains', strength: 10, description: 'stores' },
      { source: 'admin', target: 'database', type: 'access', strength: 8, description: 'manages' },
      { source: 'apt', target: 'webserver', type: 'access', strength: 6, description: 'targets' }
    ],
    layout: 'force',
    showLabels: true,
    showMetadata: true,
    theme: 'red'
  }
};

const generateReport = async (config: ReportConfig = defaultConfig, customData: any = {}) => {
  console.log("🚀 Starting comprehensive report generation...");

  try {
    // Sort components by order
    const sortedComponents = config.components
      .filter(comp => comp.enabled)
      .sort((a, b) => a.order - b.order);

    // Generate dynamic Table of Contents
    const generateTableOfContents = () => {
      const tocSections: any[] = [];
      let currentPage = 4; // Start after Cover (1), Document Control (2), TOC (3)

      const componentPageMap: Record<string, number> = {};
      const componentSubsections: Record<string, any[]> = {};
      const componentTitles: Record<string, string> = {};

      // Calculate page numbers dynamically based on component order
      sortedComponents.forEach((comp) => {
        if (comp.name === "CoverPage") {
          componentPageMap[comp.name] = 1;
        } else if (comp.name === "DocumentControl") {
          componentPageMap[comp.name] = 2;
        } else if (comp.name === "TableOfContents") {
          componentPageMap[comp.name] = 3;
        } else {
          componentPageMap[comp.name] = currentPage;
          // Estimate pages for each component
          if (comp.name === "ExecutiveSummary") {
            currentPage += 3; // Executive Summary spans 3 pages
          } else if (comp.name === "ScopeMethodology") {
            currentPage += 2; // Scope & Methodology spans 2 pages
          } else if (comp.name === "RiskDashboard") {
            currentPage += 3; // Risk Dashboard spans 3 pages
          } else if (comp.name === "NetworkArchitecture") {
            currentPage += 2; // Network Architecture spans 2 pages
          } else if (comp.name === "GeoThreatIntel") {
            currentPage += 1; // Geo Threat Intel spans 1 page
          } else if (comp.name === "DetailedFindings") {
            currentPage += 15; // Detailed Findings spans many pages
          } else if (comp.name === "VulnTrending") {
            currentPage += 2; // Vuln Trending spans 2 pages
          } else if (comp.name === "ComplianceMapping") {
            currentPage += 1; // Compliance Mapping spans 1 page
          } else if (comp.name === "HostSummary") {
            currentPage += 2; // Host Summary spans 2 pages
          } else if (comp.name === "MermaidDiagram") {
            currentPage += 1; // Mermaid Diagram spans 1 page
          } else if (comp.name === "EntityGraph") {
            currentPage += 1; // Entity Graph spans 1 page
          } else if (comp.name === "RemediationRoadmap") {
            currentPage += 2; // Remediation Roadmap spans 2 pages
          } else if (comp.name === "Appendices") {
            currentPage += 3; // Appendices spans 3 pages
          } else {
            currentPage += 1; // Default 1 page
          }
        }
      });

      // Define subsections and titles
      componentSubsections["ExecutiveSummary"] = [
        { num: "1.1", title: "Key Metrics Overview" },
        { num: "1.2", title: "Risk Assessment Score" },
        { num: "1.3", title: "Executive Risk Statement" }
      ];

      componentSubsections["ScopeMethodology"] = [
        { num: "2.1", title: "Assessment Scope" },
        { num: "2.2", title: "Methodology" },
        { num: "2.3", title: "Tools & Timeline" }
      ];

      componentSubsections["RiskDashboard"] = [
        { num: "3.1", title: "Vulnerability Distribution" },
        { num: "3.2", title: "Risk Trend Analysis" },
        { num: "3.3", title: "Risk Matrix" }
      ];

      componentSubsections["NetworkArchitecture"] = [
        { num: "4.1", title: "Asset Inventory" },
        { num: "4.2", title: "Subnet Breakdown" }
      ];

      componentSubsections["DetailedFindings"] = [
        { num: "6.1", title: "Critical Findings" },
        { num: "6.2", title: "High Findings" },
        { num: "6.3", title: "Medium Findings" },
        { num: "6.4", title: "Low Findings" }
      ];

      componentSubsections["Appendices"] = [
        { num: "13.1", title: "Port Scan Results" },
        { num: "13.2", title: "Glossary" },
        { num: "13.3", title: "CVSS Methodology" }
      ];

      componentTitles["ExecutiveSummary"] = "Executive Summary";
      componentTitles["ScopeMethodology"] = "Scope & Methodology";
      componentTitles["RiskDashboard"] = "Risk Summary Dashboard";
      componentTitles["NetworkArchitecture"] = "Network Architecture Overview";
      componentTitles["GeoThreatIntel"] = "Geographical Threat Intelligence";
      componentTitles["DetailedFindings"] = "Detailed Findings";
      componentTitles["VulnTrending"] = "Vulnerability Trending & Analytics";
      componentTitles["ComplianceMapping"] = "Compliance Mapping";
      componentTitles["HostSummary"] = "Host-Level Summary";
      componentTitles["MermaidDiagram"] = "System Architecture Diagrams";
      componentTitles["EntityGraph"] = "Entity Relationship Analysis";
      componentTitles["RemediationRoadmap"] = "Remediation Roadmap";
      componentTitles["Appendices"] = "Appendices";

      let sectionNum = 1;
      sortedComponents.forEach((comp) => {
        // Skip components that don't appear in TOC
        if (comp.name === "CoverPage" || comp.name === "DocumentControl" || comp.name === "TableOfContents" || comp.name === "BackCover") {
          return;
        }

        const title = componentTitles[comp.name] || comp.name;
        const page = componentPageMap[comp.name];

        // Add main section
        tocSections.push({
          num: sectionNum.toString(),
          title: title,
          page: page
        });

        // Add subsections if they exist
        const subsections = componentSubsections[comp.name];
        if (subsections) {
          subsections.forEach((sub, index) => {
            tocSections.push({
              ...sub,
              num: `${sectionNum}.${sub.num.split('.')[1]}`,
              page: page + index + 1 // Subsections on subsequent pages
            });
          });
        }

        sectionNum++;
      });

      return tocSections;
    };

    // Generate TOC data
    const tocData = {
      sections: generateTableOfContents()
    };

    let html = "";
    let pageNum = 1;

    // Generate HTML for each component
    for (const componentConfig of sortedComponents) {
      const Component = componentMap[componentConfig.name];
      if (!Component) {
        console.warn(`⚠️ Component ${componentConfig.name} not found, skipping...`);
        continue;
      }

      console.log(`📊 Rendering ${componentConfig.name}...`);

      // Merge custom data with sample data
      const dataKey = componentConfig.name.charAt(0).toLowerCase() + componentConfig.name.slice(1);

      let dynamicData = {};
      if (componentConfig.name === "TableOfContents") {
        dynamicData = tocData;
      }

      let componentData: any = {
        // Fix: Removed sampleData merging to prevent leakage
        ...customData[dataKey],
        ...customData[componentConfig.name.toLowerCase()],
        ...componentConfig.data,
        ...dynamicData
      };

      if (componentConfig.name === "TableOfContents") {
        componentData = tocData.sections;
      }

      const componentHtml = renderToString(
        React.createElement(Component, {
          data: componentData,
          meta: config.meta,
          pageNum: pageNum++,
          ...componentConfig.customProps
        })
      );

      html += componentHtml;
    }

    // Read CSS from dist directory
    const rootDir = process.cwd();
    const distAssetsDir = path.join(rootDir, 'dist/assets');
    let cssContent = "";

    if (fs.existsSync(distAssetsDir)) {
      const files = fs.readdirSync(distAssetsDir);
      const cssFiles = files.filter(file => file.endsWith('.css'));
      cssFiles.forEach(cssFile => {
        const cssPath = path.join(distAssetsDir, cssFile);
        cssContent += fs.readFileSync(cssPath, 'utf-8');
      });
    }

    // Helper to convert Hex to HSL for CSS variables
    const hexToHSL = (hex: string): string => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
      } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
      }
      r /= 255;
      g /= 255;
      b /= 255;

      const cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin;
      let h = 0, s = 0, l = 0;

      if (delta === 0) h = 0;
      else if (cmax === r) h = ((g - b) / delta) % 6;
      else if (cmax === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);
      if (h < 0) h += 360;

      l = (cmax + cmin) / 2;
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return `${h} ${s}% ${l}%`;
    };

    const primaryHSL = hexToHSL(config.theme?.primaryColor || '#44AC96');
    const secondaryHSL = hexToHSL(config.theme?.secondaryColor || '#0A1628');

    // Generate complete HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.meta.reportTitle || 'Security Assessment Report'}</title>
    <meta name="classification" content="${config.meta.classification || 'CONFIDENTIAL'}">
    
    ${config.output.includeStyles ? `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@400;600&display=swap" rel="stylesheet">
    <style>
        /* Embed CSS directly */
        ${cssContent}
        
        /* Custom theme colors - Override Tailwind variables with HSL values */
        :root {
            --obsera-cyan: ${primaryHSL};
            --obsera-navy: ${secondaryHSL};
            --obsera-critical: 0 84% 60%;
            --obsera-high: 25 95% 53%;
            --obsera-medium: 45 93% 47%;
            --obsera-low: 142 71% 40%;
            --obsera-surface: 210 40% 98%; /* approximated #f8fafc */
            --obsera-navy-deep: 222 47% 11%; /* approximated #0A1628 */
        }

        /* Print and Report specific overrides */
        @media print {
            @page { 
                size: A4; 
                margin: 0; 
                @top-center {
                    content: "${config.meta.classification || 'CONFIDENTIAL'}";
                    font-size: 8pt;
                    color: #666;
                }
                @bottom-center {
                    content: "${config.meta.reportTitle} - Page " counter(page);
                    font-size: 8pt;
                    color: #666;
                }
            }
        }
        
        @media print {
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                font-size: 9pt;
            }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            .avoid-break { page-break-inside: avoid; }
        }
        
        body { 
            background-color: #525659; /* PDF viewer background color */
            margin: 0; 
            padding: 20px 0; 
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: "${config.theme?.fontFamily || 'IBM Plex Sans'}", sans-serif;
            line-height: 1.4;
            color: #333;
        }

        /* Simulate A4 page in browser */
        .page-break, .raw-cover-page, .raw-back-page { 
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            margin-bottom: 20px;
            min-height: 297mm; /* Allow content to grow beyond A4 height if needed */
            height: auto;
        }
        
        .page-break { page-break-after: always; }
        .avoid-break { page-break-inside: avoid; }
        
        /* Hide the shadow for print */
        @media print {
            body { background-color: white; padding: 0; display: block; }
            .page-break, .raw-cover-page, .raw-back-page { box-shadow: none; margin: 0; min-height: 0; height: auto; }
            
            /* Force background colors and graphics */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>` : ''}
</head>
<body>
    <div id="root">${html}</div>
    
    ${config.output.includeStyles ? `
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script src="//unpkg.com/force-graph"></script>
    <script>
        // Initialize Mermaid
        document.addEventListener('DOMContentLoaded', function() {
            if (window.mermaid) {
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'default',
                    themeVariables: {
                        primaryColor: '${config.theme?.primaryColor || '#44AC96'}',
                        primaryTextColor: '${config.theme?.secondaryColor || '#0A1628'}',
                        primaryBorderColor: '${config.theme?.secondaryColor || '#0A1628'}',
                        lineColor: '${config.theme?.primaryColor || '#44AC96'}'
                    }
                });
            }

            // Initialize Force Graphs
            document.querySelectorAll('.force-graph-container').forEach(container => {
                try {
                    const data = JSON.parse(container.dataset.graphData);
                    const width = container.clientWidth || 800;
                    const height = 400;
                    
                    ForceGraph()
                        (container)
                        .width(width)
                        .height(height)
                        .graphData(data)
                        .nodeLabel('name')
                        .nodeColor(node => node.color || '#ccc')
                        .nodeVal('val')
                        .linkDirectionalArrowLength(4)
                        .linkDirectionalArrowRelPos(1);
                } catch (e) {
                    console.error("Failed to init force graph", e);
                }
            });
        });
    </script>` : ''}
</body>
</html>`;

    // Write output file
    const outputPath = path.join(rootDir, config.output.filename || 'comprehensive_security_report.html');
    fs.writeFileSync(outputPath, fullHtml);

    console.log(`✅ Comprehensive report generated successfully!`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Components rendered: ${sortedComponents.length}`);
    console.log(`📄 Page count: ${pageNum - 1}`);

    return {
      success: true,
      outputPath,
      componentCount: sortedComponents.length,
      pageCount: pageNum - 1
    };

  } catch (error) {
    console.error("❌ Error during report generation:", error);
    throw error;
  }
};

// Export for use as module
export { generateReport, defaultConfig, componentMap };

// Auto-generate if run directly
// if (require.main === module) {
//   generateReport();
// }
