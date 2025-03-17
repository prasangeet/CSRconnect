from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from django.conf import settings
import json
import time
import re
from .models import SDGClassification  # Import the model

# Initialize Langchain Gemini model
gemini_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=settings.GEMINI_API_KEY)

def classify_sdg_with_gemini(extracted_text):
    """Classify SDG using Gemini via Langchain and store results in PostgreSQL."""
    if not extracted_text:
        return {"error": "No extracted text provided"}

    # Split text into smaller chunks to avoid token limits
    batch_size = 3000  
    batches = [extracted_text[i:i + batch_size] for i in range(0, len(extracted_text), batch_size)]

    all_classifications = []

    # Process each batch
    for batch in batches:
        prompt = f"""
        You are an expert in classifying CSR projects according to the UN Sustainable Development Goals (SDGs). 
        Given the following extracted project information, identify the most relevant SDG for each project.

        The text contains:
        - CSR Focus Area (e.g., education, health, environment, etc.)
        - Implementing Organisation (organization implementing the project)
        - Project Type (Annual/Ongoing)
        - Implementation Status (ongoing, completed, etc.)
        - District (where the project is being implemented)
        - State (state where the project is being implemented)
        - Company Name (if available at the top)

        Please return classifications in strict JSON format:
        [
            {{"implementing_organisation": "XYZ", "sdg_number": "1", "sdg_name": "No Poverty", "district": "District Name", "state": "State Name", "project_status": "Under Implementation", "project_type": "Ongoing", "company_name": "ABC"}},
            {{"implementing_organisation": "ABC", "sdg_number": "3", "sdg_name": "Good Health and Well-being", "district": "Another District", "state": "Another State", "project_status": "Completed", "project_type": "Annual", "company_name": "XYZ"}}
        ]

        Extracted Text:
        {batch}
        """

        for attempt in range(3):  # Retry up to 3 times
            try:
                response = gemini_model([
                    HumanMessage(content=prompt)
                ])

                # Trim extra spaces or newlines
                response_text = response.content.strip()

                if not response_text:
                    print("⚠️ Empty response from Gemini.")
                    return {"error": "Empty response from Gemini"}

                # Remove unexpected characters like backticks
                cleaned_response = re.sub(r'```json|```', '', response_text).strip()

                # Parse JSON response
                classification_data = json.loads(cleaned_response)
                all_classifications.extend(classification_data)

                # ✅ Save data to PostgreSQL
                for item in classification_data:
                    SDGClassification.objects.create(
                        implementing_organisation=item.get("implementing_organisation", ""),
                        sdg_number=int(item.get("sdg_number", 0)),
                        sdg_name=item.get("sdg_name", ""),
                        district=item.get("district", ""),
                        state=item.get("state", ""),
                        project_status=item.get("project_status", ""),
                        project_type=item.get("project_type", ""),
                        company_name=item.get("company_name", "")
                    )

                print("✅ Data successfully saved to PostgreSQL.")
                time.sleep(10)  # Wait before the next request
                break  # Exit loop if successful

            except json.JSONDecodeError as e:
                print("❌ JSON Parsing Error:", e)
                print("Response text that failed to parse:", response_text)
                return {"error": "Failed to parse Gemini response"}

            except Exception as e:
                print("🔥 Unexpected Error:", e)
                return {"error": str(e)}

    return all_classifications
