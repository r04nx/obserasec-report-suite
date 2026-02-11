#!/usr/bin/env node

/**
 * Comprehensive Report Generator Test Script
 * 
 * This script demonstrates the full capabilities of the enhanced report system including:
 * - Mermaid diagrams with PDF optimization
 * - Entity relationship graphs with red theme
 * - All existing visualizations and components
 */

import { generateReport, defaultConfig } from './comprehensiveRenderer.js';

// Enhanced test data with all components
const testData = {
  executiveSummary: {
    title: "Executive Summary",
    description: "This comprehensive security assessment reveals critical vulnerabilities requiring immediate attention across multiple infrastructure layers.",
    critical: 8,
    high: 15,
    medium: 32,
    low: 47,
    informational: 89,
    totalVulnerabilities: 191,
    overallRiskScore: 8.3,
    systemsTested: 342,
    systemsCompromised: 5,
    riskStatement: "Critical SQL injection vulnerabilities discovered in web applications could allow complete database compromise. Multiple high-severity misconfigurations in network devices expose the infrastructure to lateral movement attacks.",
    recommendationText: "Immediate patching of critical vulnerabilities is required within 24 hours. Implement web application firewall rules and conduct emergency security hardening across all critical systems."
  },
  
  mermaidDiagram: {
    title: "Security Architecture Overview",
    subtitle: "Complete security infrastructure with threat landscape",
    diagramCode: `graph TB
    subgraph "External Threats"
        TH1[Malicious Actors]
        TH2[Automated Attacks]
        TH3[Insider Threats]
    end
    
    subgraph "Security Controls"
        FW[Next-Gen Firewall]
        IDS[Intrusion Detection]
        WAF[Web Application Firewall]
        SIEM[Security Monitoring]
    end
    
    subgraph "Infrastructure"
        LB[Load Balancer]
        WEB1[Web Server 1]
        WEB2[Web Server 2]
        APP[Application Server]
        DB[(Database)]
        CACHE[Redis Cache]
    end
    
    subgraph "Data Assets"
        PII[PII Data]
        FIN[Financial Records]
        LOGS[Security Logs]
    end
    
    TH1 -.->|attack| FW
    TH2 -.->|scan| IDS
    TH3 -.->|internal| APP
    
    FW --> WAF
    WAF --> LB
    LB --> WEB1
    LB --> WEB2
    WEB1 --> APP
    WEB2 --> APP
    APP --> DB
    APP --> CACHE
    
    DB --> PII
    DB --> FIN
    SIEM --> LOGS
    
    IDS --> SIEM
    WAF --> SIEM
    FW --> SIEM`,
    type: "graph",
    theme: "default",
    config: {
      themeVariables: {
        primaryColor: '#dc2626',
        primaryTextColor: '#1a0000',
        primaryBorderColor: '#dc2626',
        lineColor: '#dc2626'
      }
    }
  },

  entityGraph: {
    title: "Threat Entity Correlation Analysis",
    subtitle: "Advanced relationship mapping between security entities with risk-based visualization",
    entities: [
      { id: 'attacker', name: 'External Attacker', type: 'threat', risk: 'critical', description: 'Sophisticated threat actor' },
      { id: 'webapp', name: 'Web Application', type: 'system', risk: 'high', description: 'Customer-facing web portal' },
      { id: 'database', name: 'Customer Database', type: 'system', risk: 'critical', description: 'PostgreSQL with PII data' },
      { id: 'sqli', name: 'SQL Injection', type: 'vulnerability', risk: 'critical', description: 'Blind SQL injection flaw' },
      { id: 'xss', name: 'XSS', type: 'vulnerability', risk: 'high', description: 'Stored cross-site scripting' },
      { id: 'admin', name: 'Admin Account', type: 'user', risk: 'high', description: 'Database administrator' },
      { id: 'waf', name: 'WAF', type: 'control', risk: 'medium', description: 'ModSecurity web application firewall' },
      { id: 'pii', name: 'PII Data', type: 'data', risk: 'critical', description: 'Customer personal information' },
      { id: 'apt', name: 'APT Group', type: 'threat', risk: 'critical', description: 'State-sponsored threat group' },
      { id: 'backup', name: 'Backup System', type: 'system', risk: 'medium', description: 'Automated backup solution' }
    ],
    connections: [
      { source: 'attacker', target: 'webapp', type: 'exploit', strength: 9, description: 'targets' },
      { source: 'apt', target: 'sqli', type: 'exploit', strength: 10, description: 'leverages' },
      { source: 'sqli', target: 'webapp', type: 'exploit', strength: 10, description: 'affects' },
      { source: 'xss', target: 'webapp', type: 'exploit', strength: 7, description: 'affects' },
      { source: 'webapp', target: 'database', type: 'communicates', strength: 10, description: 'queries' },
      { source: 'database', target: 'pii', type: 'contains', strength: 10, description: 'stores' },
      { source: 'admin', target: 'database', type: 'access', strength: 10, description: 'manages' },
      { source: 'waf', target: 'webapp', type: 'protects', strength: 6, description: 'protects' },
      { source: 'attacker', target: 'xss', type: 'exploit', strength: 8, description: 'uses' },
      { source: 'database', target: 'backup', type: 'communicates', strength: 8, description: 'backups to' },
      { source: 'apt', target: 'attacker', type: 'relates', strength: 7, description: 'controls' },
      { source: 'admin', target: 'backup', type: 'access', strength: 5, description: 'manages' }
    ],
    layout: 'force',
    showLabels: true,
    showMetadata: true,
    theme: 'red'
  },

  riskDashboard: {
    title: "Advanced Risk Analytics",
    category: [
      { category: "Web Applications", count: 67 },
      { category: "Network Services", count: 45 },
      { category: "Databases", count: 28 },
      { category: "Cloud Services", count: 34 },
      { category: "Endpoints", count: 17 }
    ],
    trend: [
      { month: "Jan", score: 7.2 },
      { month: "Feb", score: 7.8 },
      { month: "Mar", score: 8.1 },
      { month: "Apr", score: 7.9 },
      { month: "May", score: 8.5 },
      { month: "Jun", score: 8.3 }
    ],
    hosts: [
      { host: "10.0.1.0/24", critical: 3, high: 7, medium: 12, low: 18 },
      { host: "10.0.2.0/24", critical: 2, high: 4, medium: 8, low: 14 },
      { host: "192.168.1.0/24", critical: 3, high: 4, medium: 12, low: 15 }
    ]
  }
};

// Enhanced configuration with red theme
const enhancedConfig = {
  ...defaultConfig,
  meta: {
    ...defaultConfig.meta,
    client: "Global Financial Services Inc.",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    assessmentId: "OSEC-2026-0142",
    reportTitle: "Advanced Security Assessment Report",
    subtitle: "Comprehensive Threat Analysis & Entity Correlation",
    version: "2.0",
    classification: "TOP SECRET"
  },
  theme: {
    primaryColor: "#dc2626",
    secondaryColor: "#1a0000",
    fontFamily: "IBM Plex Sans"
  },
  output: {
    filename: "advanced_security_report_with_graphs.html",
    format: "html",
    includeStyles: true
  }
};

// Generate the comprehensive report
async function main() {
  console.log("🚀 Generating Advanced Security Report with Enhanced Visualizations...");
  console.log("📊 Components: Mermaid Diagrams, Entity Graphs, Risk Analytics");
  console.log("🎨 Theme: Red-themed entity correlation analysis");
  console.log("📄 Output: PDF-optimized comprehensive report");
  
  try {
    const result = await generateReport(enhancedConfig, testData);
    
    console.log("✅ Report generated successfully!");
    console.log(`📁 Output file: ${result.outputPath}`);
    console.log(`📊 Components rendered: ${result.componentCount}`);
    console.log(`📄 Total pages: ${result.pageCount}`);
    console.log("🔥 Features included:");
    console.log("   • PDF-optimized Mermaid diagrams");
    console.log("   • Red-themed entity relationship graphs");
    console.log("   • Force-directed graph layouts");
    console.log("   • Interactive connection analysis");
    console.log("   • Risk-based color coding");
    console.log("   • Detailed entity metadata");
    
  } catch (error) {
    console.error("❌ Report generation failed:", error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  main();
}

export { main, testData, enhancedConfig };
