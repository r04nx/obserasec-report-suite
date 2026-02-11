
import gzip
import shutil
import os

INPUT_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db.gz"
OUTPUT_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db"

def decompress_db():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} does not exist.")
        return

    print(f"Decompressing {INPUT_FILE} to {OUTPUT_FILE}...")
    try:
        with gzip.open(INPUT_FILE, 'rb') as f_in:
            with open(OUTPUT_FILE, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        print("Decompression successful.")
    except Exception as e:
        print(f"Decompression failed: {e}")

if __name__ == "__main__":
    decompress_db()
