from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.http import JsonResponse
from .pdf_parser import extract_pdf_content  # Updated to extract both text & tables
from .gemini_service import classify_sdg_with_gemini
from .models import SDGClassification
from .serializers import SDGClassificationSerializer
import logging

@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_pdf(request):
    """
    Upload a PDF, extract content, classify SDGs using Gemini, and return results.
    Supports an optional `extra_prompt` parameter for additional instructions.
    """
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)
    
    logging.debug("Received Extra prompt: " + request.data.get("extra_prompt", ""))

    pdf_file = request.FILES["file"]
    extracted_text = extract_pdf_content(pdf_file)  # Extract both text & tables

    if not extracted_text:
        return Response({"error": "Failed to extract content from PDF"}, status=500)

    # ✅ Get additional prompt instructions from request, default to empty
    extra_prompt = request.data.get("extra_prompt", "")

    # ✅ Call Gemini for SDG classification
    sdg_results = classify_sdg_with_gemini(extracted_text, extra_prompt)

    # ✅ Check if classification succeeded
    if "error" in sdg_results:
        return Response({"error": sdg_results["error"]}, status=500)

    return Response({
        "message": "SDG classification completed successfully",
        "extracted_text": extracted_text,
        "classified_projects_count": len(sdg_results["classified_projects"]),
        "classifications": sdg_results["classified_projects"]
    })


@api_view(["GET"])
def get_sdg_classification(request):
    """
    Fetch all SDG classifications from the database.
    """
    classifications = SDGClassification.objects.all()
    serializer = SDGClassificationSerializer(classifications, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def get_sdg_classified_data(request, sdg_number):
    """
    Fetch all projects classified under a specific SDG.
    """
    classifications = SDGClassification.objects.filter(sdg_number=sdg_number)
    serializer = SDGClassificationSerializer(classifications, many=True)
    return JsonResponse(serializer.data, safe=False)
