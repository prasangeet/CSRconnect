import google.generativeai as genai
from django.conf import settings
import pandas as pd
import json

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def classify_sdg_with_gemini(csv_path):
    """Send extracted CSV data to Gemini for SDG classification."""
    df = pd.read_csv(csv_path)

    # Convert DataFrame to structured text
    project_data = df.to_dict(orient="records")

    # Split project_data into smaller chunks to avoid truncation
    batch_size = 10  # Adjust the batch size as needed
    batches = [project_data[i:i + batch_size] for i in range(0, len(project_data), batch_size)]

    all_classifications = []

    # Process each batch separately
    for batch in batches:
        # Convert batch to JSON string for Gemini
        batch_data = json.dumps(batch, indent=2)

        prompt = f"""
        You are an expert in classifying CSR projects according to the UN Sustainable Development Goals (SDGs). 
        Given the following project data, identify the most relevant SDG for each project.

        Each project contains the following details:
        - CSR Focus Area (e.g., education, health, environment, etc.)
        - Implementing Organisation (name of the organization implementing the project)
        - Project Type (Annual/Ongoing)
        - Implementation Status (whether the project is ongoing, under implementation, completed, etc.)
        - District (the district where the project is being implemented)
        - State (the state where the project is being implemented)

        Please return the classification in strict JSON format with the following structure(nothing else should be included in the response not even JSON IN THE FRONT, Also do not include newline characters in the fields of the JSON):
        [
            {{
                "implementing_organisation": "XYZ",
                "sdg_number": "1",
                "sdg_name": "No Poverty",
                "district": "District Name",
                "state": "State Name",
                "project_status": "Under Implementation",
                "project_type": "Ongoing"
            }},
            {{
                "implementing_organisation": "ABC",
                "sdg_number": "3",
                "sdg_name": "Good Health and Well-being",
                "district": "Another District",
                "state": "Another State",
                "project_status": "Completed",
                "project_type": "Annual"
            }}
        ]

        Projects:
        {batch_data}
        """

        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)

        # Debugging: print raw response
        print("Raw response from Gemini:", response.text)

        # Trim extra spaces or newlines in the response
        response_text = response.text.strip()

        if not response_text:
            print("Response is empty.")
            return {"error": "Empty response from Gemini"}

        try:
            # Try parsing response to JSON
            classification_data = json.loads(response_text)
            all_classifications.extend(classification_data)
        except json.JSONDecodeError as e:
            # If JSON parsing fails, print the error and return a custom error message
            print("Failed to parse JSON:", e)
            print("Response text that failed to parse:", response_text)
            return {"error": "Failed to parse Gemini response"}

    return all_classifications
