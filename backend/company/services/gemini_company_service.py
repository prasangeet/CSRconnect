from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from django.conf import settings
from ..models import CompanyDetails
import json
import re

gemini_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=settings.GEMINI_API_KEY)

def enrich_company_details(company_name):

    if not company_name:
        return {"error": "No company name provided"}
    
    existing = CompanyDetails.objects.filter(name__iexact=company_name).first()
    if existing:
        return {
            "message": "✅ Company already exi  sts",
            "data": {
                "name": existing.name,
                "industry": existing.industry,
                "location": existing.location,
                "website": existing.website,
                "description": existing.description
            }
        }
    
    prompt = f"""
        You are a company data analyst. Given a company name, your task is to return accurate and concise information about that company from public sources.
        Please return the result strictly in **valid JSON format only** using the following keys:
        - "name": Full official name of the company
        - "industry": The main sector or industry it operates in (e.g., Information Technology, Pharmaceuticals, Energy)
        - "location": City and country of its global headquarters
        - "website": The official website URL (must start with https://)
        - "description": A short 1-2 sentence summary of the company's main operations or core business
        
        Company Name: "{company_name}"
        
        Make sure:
        - You DO NOT include any commentary or explanation outside the JSON.
        - Avoid using placeholders or "N/A" – if information is truly missing, leave the value as an empty string "".
        - Use concise and reliable descriptions.
        
        Example Output Format:
        {{
            "name": "Infosys Limited",
            "industry": "Information Technology",
            "location": "Bengaluru, India",
            "website": "https://www.infosys.com",
            "description": "Infosys is a global leader in digital services and consulting, helping businesses across industries transform through technology."
        }}
        
        Now, generate the JSON output for: "{company_name}"
        """
    
    try:
        response = gemini_model([HumanMessage(content=prompt)])
        response_text = response.content.strip()
        cleaned = re.sub(r'```json|```', '', response_text)
        company_data = json.loads(cleaned)

        new_entry = CompanyDetails.objects.create(
            name=company_data.get("name", company_name),
            industry=company_data.get("industry", ""),
            location=company_data.get("location", ""),
            website=company_data.get("website", ""),
            description=company_data.get("description", "")
        )

        return {
            "message": "✅ Company data fetched and saved successfully",
            "data": {
                "name": new_entry.name,
                "industry": new_entry.industry,
                "location": new_entry.location,
                "website": new_entry.website,
                "description": new_entry.description
            }
        }
    
    except json.JSONDecodeError as e:
        return {"error": f"❌ JSON decoding failed: {str(e)}", "raw": response_text}
    
    except Exception as e:
        return {"error": f"🔥 Unexpected error: {str(e)}"}