
import base64
import os

INPUT_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db.gz.b64"
OUTPUT_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db.gz"

def decode_db():
    print(f"Decoding {INPUT_FILE} to {OUTPUT_FILE}...")
    try:
        with open(INPUT_FILE, 'rb') as f_in:
            with open(OUTPUT_FILE, 'wb') as f_out:
                base64.decode(f_in, f_out)
        print("Decoding successful.")
    except Exception as e:
        print(f"Decoding failed: {e}")

if __name__ == "__main__":
    decode_db()
