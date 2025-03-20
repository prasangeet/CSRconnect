from django.http import JsonResponse
from django.middleware.csrf import get_token
from cloudinary.uploader import upload
from .models import Faculty
from django.views.decorators.csrf import csrf_exempt

import json
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def add_faculty(request):
    if request.method == 'POST':
        try:
            logging.debug("Received a POST request to add faculty.")
            
            # Print request content for debugging
            logging.debug(f"Request POST data: {request.POST}")
            logging.debug(f"Request FILES data: {request.FILES}")

            name = request.POST.get('name', '')
            specialization = request.POST.get('specialization', '')
            areas_of_work = request.POST.getlist('areas_of_work[]')
            sdg_contribution = request.POST.get('sdg_contribution', '')

            # Check if file exists
            if 'proposal_pdf' not in request.FILES:
                logging.error("Proposal PDF not found in request.")
                return JsonResponse({'error': 'Proposal PDF file is required'}, status=400)

            proposal_pdf = request.FILES['proposal_pdf']
            logging.debug(f"Received file: {proposal_pdf.name}, size: {proposal_pdf.size} bytes")

            # Upload to Cloudinary
            logging.debug("Uploading file to Cloudinary...")
            cloudinary_response = upload(proposal_pdf, resource_type="raw")
            logging.debug(f"Cloudinary upload response: {cloudinary_response}")

            # Save faculty data to the database
            faculty = Faculty.objects.create(
                name=name,
                specialization=specialization,
                areas_of_work=areas_of_work,
                sdg_contribution=sdg_contribution,
                proposal_pdf_url=cloudinary_response['url']
            )

            logging.debug(f"Faculty {faculty.name} added successfully with ID {faculty.id}.")

            return JsonResponse({
                'message': 'Faculty added successfully',
                'faculty_id': faculty.id,
                'faculty': {
                    'name': faculty.name,
                    'specialization': faculty.specialization,
                    'areas_of_work': faculty.areas_of_work,
                    'sdg_contribution': faculty.sdg_contribution,
                    'proposal_pdf_url': faculty.proposal_pdf_url
                }
            })

        except Exception as e:
            logging.exception(f"Error adding faculty: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_faculties(request):
    try:
        logging.debug("Fetching all faculties...")
        faculties = Faculty.objects.all().values()
        faculty_list = list(faculties)
        logging.debug(f"Faculties fetched: {faculty_list}")

        return JsonResponse(faculty_list, safe=False)

    except Exception as e:
        logging.exception(f"Error fetching faculties: {e}")
        return JsonResponse({'error': str(e)}, status=500)


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})
