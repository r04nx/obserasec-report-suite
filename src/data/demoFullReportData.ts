import { ObseraReportData, reportMeta, documentControl, executiveSummary, riskTrend, riskMatrix, scopeData, networkAssets, subnets, geoData, findings, vulnTrending, complianceData, remediationRoadmap, portScanResults, glossary, entityGraphData, mermaidDiagramData, vulnByCategory, vulnByHost, severityDistribution } from './reportData';

// We need to map the flat data structure to the component-based structure expected by the renderer
// The renderer looks for keys matching the component name in camelCase (e.g. "RiskDashboard" -> "riskDashboard")

export const demoFullReportData: any = {
    meta: {
        ...reportMeta,
        title: "Comprehensive Security Assessment",
        subtitle: "Full Component Demo Report",
    },
    documentControl: documentControl,

    executiveSummary: {
        ...executiveSummary,
    },

    scopeMethodology: {
        ...scopeData
    },

    riskDashboard: {
        title: "Risk Summary Dashboard",
        category: vulnByCategory,
        trend: riskTrend,
        hosts: vulnByHost,
        riskMatrix: riskMatrix,
        distribution: severityDistribution
    },

    networkArchitecture: {
        assets: networkAssets,
        subnets: subnets
    },

    geoThreatIntel: geoData,

    detailedFindings: {
        findings: findings
    },

    vulnTrending: vulnTrending,

    complianceMapping: complianceData,

    hostSummary: {
        assets: networkAssets
    },

    mermaidDiagram: {
        title: "Network Security Architecture",
        subtitle: "Enterprise cloud network landing zone with multiple security tiers",
        diagramCode: `graph TB
    subgraph Public_Internet [External Traffic]
        User((End User))
        Attactor((Threat Actor))
    end

    subgraph Edge_Security [Edge Protection]
        WAF[Cloud Armor WAF]
        DDOS[DDoS Protection]
        LB[External Load Balancer]
    end

    subgraph Trust_Zone [DMZ Tier]
        Web1[Nginx Web Srv 01]
        Web2[Nginx Web Srv 02]
        Bastion[Management Bastion]
    end

    subgraph App_Zone [Internal Application Tier]
        App1[Node.js API 01]
        App2[Node.js API 02]
        Redis[(Redis Cache)]
    end

    subgraph Data_Layer [Database Tier]
        SQL[(PostgreSQL Cluster)]
        NoSQL[(MongoDB Cluster)]
        Vault[HashiCorp Vault]
    end

    %% Connections
    User --> WAF
    Attactor --> WAF
    WAF --> DDOS
    DDOS --> LB
    LB --> Web1
    LB --> Web2
    Web1 --> App1
    Web2 --> App2
    App1 --> Redis
    App2 --> Redis
    App1 --> SQL
    App1 --> Vault
    App2 --> SQL
    App2 --> NoSQL
    Bastion --> App1
    Bastion --> App2
    Bastion --> SQL

    %% Styles
    style LB fill:#f9f,stroke:#333,stroke-width:2px
    style SQL fill:#00d,stroke:#333,stroke-width:2px,color:#fff
    style Vault fill:#f66,stroke:#333,stroke-width:4px
    style WAF fill:#ffa,stroke:#333,stroke-width:4px`
    },

    entityGraph: {
        title: "Vulnerability Correlation & Threat Mapping",
        subtitle: "Multi-dimensional view of vulnerabilities, assets, and potential impact paths",
        entities: [
            { id: 't1', name: 'APT-29 (Cozy Bear)', type: 'threat', risk: 'critical', description: 'Advanced Persistent Threat' },
            { id: 'v1', name: 'Log4Shell (CVE-2021-44228)', type: 'vulnerability', risk: 'critical', description: 'Unauthenticated RCE' },
            { id: 'v2', name: 'EternalBlue (MS17-010)', type: 'vulnerability', risk: 'high', description: 'SMBv1 RCE' },
            { id: 's1', name: 'Web-DMZ-01', type: 'system', risk: 'high', description: 'Public facing web server' },
            { id: 's2', name: 'Prod-DB-01', type: 'system', risk: 'critical', description: 'Main transaction database' },
            { id: 's3', name: 'Domain-Controller', type: 'system', risk: 'critical', description: 'Active Directory Root' },
            { id: 'c1', name: 'CrowdStrike Falcon', type: 'control', risk: 'low', description: 'EDR Prevention' },
            { id: 'u1', name: 'Domain Admin', type: 'user', risk: 'critical', description: 'Privileged identity' },
            { id: 'd1', name: 'Customer PII', type: 'data', risk: 'critical', description: 'Encrypted at rest data' }
        ],
        connections: [
            { source: 't1', target: 'v1', type: 'exploit', strength: 10, description: 'Known attack vector' },
            { source: 'v1', target: 's1', type: 'relates', strength: 9, description: 'Vulnerable version detected' },
            { source: 's1', target: 's2', type: 'communicates', strength: 7, description: 'Allowed database traffic' },
            { source: 'v2', target: 's3', type: 'exploit', strength: 10, description: 'Targeting legacy SMB' },
            { source: 'c1', target: 's1', type: 'protects', strength: 8, description: 'Active monitoring' },
            { source: 'u1', target: 's3', type: 'access', strength: 10, description: 'Full administrative rights' },
            { source: 's2', target: 'd1', type: 'contains', strength: 10, description: 'Hosts PII data' }
        ]
    },

    compliance: complianceFallback, // use fallback for demo
    portScan: portScanResults,
    portScanResults: portScanResults,
    riskMatrix: riskMatrix,
    glossary: glossary,
    toolOutputTitle: "Nmap Advanced Scan Output",
    toolOutputText: `Nmap scan report for 10.0.1.10 (dc-hq-01.acmecorp.local)
Host is up (0.00045s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Microsoft DNS 10.0.20348 (Windows Server 2022)
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
135/tcp  open  msrpc         Microsoft Windows RPC
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: acmecorp.local)
445/tcp  open  microsoft-ds  Microsoft Windows 10 - 2022 SMBv3
636/tcp  open  tcpwrapped
3389/tcp open  ms-wbt-server Microsoft Terminal Services
Service Info: Host: DC-HQ-01; OS: Windows; CPE: cpe:/o:microsoft:windows

Nmap scan report for 10.0.2.11 (db-prod-02)
Host is up (0.00082s latency).
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.0 (protocol 2.0)
1521/tcp open  oracle  Oracle TNS listener 19.0.0.0.0`
};
