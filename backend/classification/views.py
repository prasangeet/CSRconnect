from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .pdf_parser import extract_pdf_table_to_csv
from .gemini_service import classify_sdg_with_gemini

@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_pdf(request):
    if "file" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    pdf_file = request.FILES["file"]
    csv_path = extract_pdf_table_to_csv(pdf_file)

    if not csv_path:
        return Response({"error": "Failed to extract table from PDF"}, status=500)

    # Call Gemini for classification
    sdg_results = classify_sdg_with_gemini(csv_path)

    return Response({"classifications": sdg_results})
