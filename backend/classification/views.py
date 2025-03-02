from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .pdf_parser import extract_pdf_content  # Updated to extract both text & tables
from .gemini_service import classify_sdg_with_gemini
from .models import SDGClassification
from django.http import JsonResponse
from .serializers import SDGClassificationSerializer

@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_pdf(request):
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    pdf_file = request.FILES["file"]
    extracted_text = extract_pdf_content(pdf_file)  # Extract both text & tables

    if not extracted_text:
        return Response({"error": "Failed to extract content from PDF"}, status=500)

    # Call Gemini for classification
    sdg_results = classify_sdg_with_gemini(extracted_text)

    return Response({
        "extracted_text": extracted_text,
        "classifications": sdg_results
    })


@api_view(["GET"])
def get_sdg_classification(request):
    """Fetch all SDG classifications"""
    classifications = SDGClassification.objects.all().values()
    return JsonResponse(list(classifications), safe=False)

@api_view(["GET"])
def get_sdg_classified_data(request, sdg_number):
    """Fetch all projects classified under a specific SDG"""
    classifications = SDGClassification.objects.filter(sdg_number=sdg_number)
    serializer = SDGClassificationSerializer(classifications, many=True)
    return JsonResponse(serializer.data, safe=False)
