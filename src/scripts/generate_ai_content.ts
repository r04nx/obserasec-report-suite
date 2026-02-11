
import fs from 'fs';
import path from 'path';
import { OllamaClient } from '../utils/ollama';

// Constants
const API_KEY = "9139754722444da1b6cffbe09a5fdce2.kcDsMQ7F13DjfagVGmyY6iVh";
const MODEL_REASONING = "deepseek-v3.2"; // 688B - High intelligence
const MODEL_STRUCT = "qwen3-coder:480b"; // 510B - Good for structure
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/aiGeneratedReport.ts');

// Initialize Client
const client = new OllamaClient(API_KEY);

// Mock Data for "Seed" (Simulating a raw scan output)
const rawFindings = [
    { title: "Unpatched SMBv1 Enabled (EternalBlue)", severity: "Critical", cvss: 9.8, hosts: ["10.0.1.10", "192.168.1.5"] },
    { title: "Log4j RCE (Log4Shell)", severity: "Critical", cvss: 10.0, hosts: ["10.0.2.20", "10.0.2.21"] },
    { title: "Default SNMP Community Strings", severity: "High", cvss: 8.5, hosts: ["10.0.1.1", "172.16.0.1"] },
    { title: "Weak SSL/TLS Configuration", severity: "Medium", cvss: 6.5, hosts: ["10.0.3.10", "10.0.2.20"] },
    { title: "Blind SQL Injection in HR Portal", severity: "Critical", cvss: 9.4, hosts: ["10.0.3.10"] },
    { title: "Cleartext FTP Authentication", severity: "High", cvss: 7.5, hosts: ["10.0.2.20"] },
    { title: "Open DNS Zone Transfer", severity: "Medium", cvss: 5.8, hosts: ["10.0.1.10"] },
    { title: "Admin Rights to Non-IT Users", severity: "High", cvss: 8.1, hosts: ["10.0.1.10"] }
];

const main = async () => {
    console.log("🚀 Starting AI Report Generation...");

    // 1. Generate Executive Summary
    console.log("📝 Generating Executive Summary...");
    const execSummaryPrompt = `
    You are an expert Cybersecurity Consultant writing an Executive Summary for a C-level audience.
    Analyze the following raw vulnerability findings and write a compelling, high-level summary.
    
    Findings: ${JSON.stringify(rawFindings)}

    Output must be a JSON object with these fields:
    - riskStatement: A powerful 2-3 sentence statement about the overall risk.
    - recommendationText: A strategic recommendation paragraph.
    - criticalCount: Number of criticals (calculate from input).
    - highCount: Number of highs (calculate from input).
    - overallRiskScore: A score from 0-10 based on the findings (Criticals weigh heavily).
    `;

    const execSummary = await client.generateJson(MODEL_REASONING, [{ role: "user", content: execSummaryPrompt }]);
    console.log("✅ Executive Summary Generated.");

    // 2. Generate Attack Vector Graph (Mermaid)
    console.log("🕸️ Generating Attack Vector Graph...");
    const mermaidPrompt = `
    You are a Network Security Architect. Create a Mermaid JS graph diagram code representing a realistic attack path based on these findings.
    
    Findings: ${JSON.stringify(rawFindings)}
    
    Focus on how an attacker could move from the Internet -> DMZ -> Internal Lan -> Domain Controller / Database.
    Use standard Mermaid syntax (graph TD).
    
    Output JSON with a single field "mermaidCode".
    `;

    const mermaidData: any = await client.generateJson(MODEL_STRUCT, [{ role: "user", content: mermaidPrompt }]);
    console.log("✅ Attack Vector Graph Generated.");

    // 3. Generate Remediation Roadmap
    console.log("🛠️ Generating Remediation Roadmap...");
    const remediationPrompt = `
    You are a Security Project Manager. Create a prioritized remediation roadmap based on the findings.
    
    Findings: ${JSON.stringify(rawFindings)}
    
    Group into "immediate" (Critical/High), "shortTerm" (Medium/High), and "longTerm" (Low/Medium/Architecture).
    
    Output JSON structure:
    {
        "immediate": [{ "finding": string, "action": string, "effort": "Low"|"Medium"|"High", "impact": "Critical"|"High" }],
        "shortTerm": [...],
        "longTerm": [...]
    }
    `;

    const roadmap = await client.generateJson(MODEL_STRUCT, [{ role: "user", content: remediationPrompt }]);
    console.log("✅ Remediation Roadmap Generated.");

    // 4. Detailed Findings Enhancement
    console.log("🔍 Enhancing Findings (Sequentially)...");
    const enhancedFindings = [];
    for (const f of rawFindings) {
        try {
            console.log(`   - Enhancing: ${f.title}...`);
            const p = `
            Enhance this vulnerability finding for a technical report.
            Finding: ${JSON.stringify(f)}
            
            Provide:
            - description: Technical explanation (2 sentences).
            - impact: Business/Technical impact (2 sentences).
            - remediation: Technical fix steps (numbered list).
            
            Output JSON.
            `;
            const enhanced: any = await client.generateJson(MODEL_REASONING, [{ role: "user", content: p }]);
            enhancedFindings.push({ ...f, ...enhanced });
        } catch (err) {
            console.error(`   ⚠️ Failed to enhance ${f.title}, keeping raw data. Error: ${err}`);
            enhancedFindings.push(f);
        }
    }
    console.log("✅ Findings Enhanced.");

    // Assemble the final data content
    const fileContent = `
// Auto-generated by Agentic AI
export const aiGeneratedData = {
    executiveSummary: ${JSON.stringify(execSummary, null, 2)},
    mermaidDiagram: {
        title: "Attack Vector Analysis",
        diagramCode: ${JSON.stringify(mermaidData.mermaidCode)}
    },
    remediationRoadmap: ${JSON.stringify(roadmap, null, 2)},
    findings: ${JSON.stringify(enhancedFindings, null, 2)},
    generatedAt: new Date().toISOString()
};
`;

    console.log(`💾 Attempting to write to: ${OUTPUT_FILE}`);
    try {
        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`🎉 Report Data successfully written to ${OUTPUT_FILE}`);
    } catch (writeErr) {
        console.error(`❌ Failed to write file: ${writeErr}`);
    }
};

main().catch((err) => {
    console.error("❌ Fatal Error in main loop:", err);
    process.exit(1);
});
