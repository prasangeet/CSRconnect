import logging
import json
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from cloudinary.uploader import upload
from .models import Faculty
from sdgs.models import SDG

# Setup logging
logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def add_faculty(request):
    if request.method == 'POST':
        try:
            logging.debug("Received POST request to add faculty.")
            logging.debug(f"Request POST data: {request.POST.dict()}")


            # Get faculty details from the request
            name = request.POST.get('name', '').strip()
            specialization = request.POST.get('specialization', '').strip()
            email = request.POST.get('email', '').strip()
            phone_number = request.POST.get('phone_number', '').strip()

            logging.debug(f"Extracted data: Name: {name}, Email: {email}, Specialization: {specialization}, Phone: {phone_number}")

            # Parse areas of work (JSONField in model)
            areas_of_work = request.POST.get('areas_of_work', '[]')
            try:
                areas_of_work = json.loads(areas_of_work) if isinstance(areas_of_work, str) else areas_of_work
            except json.JSONDecodeError:
                areas_of_work = []
                logging.debug("Failed to parse 'areas_of_work'. Using empty list.")

            # Parse SDG contributions (JSONField in model)
            sdg_contributions = request.POST.get('sdg_contributions', '[]')
            try:
                sdg_contributions = json.loads(sdg_contributions) if isinstance(sdg_contributions, str) else sdg_contributions
                sdg_contributions = [int(num) for num in sdg_contributions if isinstance(num, (int, str)) and str(num).isdigit()]
            except json.JSONDecodeError:
                sdg_contributions = []
                logging.debug("Failed to parse 'sdg_contributions'. Using empty list.")

            # Validate required PDF file
            if 'proposal_pdf' not in request.FILES:
                logging.debug("Proposal PDF file is missing.")
                return JsonResponse({'error': 'Proposal PDF file is required'}, status=400)
            
            proposal_pdf = request.FILES['proposal_pdf']
            logging.debug(f"Received proposal PDF: {proposal_pdf.name}")

            # Handle optional profile picture
            profile_picture_url = None
            if 'profile_picture' in request.FILES:
                profile_pic = request.FILES['profile_picture']
                logging.debug(f"Received profile picture: {profile_pic.name}")
                profile_upload = upload(profile_pic)
                profile_picture_url = profile_upload['url']
                logging.debug(f"Uploaded profile picture to Cloudinary: {profile_picture_url}")

            # Upload proposal PDF to Cloudinary
            logging.debug("Uploading proposal PDF to Cloudinary...")
            pdf_upload = upload(proposal_pdf, resource_type="raw")
            logging.debug(f"Uploaded proposal PDF to Cloudinary: {pdf_upload['url']}")

            # Create faculty object
            faculty = Faculty.objects.create(
                name=name,
                specialization=specialization,
                email=email,
                phone_number=phone_number,
                areas_of_work=areas_of_work,
                sdg_contributions=sdg_contributions,
                proposal_pdf_url=pdf_upload['url'],
                profile_picture_url=profile_picture_url
            )

            logging.debug(f"Faculty {faculty.name} (ID: {faculty.id}) added successfully.")

            # Link faculty to SDGs
            sdgs = SDG.objects.filter(number__in=sdg_contributions)
            faculty.sdgs.set(sdgs)
            logging.debug(f"Linked faculty {faculty.id} to SDGs: {[sdg.number for sdg in sdgs]}")

            return JsonResponse({
                'message': 'Faculty added successfully',
                'faculty_id': faculty.id,
                'faculty': {
                    'name': faculty.name,
                    'email': faculty.email,
                    'specialization': faculty.specialization,
                    'areas_of_work': faculty.areas_of_work,
                    'sdg_contributions': sdg_contributions,
                    'linked_sdgs': [{'id': sdg.id, 'number': sdg.number, 'name': sdg.name} for sdg in sdgs],
                    'phone_number': faculty.phone_number,
                    'proposal_pdf_url': faculty.proposal_pdf_url,
                    'profile_picture_url': faculty.profile_picture_url
                }
            })

        except Exception as e:
            logging.debug(f"Error adding faculty: {str(e)}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    logging.debug("Invalid request method received for add_faculty.")
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_faculties(request):
    try:
        logging.debug("Fetching all faculty records.")
        faculties = Faculty.objects.all()

        faculty_list = [{
            'id': faculty.id,
            'name': faculty.name,
            'email': faculty.email,
            'specialization': faculty.specialization,
            'areas_of_work': faculty.areas_of_work,
            'sdg_contributions': faculty.sdg_contributions,
            'linked_sdgs': [{'id': sdg.id, 'number': sdg.number, 'name': sdg.name} for sdg in faculty.sdgs.all()],
            'phone_number': faculty.phone_number,
            'proposal_pdf_url': faculty.proposal_pdf_url,
            'profile_picture_url': faculty.profile_picture_url
        } for faculty in faculties]

        logging.debug(f"Successfully retrieved {len(faculty_list)} faculty records.")
        return JsonResponse(faculty_list, safe=False)

    except Exception as e:
        logging.debug(f"Error fetching faculties: {str(e)}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)


def get_csrf_token(request):
    token = get_token(request)
    logging.debug(f"Generated CSRF token: {token}")
    return JsonResponse({"csrfToken": token})
