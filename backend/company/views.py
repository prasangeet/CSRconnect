from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import cloudinary.uploader
from .models import CompanyDetails
from .serializers import CompanyDetailsSerializer, CompanyCreateSerializer, CompanyProjectSerializer, CompanyEditSerializer

@api_view(["POST"])
def add_company_by_name(request):
    company_name = request.data.get("name")
    if not company_name:
        return Response({"error": "Company name is required"}, status=status.HTTP_400_BAD_REQUEST)

    company = CompanyDetails.objects.create(name=company_name)
    return Response({"company": {"id": company.id, "name": company.name}}, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def fetch_all_companies(request):
    companies = CompanyDetails.objects.all()
    serializer = CompanyDetailsSerializer(companies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def fetch_company_details(request, company_id):
    company = get_object_or_404(CompanyDetails, id=company_id)
    serializer = CompanyDetailsSerializer(company)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def add_company(request):
    serializer = CompanyCreateSerializer(data=request.data)
    if serializer.is_valid():
        logo_file = request.FILES.get("logo")
        if logo_file:
            upload_result = cloudinary.uploader.upload(logo_file, folder="company_logos/")
            serializer.validated_data["logo"] = upload_result.get("secure_url")
        
        company = serializer.save()
        return Response({
            "message": "Company added successfully",
            "company": {"id": company.id, "name": company.name, "logo": company.logo}
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def update_company_details(request, company_id):
    company = get_object_or_404(CompanyDetails, id=company_id)
    serializer = CompanyEditSerializer(company, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Company details updated successfully.",
            "company": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def fetch_company_projects(request, company_id):
    company = get_object_or_404(CompanyDetails, id=company_id)
    serializer = CompanyProjectSerializer(company)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def add_csr_policy(request, company_id):
    company = get_object_or_404(CompanyDetails, id=company_id)

    csr_file = request.FILES.get("csr_policy")
    if not csr_file:
        return Response({"error": "CSR policy file is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        upload_result = cloudinary.uploader.upload(
            csr_file,
            folder="csr_policies/",
            resource_type="raw",  # for PDFs and non-image files
        )
        company.csr_policy = upload_result.get("secure_url")
        company.save()

        return Response({
            "message": "CSR policy uploaded successfully.",
            "company": {
                "id": company.id,
                "name": company.name,
                "csr_policy": company.csr_policy,
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Upload failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
def remove_csr_policy(request, company_id):
    company = get_object_or_404(CompanyDetails, id=company_id)
    
    if not company.csr_policy:
        return Response({"error": "No CSR policy to remove."}, status=status.HTTP_400_BAD_REQUEST)

    company.csr_policy = None
    company.save()

    return Response({
        "message": "CSR policy removed successfully.",
        "company": {
            "id": company.id,
            "name": company.name,
            "csr_policy": company.csr_policy,
        }
    }, status=status.HTTP_200_OK)