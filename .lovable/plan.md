

# ObseraSEC Security Assessment Report Template

## Overview
A comprehensive, A4-sized HTML security assessment report for **ObseraSEC** (platform: ObseraOne) — a **Network/Infrastructure Vulnerability Assessment** report with ~40-60 pages, dark blue & cyan/teal branding, export-to-PDF functionality, and rich data visualizations.

---

## Design System
- **Colors**: Dark navy blue (#0A1628) primary, cyan/teal (#00D4FF) accent, white text on dark sections, dark text on light sections
- **Fonts**: Arial (body), IBM Plex Mono (code/technical data), JetBrains Mono (terminal outputs/hashes)
- **Style**: Modern corporate with geometric shapes, diagonal line patterns, subtle grid overlays, and gradient accents
- **Page format**: A4 (210mm × 297mm) with proper margins, page numbers, headers/footers with ObseraSEC branding & watermark

---

## Report Structure (Page by Page)

### 1. Cover Page
- Full-page design using the cover page template image from the provided URL
- ObseraSEC dark logo, report title "Network Infrastructure Security Assessment", client name, date, classification (CONFIDENTIAL)

### 2. Document Control Page
- Version history table, author info, reviewer, distribution list
- Disclaimer and confidentiality notice

### 3. Table of Contents
- Auto-styled TOC with section numbers, page references, and dotted leaders
- Themed with cyan accent lines

### 4. Executive Summary (2-3 pages)
- High-level overview with key metrics cards (Critical/High/Medium/Low counts)
- Overall risk score gauge/donut chart
- Themed pie chart showing vulnerability distribution by severity
- Executive risk statement paragraph
- Unsplash-sourced cybersecurity themed header image

### 5. Scope & Methodology (2 pages)
- Scope of assessment table (IP ranges, domains, systems tested)
- Methodology flowchart/diagram (Reconnaissance → Scanning → Enumeration → Exploitation → Reporting)
- Tools used table with icons
- Testing timeline bar chart

### 6. Risk Summary Dashboard (2-3 pages)
- **Bar chart**: Vulnerabilities by category (Authentication, Encryption, Patching, Config, etc.)
- **Line chart**: Risk trend over time (if recurring assessment)
- **Pie chart**: Findings by severity
- **Stacked bar**: Findings by host/subnet
- **Heatmap-style table**: Risk matrix (Likelihood vs Impact)
- All charts themed in dark blue/cyan palette using Recharts

### 7. Network Architecture Overview (1-2 pages)
- Network topology description with Unsplash data-center/network imagery
- Asset inventory summary table
- Subnet breakdown table

### 8. Geographical Threat Intelligence (1-2 pages)
- **World map** visualization showing attack origin locations / assessed infrastructure locations
- **National map** (if applicable) showing regional asset distribution
- Stats cards for geographic threat data

### 9. Detailed Findings (15-20 pages)
Each finding as a styled card/section including:
- Finding ID, title, severity badge (color-coded)
- CVSS score with visual bar
- Affected hosts table
- Description, evidence/screenshots (Unsplash placeholder images), proof of concept
- Impact statement
- Remediation steps with priority
- References/CVE links

Sample findings (~10-15 findings covering):
- Unpatched critical CVEs
- Default credentials
- Open ports/services
- Weak SSL/TLS configurations
- Missing firewall rules
- SNMP community strings
- DNS zone transfer
- SMB vulnerabilities
- Outdated firmware
- Privilege escalation paths

### 10. Vulnerability Trending & Analytics (2-3 pages)
- **Line plot**: Vulnerability count over assessment phases
- **Grouped bar chart**: Vulnerabilities by service type (SSH, HTTP, FTP, RDP, etc.)
- **Donut chart**: Patched vs unpatched systems
- **Area chart**: Risk exposure timeline

### 11. Compliance Mapping (1-2 pages)
- Table mapping findings to compliance frameworks (ISO 27001, NIST, CIS Controls)
- Compliance score bar charts per framework
- Pass/Fail status indicators

### 12. Host-Level Summary (3-4 pages)
- Attractive table per host with IP, hostname, OS, open ports, vulnerability count, risk rating
- Color-coded severity rows
- Sortable-looking column headers

### 13. Remediation Roadmap (2 pages)
- Priority matrix table (Quick wins vs Long-term)
- Timeline-style visualization for remediation phases
- Effort vs Impact scatter-style layout

### 14. Appendices (3-5 pages)
- Full port scan results table
- Raw vulnerability scan data tables
- Glossary of terms
- CVSS scoring methodology explanation
- Tool output samples in monospace/code blocks (JetBrains Mono)

### 15. Back Cover
- ObseraSEC contact information, logo, confidentiality statement
- Geometric pattern footer matching cover page style

---

## Key Features

### Export to PDF
- "Export to PDF" button using browser's `window.print()` with `@media print` CSS rules optimized for A4
- Proper page breaks between sections
- Print-specific styles hiding the export button

### Visual Elements Throughout
- Page headers with ObseraSEC logo (small) + section title
- Page footers with page numbers, document classification, and company name
- Subtle watermark on each page ("CONFIDENTIAL - ObseraSEC")
- Geometric decorative elements (diagonal lines, dot patterns) in margins
- Cyan accent borders and section dividers

### Charts & Visualizations (all Recharts, themed)
- Pie charts, bar charts, line plots, area charts, donut charts
- World/national map visualizations (SVG-based)
- Risk gauges and score indicators
- All in dark blue/cyan/teal color palette

