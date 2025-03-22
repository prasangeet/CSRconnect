import json
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from cloudinary.uploader import upload
from .models import Faculty
from sdgs.models import SDG

@csrf_exempt
def add_faculty(request):
    if request.method == 'POST':
        try:
            # Extract faculty details
            name = request.POST.get('name', '').strip()
            specialization = request.POST.get('specialization', '').strip()
            email = request.POST.get('email', '').strip()
            phone_number = request.POST.get('phone_number', '').strip()

            # Parse areas of work
            areas_of_work = request.POST.get('areas_of_work', '[]')
            try:
                areas_of_work = json.loads(areas_of_work) if isinstance(areas_of_work, str) else areas_of_work
            except json.JSONDecodeError:
                areas_of_work = []

            # Parse SDG contributions
            sdg_contributions = request.POST.get('sdg_contributions', '[]')
            try:
                sdg_contributions = json.loads(sdg_contributions) if isinstance(sdg_contributions, str) else sdg_contributions
                sdg_contributions = [int(num) for num in sdg_contributions if isinstance(num, (int, str)) and str(num).isdigit()]
            except json.JSONDecodeError:
                sdg_contributions = []

            # Validate required PDF file
            if 'proposal_pdf' not in request.FILES:
                return JsonResponse({'error': 'Proposal PDF file is required'}, status=400)
            
            proposal_pdf = request.FILES['proposal_pdf']

            # Upload profile picture to Cloudinary under 'csr_connect_avatars' folder
            profile_picture_url = None
            if 'profile_picture' in request.FILES:
                profile_pic = request.FILES['profile_picture']
                profile_upload = upload(profile_pic, folder="csr_connect_avatars")
                profile_picture_url = profile_upload['url']

            # Upload proposal PDF to Cloudinary
            pdf_upload = upload(proposal_pdf, resource_type="raw", folder="csr_connect_pdfs", format="pdf")
            proposal_pdf_url = pdf_upload['url'].replace('/upload/', '/upload/raw/')
            
            # Create faculty object
            faculty = Faculty.objects.create(
                name=name,
                specialization=specialization,
                email=email,
                phone_number=phone_number,
                areas_of_work=areas_of_work,
                sdg_contributions=sdg_contributions,
                proposal_pdf_url=proposal_pdf_url,
                profile_picture_url=profile_picture_url
            )

            # Link faculty to SDGs
            sdgs = SDG.objects.filter(number__in=sdg_contributions)
            faculty.sdgs.set(sdgs)

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
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_faculties(request):
    try:
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

        return JsonResponse(faculty_list, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})
