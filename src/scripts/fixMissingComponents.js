#!/usr/bin/env node

/**
 * Fix for missing new components in default report
 * This script will regenerate the report with proper TOC entries
 */

import { generateReport, defaultConfig } from './comprehensiveRenderer.tsx';

console.log("🔧 Fixing missing components in default report...");

// Create corrected configuration with proper TOC ordering
const correctedConfig = {
  ...defaultConfig,
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
    { name: "MermaidDiagram", enabled: true, order: 13 }, // NEW COMPONENT
    { name: "EntityGraph", enabled: true, order: 14 },    // NEW COMPONENT
    { name: "RemediationRoadmap", enabled: true, order: 15 },
    { name: "Appendices", enabled: true, order: 16 },
    { name: "BackCover", enabled: true, order: 17 }
  ]
};

// Enhanced sample data with new components
const enhancedData = {
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
      { num: "10", title: "System Architecture Diagrams", page: 45 }, // NEW
      { num: "11", title: "Entity Relationship Analysis", page: 46 }, // NEW
      { num: "12", title: "Remediation Roadmap", page: 42 },
      { num: "13", title: "Appendices", page: 44 },
      { num: "13.1", title: "Port Scan Results", page: 44 },
      { num: "13.2", title: "Glossary", page: 46 },
      { num: "13.3", title: "CVSS Methodology", page: 47 }
    ]
  },
  
  // Enhanced data for new components
  mermaidDiagram: {
    title: "System Architecture Diagrams",
    subtitle: "Interactive security infrastructure visualization",
    diagramCode: `graph TB
    subgraph "Security Layers"
        PERIMETER[Perimeter Security]
        NETWORK[Network Security]
        ENDPOINT[Endpoint Security]
        DATA[Data Security]
    end
    
    subgraph "Threat Landscape"
        EXT_THREAT[External Threats]
        INT_THREAT[Internal Threats]
        APT[Advanced Threats]
    end
    
    subgraph "Controls"
        FW[Firewall]
        IDS[Intrusion Detection]
        WAF[Web App Firewall]
        EDR[Endpoint Detection]
    end
    
    EXT_THREAT --> PERIMETER
    INT_THREAT --> NETWORK
    APT --> DATA
    
    PERIMETER --> FW
    NETWORK --> IDS
    ENDPOINT --> EDR
    DATA --> WAF`,
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
    title: "Entity Relationship Analysis",
    subtitle: "Advanced correlation between security entities with red theme",
    entities: [
      { id: 'attacker', name: 'External Attacker', type: 'threat', risk: 'critical', description: 'Sophisticated threat actor targeting infrastructure' },
      { id: 'webapp', name: 'Web Application', type: 'system', risk: 'high', description: 'Customer-facing web portal with multiple vulnerabilities' },
      { id: 'database', name: 'Production Database', type: 'system', risk: 'critical', description: 'PostgreSQL database containing sensitive PII and financial data' },
      { id: 'sqli', name: 'SQL Injection', type: 'vulnerability', risk: 'critical', description: 'Critical blind SQL injection vulnerability in login form' },
      { id: 'xss', name: 'Cross-Site Scripting', type: 'vulnerability', risk: 'high', description: 'Stored XSS in user profile section' },
      { id: 'admin', name: 'Database Admin', type: 'user', risk: 'high', description: 'Privileged database administrator account' },
      { id: 'waf', name: 'Web Application Firewall', type: 'control', risk: 'medium', description: 'ModSecurity WAF with custom ruleset' },
      { id: 'ids', name: 'Intrusion Detection System', type: 'control', risk: 'medium', description: 'Network-based IDS with signature detection' },
      { id: 'pii', name: 'PII Data', type: 'data', risk: 'critical', description: 'Customer personally identifiable information' },
      { id: 'logs', name: 'Security Logs', type: 'data', risk: 'medium', description: 'System and application security logs' },
      { id: 'backup', name: 'Backup System', type: 'system', risk: 'medium', description: 'Automated backup and recovery system' }
    ],
    connections: [
      { source: 'attacker', target: 'webapp', type: 'exploit', strength: 9, description: 'targets' },
      { source: 'attacker', target: 'sqli', type: 'exploit', strength: 10, description: 'leverages' },
      { source: 'attacker', target: 'xss', type: 'exploit', strength: 7, description: 'uses' },
      { source: 'sqli', target: 'webapp', type: 'exploit', strength: 10, description: 'affects' },
      { source: 'xss', target: 'webapp', type: 'exploit', strength: 8, description: 'affects' },
      { source: 'webapp', target: 'database', type: 'communicates', strength: 10, description: 'queries' },
      { source: 'database', target: 'pii', type: 'contains', strength: 10, description: 'stores' },
      { source: 'admin', target: 'database', type: 'access', strength: 10, description: 'manages' },
      { source: 'waf', target: 'webapp', type: 'protects', strength: 6, description: 'protects' },
      { source: 'ids', target: 'webapp', type: 'monitors', strength: 7, description: 'monitors' },
      { source: 'database', target: 'backup', type: 'communicates', strength: 8, description: 'backs up to' },
      { source: 'webapp', target: 'logs', type: 'generates', strength: 6, description: 'generates' },
      { source: 'database', target: 'logs', type: 'generates', strength: 8, description: 'generates' },
      { source: 'attacker', target: 'admin', type: 'targets', strength: 5, description: 'targets credentials' }
    ],
    layout: 'force',
    showLabels: true,
    showMetadata: true,
    theme: 'red'
  }
};

async function generateFixedReport() {
  try {
    console.log("🚀 Generating corrected report with new components...");
    console.log("📊 Including:");
    console.log("   • System Architecture Diagrams (Mermaid)");
    console.log("   • Entity Relationship Analysis (Red Theme)");
    
    const result = await generateReport(correctedConfig, enhancedData);
    
    console.log("✅ Fixed report generated successfully!");
    console.log(`📁 Output: ${result.outputPath}`);
    console.log(`📊 Components: ${result.componentCount}`);
    console.log(`📄 Pages: ${result.pageCount}`);
    
    console.log("🔍 New components should now appear in:");
    console.log("   • Table of Contents as sections 10 & 11");
    console.log("   • System Architecture Diagrams with interactive Mermaid diagrams");
    console.log("   • Entity Relationship Analysis with red-themed graph visualization");
    
  } catch (error) {
    console.error("❌ Failed to generate fixed report:", error);
    process.exit(1);
  }
}

// Run the fix
generateFixedReport();
