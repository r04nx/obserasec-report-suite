import psycopg2
from neo4j import GraphDatabase
import json
import sys

# Configuration
PG_CONFIG = {
    "host": "10.10.61.232",
    "port": 5433,
    "user": "spiderfoot",
    "password": "spiderfoot",
    "dbname": "spiderfoot"
}

NEO4J_CONFIG = {
    "uri": "bolt://10.10.61.232:7687",
    "user": "neo4j",
    "password": "spiderfoot123"
}

INVESTIGATION_ID = "1234-test-investigation-id"

def sync():
    print(f"Connecting to Postgres at {PG_CONFIG['host']}...")
    try:
        pg_conn = psycopg2.connect(**PG_CONFIG)
        pg_cur = pg_conn.cursor()
    except Exception as e:
        print(f"Error connecting to Postgres: {e}")
        return

    print(f"Connecting to Neo4j at {NEO4J_CONFIG['uri']}...")
    try:
        neo4j_driver = GraphDatabase.driver(NEO4J_CONFIG["uri"], auth=(NEO4J_CONFIG["user"], NEO4J_CONFIG["password"]))
    except Exception as e:
        print(f"Error connecting to Neo4j: {e}")
        return

    # 1. Fetch Nodes
    print(f"Fetching nodes for investigation: {INVESTIGATION_ID}")
    pg_cur.execute("SELECT id, label, type, attributes FROM nodes WHERE investigation_id = %s", (INVESTIGATION_ID,))
    nodes = pg_cur.fetchall()
    print(f"Found {len(nodes)} nodes.")

    # 2. Fetch Edges
    print(f"Fetching edges for investigation: {INVESTIGATION_ID}")
    pg_cur.execute("SELECT source, target, label, attributes FROM edges WHERE investigation_id = %s", (INVESTIGATION_ID,))
    edges = pg_cur.fetchall()
    print(f"Found {len(edges)} edges.")

    with neo4j_driver.session() as session:
        # 3. Import Nodes
        print("Importing nodes into Neo4j...")
        for node_id, label, node_type, attributes in nodes:
            # Clean up label/type for Neo4j label (must be alphanumeric or quoted)
            safe_type = node_type.replace(" ", "_").replace("-", "_") if node_type else "Entity"
            
            # Prepare properties
            props = {
                "id": node_id,
                "label": label,
                "investigation_id": INVESTIGATION_ID,
                "source_type": node_type
            }
            if attributes:
                if isinstance(attributes, str):
                    try:
                        attr_dict = json.loads(attributes)
                    except:
                        attr_dict = {"raw_attributes": attributes}
                else:
                    attr_dict = attributes
                
                # Neo4j doesn't support nested maps as properties.
                # Stringify any nested dicts/lists.
                for k, v in attr_dict.items():
                    if isinstance(v, (dict, list)):
                        props[k] = json.dumps(v)
                    else:
                        props[k] = v

            # Cypher for node creation
            query = f"MERGE (n:`{safe_type}` {{id: $id, investigation_id: $investigation_id}}) SET n += $props"
            session.run(query, id=node_id, investigation_id=INVESTIGATION_ID, props=props)

        # 4. Import Edges
        print("Importing edges into Neo4j...")
        for source, target, edge_label, attributes in edges:
            safe_rel = edge_label.upper().replace(" ", "_").replace("-", "_") if edge_label else "RELATED_TO"
            
            props = {
                "investigation_id": INVESTIGATION_ID
            }
            if attributes:
                if isinstance(attributes, str):
                    try:
                        attr_dict = json.loads(attributes)
                    except:
                        attr_dict = {}
                else:
                    attr_dict = attributes
                
                for k, v in attr_dict.items():
                    if isinstance(v, (dict, list)):
                        props[k] = json.dumps(v)
                    else:
                        props[k] = v

            # Cypher for relationship creation
            query = (
                "MATCH (a {id: $source, investigation_id: $investigation_id}) "
                "MATCH (b {id: $target, investigation_id: $investigation_id}) "
                f"MERGE (a)-[r:`{safe_rel}`]->(b) "
                "SET r += $props"
            )
            session.run(query, source=source, target=target, investigation_id=INVESTIGATION_ID, props=props)

    print("Sync complete!")
    pg_cur.close()
    pg_conn.close()
    neo4j_driver.close()

if __name__ == "__main__":
    sync()
