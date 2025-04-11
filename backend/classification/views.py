from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.http import JsonResponse
from .pdf_parser import extract_pdf_content  # Updated to extract both text & tables
from .gemini_service import classify_sdg_with_gemini
from .models import (
    SDGClassification, ProgressOverview, Objectives, 
    KeyOutcomes, Challenges, Stakeholders, FacultiesLinked
)
from faculty.models import Faculty
from stakeholders.models import StakeholderUser
from .serializers import (
    SDGClassificationSerializer, ProgressOverviewSerializer,
    ObjectivesSerializer, KeyOutcomesSerializer,
    ChallengesSerializer, StakeholdersSerializer,
    FacultiesLinkedSerializer, ProjectPartialUpdateSerializer
)
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

    # ✅ Extract file and optional metadata
    pdf_file = request.FILES["file"]
    extracted_text = extract_pdf_content(pdf_file)

    if not extracted_text:
        return Response({"error": "Failed to extract content from PDF"}, status=500)

    extra_prompt = request.data.get("extra_prompt", "")
    company_id = request.data.get("company_id", "").strip()

    logging.debug(f"Received extra_prompt: {extra_prompt}")
    logging.debug(f"Received company_id: {company_id}")

    # ✅ Validate company_id
    if not company_id.isdigit():
        return Response({"error": "Invalid or missing company_id"}, status=400)

    # ✅ Call Gemini classification with valid company_id
    sdg_results = classify_sdg_with_gemini(extracted_text, company_id, extra_prompt)

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

@api_view(["GET"])
def get_project_data(request, project_id):
    """
    Fetch project data by project ID.
    """
    try:
        classification = SDGClassification.objects.get(id=project_id)
        serializer = SDGClassificationSerializer(classification)
        return JsonResponse(serializer.data, safe=False)
    except SDGClassification.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)
    

## Put apis

@api_view(["PUT"])
def update_project_details(request, projectId):
    """
    Update the core details of a specific project (SDGClassification).
    """
    try:
        classification = SDGClassification.objects.get(id=projectId)
        serializer = ProjectPartialUpdateSerializer(classification, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    except SDGClassification.DoesNotExist:
        return JsonResponse({"error": "Project not found"}, status=404)

@api_view(["PUT"])
def update_progress_overview(request, projectId):
    """
    Update the progress overview of a specific project.
    """
    try:
        progress = ProgressOverview.objects.get(sdg_classification_id=projectId)
        serializer = ProgressOverviewSerializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status= 200)
        return JsonResponse(serializer.errors, status=400)
    except ProgressOverview.DoesNotExist:
        return JsonResponse({"error": "Project Overview not found"}, status=404)
    

@api_view(["PUT"])
def update_objectives(request, projectId):
    """
    Update the objectives of a specific project.
    """
    try:
        objectives = Objectives.objects.get(sdg_classification_id=projectId)
        serializer = ObjectivesSerializer(objectives, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    except Objectives.DoesNotExist:
        return JsonResponse({"error": "Project Objectives not found"}, status=404)
    

@api_view(["PUT"])
def update_key_outcomes(request, projectId):
    """
    Update the key outcomes of a specific project.
    """
    try:
        outcomes = KeyOutcomes.objects.get(sdg_classification_id=projectId)
        serializer = KeyOutcomesSerializer(outcomes, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    except KeyOutcomes.DoesNotExist:
        return JsonResponse({"error": "Project Key Outcomes not found"}, status=404)
    

@api_view(["PUT"])
def update_challenges(request, projectId):
    """
    Update the challenges of a specific project.
    """
    try:
        challenges = Challenges.objects.get(sdg_classification_id=projectId)
        serializer = ChallengesSerializer(challenges, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    except Challenges.DoesNotExist:
        return JsonResponse({"error": "Project Challenges not found"}, status=404)
    
## Post Apis
    
@api_view(["POST"])
def link_stakeholder_with_project(request, projectId, stakeholderId):
    """
    Link a stakeholder (by stakeholderId) to a specific project (by projectId).
    """
    try:
        project = SDGClassification.objects.get(pk=projectId)
        stakeholder = StakeholderUser.objects.get(pk=stakeholderId)

        # Check if already linked
        if Stakeholders.objects.filter(sdg_classification=project, stakeholder=stakeholder).exists():
            return JsonResponse({"error": "This stakeholder is already linked to the project."}, status=400)

        data = {
            "sdg_classification": project.id,
            "stakeholder": stakeholder.id,
            "role": request.data.get("role", "")
        }

        serializer = StakeholdersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    except SDGClassification.DoesNotExist:
        return JsonResponse({"error": "Project not found."}, status=404)
    except StakeholderUser.DoesNotExist:
        return JsonResponse({"error": "Stakeholder not found."}, status=404)
    
@api_view(["POST"])
def link_faculty_with_project(request, projectId, facultyId):
    """
    Link a faculty (by facultyId) to a specific project (by projectId).
    """
    try:
        project = SDGClassification.objects.get(pk=projectId)
        faculty = Faculty.objects.get(pk=facultyId)

        # Check if already linked
        if FacultiesLinked.objects.filter(sdg_classification=project, faculty=faculty).exists():
            return JsonResponse({"error": "This faculty is already linked to the project."}, status=400)

        data = {
            "sdg_classification": project.id,
            "faculty": faculty.id,
            "role": request.data.get("role", "")
        }

        serializer = FacultiesLinkedSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    except SDGClassification.DoesNotExist:
        return JsonResponse({"error": "Project not found."}, status=404)
    except Faculty.DoesNotExist:
        return JsonResponse({"error": "Faculty not found."}, status=404)
    

## Get APIs


def get_linked_faculties(request, projectId):
    """
    Fetch all faculties linked to a specific project.
    """
    try:
        project = SDGClassification.objects.get(pk=projectId)
        linked_faculties = FacultiesLinked.objects.filter(sdg_classification=project)
        serializer = FacultiesLinkedSerializer(linked_faculties, many=True)
        return JsonResponse(serializer.data, safe=False)
    except SDGClassification.DoesNotExist:
        return JsonResponse({"error": "Project not found."}, status=404)