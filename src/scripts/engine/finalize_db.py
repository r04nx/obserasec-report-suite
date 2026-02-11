
import base64
import gzip
import shutil
import os

B64_GZ_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db.gz.b64"
GZ_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db.gz"
DB_FILE = r"c:\Users\Wissen\Downloads\report\obserasec_suite\src\data\spiderfoot.db"

def finalize_db():
    print(f"1. Decoding base64: {B64_GZ_FILE} -> {GZ_FILE}")
    try:
        with open(B64_GZ_FILE, 'rb') as f_in:
            with open(GZ_FILE, 'wb') as f_out:
                base64.decode(f_in, f_out)
        print("   Success.")
    except Exception as e:
        print(f"   Failed: {e}")
        return

    print(f"2. Decompressing gzip: {GZ_FILE} -> {DB_FILE}")
    try:
        with gzip.open(GZ_FILE, 'rb') as f_in:
            with open(DB_FILE, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        print("   Success.")
        # Cleanup temporary files
        os.remove(B64_GZ_FILE)
        os.remove(GZ_FILE)
        print("3. Cleaned up temporary transfer files.")
    except Exception as e:
        print(f"   Failed: {e}")

if __name__ == "__main__":
    finalize_db()
