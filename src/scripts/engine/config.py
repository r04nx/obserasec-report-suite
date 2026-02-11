
# Configuration for Report Engine


# SQLite Configuration (Spiderfoot Local Copy)
SQLITE_CONFIG = {
    "db_path": r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db"
}

# Neo4j Configuration (Knowledge Graph)
NEO4J_CONFIG = {
    "uri": "bolt://10.10.61.232:7687",
    "user": "neo4j",
    "password": "spiderfoot123"
}

# Investigation ID / Scan Name to fetch data for
# For Spiderfoot, we might filter by scan_instance execution
TARGET_SCAN_NAME = "21B18AE6" 
