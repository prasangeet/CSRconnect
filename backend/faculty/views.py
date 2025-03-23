from django.http import JsonResponse
from django.middleware.csrf import get_token
from cloudinary.uploader import upload
from .models import Faculty
from sdgs.models import SDG  # Import the SDG model
from django.views.decorators.csrf import csrf_exempt

import json

@csrf_exempt
def add_faculty(request):
    if request.method == 'POST':
        try:
            # Get basic faculty data
            name = request.POST.get('name', '')
            specialization = request.POST.get('specialization', '')
            email = request.POST.get('email', '')
            phone_number = request.POST.get('phone_number', '')
            
            # Handle areas of work
            areas_of_work_list = request.POST.getlist('areas_of_work[]') 
            areas_of_work = areas_of_work_list if areas_of_work_list else []
            
            # Get SDG contributions as a list of numbers
            sdg_numbers = []
            if 'sdg_contributions[]' in request.POST:
                sdg_numbers = [int(num) for num in request.POST.getlist('sdg_contributions[]') if num.isdigit()]
            elif 'sdg_contributions' in request.POST:
                try:
                    raw_input = request.POST.get('sdg_contributions')
                    if isinstance(raw_input, str):
                        # Try parsing as JSON array first
                        try:
                            sdg_numbers = [int(num) for num in json.loads(raw_input) if isinstance(num, (int, str)) and str(num).isdigit()]
                        except json.JSONDecodeError:
                            # If not JSON, try comma-separated values
                            sdg_numbers = [int(num.strip()) for num in raw_input.split(',') if num.strip().isdigit()]
                    elif isinstance(raw_input, list):
                        sdg_numbers = [int(num) for num in raw_input if isinstance(num, (int, str)) and str(num).isdigit()]
                except:
                    sdg_numbers = []

            # Check if PDF file exists
            if 'proposal_pdf' not in request.FILES:
                return JsonResponse({'error': 'Proposal PDF file is required'}, status=400)

            proposal_pdf = request.FILES['proposal_pdf']
            
            # Handle optional profile picture
            profile_picture_url = None
            if 'profile_picture' in request.FILES:
                profile_pic = request.FILES['profile_picture']
                cloudinary_profile_response = upload(profile_pic)
                profile_picture_url = cloudinary_profile_response['url']

            # Upload PDF to Cloudinary
            cloudinary_response = upload(proposal_pdf, resource_type="raw")

            # Create the faculty object
            faculty = Faculty.objects.create(
                name=name,
                specialization=specialization,
                email=email,
                phone_number=phone_number,
                areas_of_work=areas_of_work,
                sdg_contributions=sdg_numbers,  # Store the numbers for reference
                proposal_pdf_url=cloudinary_response['url'],
                profile_picture_url=profile_picture_url
            )

            # Link faculty to SDG objects in the database
            if sdg_numbers:
                sdgs = SDG.objects.filter(number__in=sdg_numbers)
                for sdg in sdgs:
                    sdg.faculties_linked.add(faculty)

            # Get linked SDGs for the response
            linked_sdgs = [{
                'id': sdg.id,
                'number': sdg.number,
                'name': sdg.name
            } for sdg in faculty.sdgs.all()]

            return JsonResponse({
                'message': 'Faculty added successfully',
                'faculty_id': faculty.id,
                'faculty': {
                    'name': faculty.name,
                    'email': faculty.email,
                    'specialization': faculty.specialization,
                    'areas_of_work': faculty.areas_of_work,
                    'sdg_contributions': sdg_numbers,
                    'linked_sdgs': linked_sdgs,
                    'phone_number': faculty.phone_number,
                    'proposal_pdf_url': faculty.proposal_pdf_url,
                    'profile_picture_url': faculty.profile_picture_url
                }
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_faculties(request):
    try:
        # logging.debug("Fetching all faculties...")
        faculties = Faculty.objects.all().values()
        faculty_list = list(faculties)
        # logging.debug(f"Faculties fetched: {faculty_list}")

        return JsonResponse(faculty_list, safe=False)

    except Exception as e:
        # logging.exception(f"Error fetching faculties: {e}")
        return JsonResponse({'error': str(e)}, status=500)


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})
