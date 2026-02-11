
import json
from collections import Counter
from prompts import (
    PROMPT_EXECUTIVE_SUMMARY,
    PROMPT_REMEDIATION_ROADMAP,
    PROMPT_ATTACK_PATH,
    PROMPT_THREAT_INTEL
)

# Mock LLM Client wrapper for prototype
def mock_llm_call(system_prompt, context_data):
    """
    Simulates an LLM call. In a real system, this would call OpenAI/Anthropic.
    For now, it returns a deterministic "AI-like" response based on the prompt type.
    """
    # Debug: Print the prompt that would be sent
    # print(f"--- Sending to LLM ---\n{system_prompt.format(context_data=json.dumps(context_data, indent=2))}\n----------------------")

    if "Executive Risk Statement" in system_prompt:
        risk_score = context_data.get('overallRiskScore', 5.0)
        risk_level = "CRITICAL" if risk_score > 8 else "HIGH" if risk_score > 6 else "MEDIUM"
        return json.dumps({
            "riskStatement": f"The assessment of the client's infrastructure reveals a {risk_level} risk posture, driven by {context_data.get('critical', 0)} critical vulnerabilities. Key findings include unpatched systems and exposed services, presenting a significant attack surface.",
            "overallRiskScore": risk_score
        })

    elif "Remediation Roadmap" in system_prompt:
        # Simplistic logic to generate roadmap from findings
        findings = context_data.get('findings', [])
        criticals = [f for f in findings if f['severity'] == 'Critical']
        highs = [f for f in findings if f['severity'] == 'High']
        
        return json.dumps({
            "immediate": [
                {"finding": f['id'], "action": f"Patch {f['category']} vulnerability immediately", "effort": "Low", "impact": "Critical", "deadline": "24 hours"}
                for f in criticals[:3]
            ],
            "shortTerm": [
                {"finding": f['id'], "action": f"Remediate {f['title']}", "effort": "Medium", "impact": "High", "deadline": "1 week"}
                for f in highs[:3]
            ],
            "longTerm": []
        })

    elif "Critical Attack Path" in system_prompt:
        return json.dumps({
            "title": "External Exposure to Data Exfiltration",
            "subtitle": "Identified path from Internet-facing Web Server to Production Database",
            "narrative": "Attackers can exploit the SQL Injection vulnerability on the Web DMZ server (Node A) to gain initial access. From there, lateral movement is possible via stored credentials to access the internal Database Server (Node B), leading to potential exfiltration of sensitive customer data."
        })

    elif "Threat Landscape Overview" in system_prompt:
        return json.dumps({
            "description": "Geolocation analysis indicates a high volume of traffic from high-risk regions. Correlated with OSINT data, this suggests automated scanning campaigns targeting specific vulnerabilities found in the client's external footprint."
        })

    return "{}"

class Analyzer:
    def __init__(self):
        pass

    def map_to_ocsf(self, raw_nodes):
        """
        Deterministic mapping of raw findings to OCSF-like 'Finding' objects.
        This ensures mathematical accuracy of counts.
        """
        findings = []
        for node in raw_nodes:
            # Skip if not a finding/vulnerability
            if node.get('type') not in ['vulnerability', 'finding', 'issue', 'bug']:
                continue
            
            # Extract attributes safely
            attrs = {}
            if node.get('attributes'):
                if isinstance(node['attributes'], dict):
                    attrs = node['attributes']
                else:
                    try:
                        attrs = json.loads(node['attributes'])
                    except:
                        pass
            
            finding = {
                "id": node.get('id'),
                "title": f"{node.get('label', 'Finding')} detected by {attrs.get('module', 'System')}",
                "severity": attrs.get('severity', 'Info'),
                "cvss": 0.0, # Spiderfoot doesn't provide CVSS usually
                "category": attrs.get('module', 'General'),
                "affectedHosts": [attrs.get('host', 'target-asset')], # Placeholder
                "description": attrs.get('description', 'No description available.'),
                "impact": "Potential security risk.",
                "remediation": "Investigate finding.",
                "cve": None
            }
            findings.append(finding)
        return findings

    def generate_stats(self, findings):
        """
        Calculate statistics for the executive summary.
        """
        total = len(findings)
        severity_counts = Counter(f['severity'] for f in findings)
        
        # Calculate a mock risk score based on weighted severity
        weights = {"Critical": 10, "High": 8, "Medium": 5, "Low": 2, "Info": 0}
        weighted_sum = sum(weights.get(f['severity'], 1) for f in findings)
        max_score = total * 10 if total > 0 else 1
        overall_score = round((weighted_sum / max_score) * 10, 1)

        return {
            "totalVulnerabilities": total,
            "critical": severity_counts.get("Critical", 0),
            "high": severity_counts.get("High", 0),
            "medium": severity_counts.get("Medium", 0),
            "low": severity_counts.get("Low", 0),
            "informational": severity_counts.get("Info", 0),
            "overallRiskScore": overall_score
        }

    def generate_executive_risk_statement(self, stats):
        """
        Probabilistic (Mock AI) generation of Executive Risk Statement.
        In a real system, this would call an LLM with the stats as context.
        """
        response_json = mock_llm_call(PROMPT_EXECUTIVE_SUMMARY, stats)
        try:
            data = json.loads(response_json)
            return data.get("riskStatement", "Risk statement generation failed.")
        except:
            return "Risk statement generation failed."

    def generate_attack_path_narrative(self, graph_data):
        """
        Probabilistic (Mock AI) generation of Attack Path Narrative.
        """
        # Context preparation: Simplify graph for prompt
        context = {
             "nodes_count": len(graph_data.get('entities', [])),
             "edges_count": len(graph_data.get('connections', [])),
             "critical_nodes": [n for n in graph_data.get('entities', []) if n.get('risk') == 'critical']
        }
        
        response_json = mock_llm_call(PROMPT_ATTACK_PATH, context)
        try:
            return json.loads(response_json)
        except:
            return {
                "title": "Attack Path Analysis",
                "subtitle": "Analysis failed",
                "narrative": "Could not generate narrative."
            }
            
    def generate_remediation_roadmap(self, findings):
        """
        Generates the Remediation Roadmap using AI.
        """
        # Context preparation: Send full findings list (or top N for token limits)
        context = {
            "findings": findings[:20] # Limit for mock/prototype
        }
        
        response_json = mock_llm_call(PROMPT_REMEDIATION_ROADMAP, context)
        try:
            return json.loads(response_json)
        except:
            return {"immediate": [], "shortTerm": [], "longTerm": []}

    def generate_threat_intel(self, geo_data):
         """
         Generates Threat Intel overview.
         """
         response_json = mock_llm_call(PROMPT_THREAT_INTEL, geo_data)
         try:
             return json.loads(response_json)
         except:
             return {"description": "Threat intel generation failed."}

if __name__ == "__main__":
    # Test with dummy data
    analyzer = Analyzer()
    mock_nodes = [
        {"id": "1", "type": "vulnerability", "label": "Test Vuln 1", "attributes": {"severity": "High", "cvss": 8.5, "category": "Network"}},
        {"id": "2", "type": "vulnerability", "label": "Test Vuln 2", "attributes": {"severity": "Critical", "cvss": 9.8, "category": "Auth"}},
        {"id": "3", "type": "asset", "label": "Server 1"}
    ]
    
    findings = analyzer.map_to_ocsf(mock_nodes)
    stats = analyzer.generate_stats(findings)
    risk_stmt = analyzer.generate_executive_risk_statement(stats)
    roadmap = analyzer.generate_remediation_roadmap(findings)
    
    print("Stats:", json.dumps(stats, indent=2))
    print("Risk Statement:", risk_stmt)
    print("Roadmap:", json.dumps(roadmap, indent=2))
