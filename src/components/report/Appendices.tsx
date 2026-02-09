import React from "react";
import ReportPage from "./ReportPage";
import { portScanResults, glossary } from "@/data/reportData";

const Appendices = () => (
  <>
    {/* Port Scan Results */}
    <ReportPage pageNum={44} sectionTitle="Appendices">
      <h2 className="text-2xl font-bold text-[hsl(var(--obsera-cyan))] mb-6 section-accent">
        Appendices
      </h2>

      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3">
        A. Port Scan Results
      </h3>
      <table className="report-table text-[8px]">
        <thead>
          <tr><th>IP Address</th><th>Port</th><th>Protocol</th><th>Service</th><th>Version</th><th>State</th></tr>
        </thead>
        <tbody>
          {portScanResults.map((p, i) => (
            <tr key={i}>
              <td className="font-mono-ibm text-[hsl(var(--obsera-cyan))]">{p.ip}</td>
              <td className="font-mono-ibm">{p.port}</td>
              <td className="font-mono-ibm">{p.protocol}</td>
              <td>{p.service}</td>
              <td className="font-mono-jb">{p.version}</td>
              <td><span className="bg-[hsl(142,71%,45%)] text-white px-1.5 py-0.5 rounded text-[7px] font-bold">{p.state}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportPage>

    {/* Glossary */}
    <ReportPage pageNum={46} sectionTitle="Appendices">
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        B. Glossary of Terms
      </h3>
      <table className="report-table mb-8">
        <thead>
          <tr><th>Term</th><th>Definition</th></tr>
        </thead>
        <tbody>
          {glossary.map((g) => (
            <tr key={g.term}>
              <td className="font-mono-ibm font-bold text-[hsl(var(--obsera-cyan))] whitespace-nowrap">{g.term}</td>
              <td className="text-[9px] text-foreground/80">{g.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 section-accent">
        C. CVSS v3.1 Scoring Methodology
      </h3>
      <div className="space-y-3 text-[10px] text-foreground/80 leading-relaxed">
        <p>The Common Vulnerability Scoring System (CVSS) v3.1 provides a standardized framework for rating the severity of security vulnerabilities. Scores range from 0.0 to 10.0:</p>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { range: "0.0", label: "None", color: "hsl(210, 20%, 60%)" },
            { range: "0.1–3.9", label: "Low", color: "hsl(142, 71%, 45%)" },
            { range: "4.0–6.9", label: "Medium", color: "hsl(45, 93%, 47%)" },
            { range: "7.0–8.9", label: "High", color: "hsl(25, 95%, 53%)" },
            { range: "9.0–10.0", label: "Critical", color: "hsl(0, 84%, 60%)" },
          ].map((s) => (
            <div key={s.label} className="p-2 rounded bg-[hsl(var(--obsera-surface))] border border-[hsl(var(--border))]">
              <div className="font-bold font-mono-ibm" style={{ color: s.color }}>{s.range}</div>
              <div className="text-[9px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <p>CVSS scores incorporate Base, Temporal, and Environmental metrics. This report uses Base scores. The Base metric group includes Attack Vector, Attack Complexity, Privileges Required, User Interaction, Scope, Confidentiality Impact, Integrity Impact, and Availability Impact.</p>
      </div>

      {/* Sample tool output */}
      <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider mb-3 mt-6 section-accent">
        D. Sample Tool Output
      </h3>
      <div className="bg-[hsl(var(--obsera-navy-deep))] rounded-lg p-4 border border-[hsl(var(--border))]">
        <pre className="font-mono-jb text-[8px] text-[hsl(var(--obsera-cyan))] leading-relaxed whitespace-pre-wrap">{`$ nmap -sV -sC -O 10.0.1.10
Starting Nmap 7.95 ( https://nmap.org ) at 2026-01-16 02:14 IST
Nmap scan report for dc-hq-01.acmecorp.local (10.0.1.10)
Host is up (0.0012s latency).
Not shown: 988 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Microsoft DNS 10.0.20348.1
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows AD LDAP
445/tcp  open  microsoft-ds  Windows Server 2022 Standard
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows AD LDAP
3268/tcp open  ldap          Microsoft Windows AD LDAP (Global Catalog)
3269/tcp open  ssl/ldap      Microsoft Windows AD LDAP (GC over SSL)
3389/tcp open  ms-wbt-server Microsoft Terminal Services

Host script results:
|_smb-vuln-ms17-010: VULNERABLE
|_smb2-security-mode: SMBv1 enabled (DANGEROUS)

OS: Windows Server 2022 Standard 21H2 (build 20348)
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows`}</pre>
      </div>
    </ReportPage>
  </>
);

export default Appendices;
