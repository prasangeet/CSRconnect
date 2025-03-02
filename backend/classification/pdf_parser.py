import pdfplumber

def extract_pdf_content(pdf_file):
    extracted_text = ""

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

            table = page.extract_table()
            if table:
                for row in table:
                    # ✅ Replace None with empty string to prevent TypeError
                    row = [str(cell) if cell is not None else "" for cell in row]
                    extracted_text += " | ".join(row) + "\n"

    return extracted_text if extracted_text else None
