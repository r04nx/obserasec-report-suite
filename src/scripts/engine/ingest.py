
import sqlite3
from neo4j import GraphDatabase
import json
import os
from config import SQLITE_CONFIG, NEO4J_CONFIG, TARGET_SCAN_NAME

class DataIngestor:
    def __init__(self):
        self.sqlite_conn = None
        self.neo4j_driver = None

    def connect(self):
        print("Connecting to databases...")
        try:
            self.sqlite_conn = sqlite3.connect(SQLITE_CONFIG["db_path"])
            # Set row factory to access columns by name
            self.sqlite_conn.row_factory = sqlite3.Row
            print(f"Connected to SQLite at {SQLITE_CONFIG['db_path']}.")
        except Exception as e:
            print(f"Failed to connect to SQLite: {e}")
            raise

        try:
            self.neo4j_driver = GraphDatabase.driver(
                NEO4J_CONFIG["uri"], 
                auth=(NEO4J_CONFIG["user"], NEO4J_CONFIG["password"])
            )
            print("Connected to Neo4j.")
        except Exception as e:
            print(f"Failed to connect to Neo4j: {e}")
            if self.pg_conn:
                self.pg_conn.close()
            raise

    def close(self):
        if self.sqlite_conn:
            self.sqlite_conn.close()
            print("Closed SQLite connection.")
        if self.neo4j_driver:
            self.neo4j_driver.close()
            print("Closed Neo4j connection.")

    def fetch_nodes(self, limit=100):
        """Fetch findings from SQLite (Spiderfoot data)"""
        if not self.sqlite_conn:
            raise Exception("Database not connected")
        
        cursor = self.sqlite_conn.cursor()
        
        # Query to get latest scan ID first (optional) or just get all findings
        # We will join scan_results with event_types to get readable types
        query = """
        SELECT 
            r.hash as id,
            r.type as type,
            r.data as data,
            r.risk as risk,
            r.confidence as confidence,
            r.module as module
        FROM tbl_scan_results r
        WHERE r.scan_instance_id = ?
        ORDER BY r.risk DESC
        LIMIT ?
        """
        
        cursor.execute(query, (TARGET_SCAN_NAME, limit))
        results = [dict(row) for row in cursor.fetchall()]
        cursor.close()
        
        # Transform for consistency with our internal schema
        transformed = []
        for row in results:
            transformed.append({
                "id": row['id'],
                "label": row['type'], # Using type as label for now
                "type": "finding", # Standardize
                "attributes": {
                    "severity": self._map_risk(row['risk']),
                    "description": row['data'],
                    "module": row['module'],
                    "confidence": row['confidence']
                }
            })
            
        return transformed

    def _map_risk(self, risk_int):
        # Spiderfoot risk: 0=Info, 1=Low, 2=Medium, 3=High
        mapping = {0: "Info", 1: "Low", 2: "Medium", 3: "High"}
        return mapping.get(risk_int, "Info")

    def fetch_graph_data(self):
        """Fetch relevant graph data from Neo4j for visualization"""
        if not self.neo4j_driver:
            raise Exception("Database not connected")
        
        # Example query to fetch critical paths or important relationships
        query = """
        MATCH (source)-[r]->(target)
        RETURN source, r, target LIMIT 50
        """
        
        with self.neo4j_driver.session() as session:
            # result = session.run(query, investigation_id=TARGET_SCAN_NAME) 
            # Removing filter for now as per updated requirements to just show sample
            result = session.run(query)
            nodes = {}
            links = []
            
            for record in result:
                source = record["source"]
                target = record["target"]
                rel = record["r"]
                
                # Process Source Node
                s_id = source.element_id # Neo4j 5.x uses element_id
                # Fallback for older drivers if element_id is not available: id(source)
                
                # Use 'id' property if available, otherwise internal ID
                s_real_id = source.get('id', str(s_id))
                
                if s_real_id not in nodes:
                    nodes[s_real_id] = {
                        "id": s_real_id,
                        "name": source.get('label', 'Unknown'),
                        "type": source.get('source_type', 'unknown'),
                        # Add simplistic risk logic for demo
                        "risk": "critical" if "ip" in source.get('source_type', '').lower() else "low"
                    }
                
                # Process Target Node
                t_id = target.element_id
                t_real_id = target.get('id', str(t_id))
                
                if t_real_id not in nodes:
                    nodes[t_real_id] = {
                        "id": t_real_id,
                        "name": target.get('label', 'Unknown'),
                        "type": target.get('source_type', 'unknown'),
                        "risk": "medium" # default
                    }
                
                links.append({
                    "source": s_real_id,
                    "target": t_real_id,
                    "type": rel.type,
                    "description": rel.get('label', rel.type)
                })
                
            return {
                "entities": list(nodes.values()),
                "connections": links
            }

if __name__ == "__main__":
    ingestor = DataIngestor()
    try:
        ingestor.connect()
        print("\n--- Fetching Nodes from Postgres ---")
        nodes = ingestor.fetch_nodes(limit=5)
        print(json.dumps(nodes, indent=2))
        
        print("\n--- Fetching Graph Data from Neo4j ---")
        graph = ingestor.fetch_graph_data()
        print(json.dumps(graph, indent=2))
        
    finally:
        ingestor.close()
