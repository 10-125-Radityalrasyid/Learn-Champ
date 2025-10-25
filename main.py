import os

SRC_DIR = os.path.join(os.getcwd(), "app")
OUTPUT_FILE = os.path.join(os.getcwd(), "extracted_files.txt")
ALLOWED_EXTENSIONS = {".ts", ".tsx", ".css"}

def extract_and_write(file_path, base_src_dir, output_file):
    rel_path = os.path.relpath(file_path, base_src_dir)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    with open(output_file, 'a', encoding='utf-8') as out:
        out.write(f"\n{'='*80}\n")
        out.write(f"File: {rel_path}\n")
        out.write(f"{'='*80}\n\n")
        out.write(content)
        out.write("\n\n")

def process_directory(current_dir, base_src_dir, output_file):
    for item in os.listdir(current_dir):
        path = os.path.join(current_dir, item)
        if os.path.isdir(path):
            process_directory(path, base_src_dir, output_file)
        else:
            _, ext = os.path.splitext(path)
            if ext in ALLOWED_EXTENSIONS:
                extract_and_write(path, base_src_dir, output_file)
                print(f"✔️ Extracted: {os.path.relpath(path, base_src_dir)}")

if __name__ == "__main__":
    if not os.path.exists(SRC_DIR):
        print("❌ Folder 'src' tidak ditemukan.")
    else:
        if os.path.exists(OUTPUT_FILE):
            os.remove(OUTPUT_FILE)

        process_directory(SRC_DIR, SRC_DIR, OUTPUT_FILE)
        print(f"\n✅ Semua file berhasil diekstrak ke '{OUTPUT_FILE}'")
