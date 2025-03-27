import pdfplumber
import hashlib

def extract_pdf_content(pdf_file):
    extracted_text_list = []
    hasher = hashlib.sha256()

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text_list.append(text)
                hasher.update(text.encode("utf-8"))

            table = page.extract_table()
            if table:
                for row in table:
                    # ✅ Replace None with empty string to prevent TypeError
                    row = [str(cell) if cell is not None else "" for cell in row]
                    row_text = " | ".join(row)
                    extracted_text_list.append(row_text)
                    hasher.update(row_text.encode("utf-8"))

    extracted_text = "\n".join(extracted_text_list)
    file_hash = hasher.hexdigest()                

    return extracted_text if extracted_text else None , file_hash
