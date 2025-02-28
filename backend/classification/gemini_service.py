import google.generativeai as genai
from django.conf import settings
import pandas as pd
import json
import time
import re
import google.api_core.exceptions
from .models import SDGClassification  # Import the model

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def classify_sdg_with_gemini(csv_path):
    """Send extracted CSV data to Gemini for SDG classification and store results in PostgreSQL."""
    df = pd.read_csv(csv_path)

    # Convert DataFrame to structured text
    project_data = df.to_dict(orient="records")

    # Split project_data into smaller chunks to avoid truncation
    batch_size = 30  # Reduce batch size to avoid exceeding token limits
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
        - You should not insert any null values in the response.

        Please return the classification in strict JSON format with the following structure (nothing else should be included in the response, not even 'JSON' at the beginning, and do not include newline characters in the fields):

        [
            {{"implementing_organisation": "XYZ", "sdg_number": "1", "sdg_name": "No Poverty", "district": "District Name", "state": "State Name", "project_status": "Under Implementation", "project_type": "Ongoing"}},
            {{"implementing_organisation": "ABC", "sdg_number": "3", "sdg_name": "Good Health and Well-being", "district": "Another District", "state": "Another State", "project_status": "Completed", "project_type": "Annual"}}
        ]

        Projects:
        {batch_data}
        """

        model = genai.GenerativeModel("gemini-1.5-pro")

        # Handle API Quota Exhaustion (Retry after 60 seconds)
        for attempt in range(3):  # Retry up to 3 times
            try:
                response = model.generate_content(prompt)

                # Debugging: print raw response
                print("Raw response from Gemini:", response.text)

                # Trim extra spaces or newlines in the response
                response_text = response.text.strip()

                if not response_text:
                    print("⚠️ Response is empty.")
                    return {"error": "Empty response from Gemini"}

                # Remove any unexpected characters (e.g., backticks, extra newlines)
                cleaned_response = re.sub(r'```json|```', '', response_text).strip()

                # Try parsing response to JSON
                classification_data = json.loads(cleaned_response)
                all_classifications.extend(classification_data)

                # ✅ **Save to PostgreSQL**
                for item in classification_data:
                    SDGClassification.objects.create(
                        implementing_organisation=item.get("implementing_organisation", ""),
                        sdg_number=int(item.get("sdg_number", 0)),
                        sdg_name=item.get("sdg_name", ""),
                        district=item.get("district", ""),
                        state=item.get("state", ""),
                        project_status=item.get("project_status", ""),
                        project_type=item.get("project_type", ""),
                    )

                print("✅ Data successfully saved to PostgreSQL")
                time.sleep(10)  # Wait before next request
                break  # Exit loop if successful

            except google.api_core.exceptions.ResourceExhausted:
                print(f"⚠️ Gemini API quota exceeded. Retrying in 60 seconds... (Attempt {attempt + 1}/3)")
                time.sleep(60)  # Wait before retrying

            except json.JSONDecodeError as e:
                print("❌ Failed to parse JSON:", e)
                print("Response text that failed to parse:", response_text)
                return {"error": "Failed to parse Gemini response"}

            except Exception as e:
                print("🔥 Unexpected error:", e)
                return {"error": str(e)}

    return all_classifications
