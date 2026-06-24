#!/usr/bin/env python3
"""Extract text from physics PDFs and save to txt files for analysis."""
import fitz
import os

UPLOAD_DIR = "/home/z/my-project/upload"
OUT_DIR = "/home/z/my-project/extracted"
os.makedirs(OUT_DIR, exist_ok=True)

# Focus on main textbooks first (4 books, skip activity books for primary content)
MAIN_BOOKS = [
    "فيزياء تاسع الفصل الأول.pdf",
    "فيزياء تاسع الفصل الثاني.pdf",
    "فيزياء عاشر الفصل الأول.pdf",
    "فيزياء عاشر الفصل الثاني.pdf",
]

for pdf_name in MAIN_BOOKS:
    pdf_path = os.path.join(UPLOAD_DIR, pdf_name)
    out_path = os.path.join(OUT_DIR, pdf_name.replace(".pdf", ".txt"))
    print(f"\nExtracting: {pdf_name}")
    try:
        doc = fitz.open(pdf_path)
        all_text = []
        for i, page in enumerate(doc):
            text = page.get_text("text")
            all_text.append(f"\n=== PAGE {i+1} ===\n{text}")
        doc.close()
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(all_text))
        size = os.path.getsize(out_path)
        print(f"  Saved {size:,} chars to {out_path}")
    except Exception as e:
        print(f"  ERROR: {e}")

print("\nDone.")
