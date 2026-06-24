#!/usr/bin/env python3
"""Extract table of contents and first few pages of each physics PDF to understand structure."""
import fitz  # pymupdf
import os
import json

UPLOAD_DIR = "/home/z/my-project/upload"
OUT_DIR = "/home/z/my-project/extracted"
os.makedirs(OUT_DIR, exist_ok=True)

pdfs = sorted([f for f in os.listdir(UPLOAD_DIR) if f.endswith(".pdf")])

for pdf_name in pdfs:
    pdf_path = os.path.join(UPLOAD_DIR, pdf_name)
    print(f"\n{'='*80}\nFILE: {pdf_name}\n{'='*80}")
    try:
        doc = fitz.open(pdf_path)
        print(f"Pages: {len(doc)}")
        toc = doc.get_toc()
        if toc:
            print(f"TOC entries: {len(toc)}")
            for lvl, title, page in toc[:60]:
                print(f"  {'  '*(lvl-1)}[{lvl}] p{page}: {title}")
        else:
            print("No TOC found.")
        doc.close()
    except Exception as e:
        print(f"ERROR: {e}")
