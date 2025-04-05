from django.shortcuts import render
from django.http import JsonResponse
from company.services.gemini_company_service import enrich_company_details
import cloudinary.uploader
from .models import CompanyDetails
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def enrich_company(request):
    if request.method == "POST":
        company_name = request.POST.get("company_name")
        response = enrich_company_details(company_name)
        return JsonResponse(response, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
    
@csrf_exempt
def add_company(request):
    if request.method == "POST":
        name = request.POST.get("name")
        industry = request.POST.get("industry")
        location = request.POST.get("location")
        website = request.POST.get("website")
        description = request.POST.get("description")
        logo_file = request.FILES.get("logo")

        if not name:
            return JsonResponse({"error": "Company name is required"}, status=400)
        
        if CompanyDetails.object.filter(name__iexact=name).exists():
            return JsonResponse({"message": "Company already exists"}, status=200)
        
        logo_url = None
        if logo_file:
            upload_result = cloudinary.uploader.upload(logo_file)
            logo_url = upload_result.get("secure_url")

        company = CompanyDetails.objects.create(
            name=name,
            industry=industry,
            location=location,
            website=website,
            description=description,
            logo=logo_url
        )

        return JsonResponse({
            "message": "Company added successfully",
            "company": {
                "id": company.id,
                "name": company.name,
                "logo": logo_url
            }
        })
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def update_company_details(request, company_id):
    if request.method == "POST":
        try:
            company = CompanyDetails.objects.get(id=company_id)
        except CompanyDetails.DoesNotExist:
            return JsonResponse({"error": "Company not found"}, status=404)

        company.name = request.POST.get("name", company.name)
        company.industry = request.POST.get("industry", company.industry)
        company.location = request.POST.get("location", company.location)
        company.website = request.POST.get("website", company.website)
        company.description = request.POST.get("description", company.description)

        logo_file = request.FILES.get("logo")
        if logo_file:
            upload_result = cloudinary.uploader.upload(logo_file, folder="company_logos/")
            company.logo = upload_result.get("secure_url")

        company.save()

        return JsonResponse({
            "message": "Company updated successfully",
            "company": {
                "id": company.id,
                "name": company.name,
                "logo": company.logo
            }
        })

    return JsonResponse({"error": "Invalid request method"}, status=400)
