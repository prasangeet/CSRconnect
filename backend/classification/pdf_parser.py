import pdfplumber
import pandas as pd

def extract_pdf_table_to_csv(pdf_file):
    with pdfplumber.open(pdf_file) as pdf:
        all_tables = []
        
        for page in pdf.pages:
            table = page.extract_table()
            if table:
                all_tables.extend(table)

    if all_tables:
        df = pd.DataFrame(all_tables)
        csv_path = "extracted_data.csv"
        df.to_csv(csv_path, index=False, header=False)
        return csv_path
    return None
