
import json
import os
from ingest import DataIngestor
from analyze import Analyzer
from datetime import datetime

OUTPUT_DIR = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "final_report.json")

def generate_report():
    print("Starting Report Generation...")
    
    raw_nodes = []
    graph_data = {"entities": [], "connections": []}
    
    ingestor = DataIngestor()
    try:
        ingestor.connect()
        print("Fetching data from databases...")
        try:
            raw_nodes = ingestor.fetch_nodes(limit=20000)
            print(f"Ingested {len(raw_nodes)} findings.")
        except Exception as e:
            print(f"Error fetching SQLite nodes: {e}")
            
        try:
            graph_data = ingestor.fetch_graph_data()
            print(f"Ingested graph with {len(graph_data.get('entities', []))} entities.")
        except Exception as e:
            print(f"Error fetching Neo4j graph data: {e}")
            
    except Exception as e:
        print(f"Error connecting to databases: {e}")
    finally:
        ingestor.close()

    # 2. Analyze Data
    print("Analyzing data...")
    analyzer = Analyzer()
    findings = analyzer.map_to_ocsf(raw_nodes)
    stats = analyzer.generate_stats(findings)
    
    # 3. Probabilistic Analysis (Mock AI)
    print("Generating AI insights...")
    risk_statement = analyzer.generate_executive_risk_statement(stats)
    attack_path_narrative = analyzer.generate_attack_path_narrative(graph_data)
    remediation_roadmap = analyzer.generate_remediation_roadmap(findings)
    # Mock Geo Data for now, in real scenario this comes from ingestor
    geo_data = {"attackOrigins": [], "description": "No data"} 
    threat_intel = analyzer.generate_threat_intel(geo_data)
    
    # 4. Compose Final JSON
    # This structure mirrors 'ObseraReportData' in src/data/reportData.ts
    report_data = {
        "meta": {
            "title": "Network Infrastructure Security Assessment",
            "subtitle": "Comprehensive Vulnerability Assessment Report",
            "client": "Acme Corporation Ltd.",
            "clientIndustry": "Financial Services",
            "assessmentId": "OSEC-2026-AUTO",
            "version": "1.0",
            "classification": "CONFIDENTIAL",
            "date": datetime.now().strftime("%B %Y"),
            "dateRange": datetime.now().strftime("%B %d, %Y"),
            "preparedBy": "ObseraSEC Automated Engine",
            "platform": "ObseraOne",
            "company": "ObseraSEC"
        },
        "docControl": {
             "versions": [
                { "version": "1.0", "date": datetime.now().strftime("%Y-%m-%d"), "author": "ObseraOne Engine", "changes": "Automated Generation" }
             ],
             "authors": [
                { "name": "ObseraOne AI", "role": "Automated Analyst", "email": "ai@observasec.com" }
             ],
             "reviewers": [],
             "distribution": []
        },
        "execSummary": {
            **stats,
            "riskStatement": risk_statement
        },
        "findings": findings,
        "remediation": remediation_roadmap,
        "entityGraph": {
            "title": attack_path_narrative.get("title", "Attack Path Analysis"),
            "subtitle": attack_path_narrative.get("subtitle", "Critical Vectors"),
            "entities": graph_data['entities'],
            "connections": graph_data['connections'],
            # narrative is not in TS interface yet, but good to have in JSON for future
            "narrative": attack_path_narrative.get("narrative", "")
        },
        "geoData": {
            **geo_data,
            "description": threat_intel.get("description", "")
        },
        # Add other sections as needed, potentially mocked or calculated
        "scope": {
            "ipRanges": [],
            "tools": [],
            "timeline": []
        },
        "hostSummary": [], # To be implemented
        "networkAssets": [], # To be implemented
        "subnets": [], # To be implemented
        "trending": { # Mocked for structure
             "byPhase": [], 
             "byService": [], 
             "patchStatus": [], 
             "riskExposure": []
        },
        "hostFindings": [],
        "complianceMapping": { "frameworks": [] },
        "compliance": {}
    }

    # 5. Output JSON
    print(f"Writing report to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(report_data, f, indent=2)
    
    print("Report generation complete!")

if __name__ == "__main__":
    generate_report()
