import json
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from cloudinary.uploader import upload
from django.shortcuts import redirect
from .models import Faculty
from sdgs.models import SDG
from .serializers import FacultySerializer

@csrf_exempt
def add_faculty(request):
    if request.method == 'POST':
        try:
            # Get faculty details from request
            name = request.POST.get('name', '').strip()
            specialization = request.POST.get('specialization', '').strip()
            email = request.POST.get('email', '').strip()
            phone_number = request.POST.get('phone_number', '').strip()

            # Parse areas of work (JSONField in model)
            areas_of_work = request.POST.get('areas_of_work', '[]')
            try:
                areas_of_work = json.loads(areas_of_work) if isinstance(areas_of_work, str) else areas_of_work
            except json.JSONDecodeError:
                areas_of_work = []

            # Parse SDG contributions (JSONField in model)
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

            # Handle optional profile picture
            profile_picture_url = None
            if 'profile_picture' in request.FILES:
                profile_pic = request.FILES['profile_picture']
                profile_upload = upload(profile_pic, folder="csr_connect_avatars")
                profile_picture_url = profile_upload['url']

            # Upload proposal PDF to Cloudinary
            pdf_upload = upload(proposal_pdf, resource_type="raw", folder="csr_connect_pdfs", format="pdf")
            proposal_pdf_url = pdf_upload['url']

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

            # Link faculty to SDGs using faculties_linked
            sdgs = SDG.objects.filter(number__in=sdg_contributions)
            for sdg in sdgs:
                sdg.faculties_linked.add(faculty)

            return JsonResponse({
                'message': 'Faculty added successfully',
                'faculty_id': faculty.id,
                'faculty': FacultySerializer(faculty).data
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_faculties(request):
    try:
        faculties = Faculty.objects.all()
        serializer = FacultySerializer(faculties, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_faculty_by_id(request, faculty_id):
    try:
        faculty = Faculty.objects.get(id=faculty_id)
        serializer = FacultySerializer(faculty)
        return JsonResponse(serializer.data, safe=False)
    except Faculty.DoesNotExist:
        return JsonResponse({'error': 'Faculty not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


def view_faculty_pdf(request, faculty_id):
    try:
        faculty = Faculty.objects.get(id=faculty_id)

        if not faculty.proposal_pdf_url:
            return JsonResponse({'error': 'No proposal PDF found for this faculty'}, status=404)

        pdf_url = faculty.proposal_pdf_url

        if '/upload/' in pdf_url and '/upload/raw/' not in pdf_url:
            pdf_url = pdf_url.replace('/upload/', '/upload/raw/')

        return redirect(pdf_url)

    except Faculty.DoesNotExist:
        return JsonResponse({'error': 'Faculty not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def view_sdg_pdf(request, sdg_id=None, sdg_number=None):
    try:
        if sdg_id:
            sdg = SDG.objects.get(id=sdg_id)
        elif sdg_number:
            sdg = SDG.objects.get(number=sdg_number)
        else:
            return JsonResponse({'error': 'SDG ID or number is required'}, status=400)

        document_url = getattr(sdg, 'document_url', None)

        if not document_url:
            return JsonResponse({'error': 'No PDF document associated with this SDG'}, status=404)

        return redirect(document_url)

    except SDG.DoesNotExist:
        return JsonResponse({'error': 'SDG not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def debug_pdf_url(request, faculty_id):
    try:
        faculty = Faculty.objects.get(id=faculty_id)

        original_url = faculty.proposal_pdf_url
        fixed_url = original_url

        if '/raw/upload/raw/' in fixed_url:
            fixed_url = fixed_url.replace('/raw/upload/raw/', '/raw/upload/')
        elif '/upload/' in fixed_url and '/upload/raw/' not in fixed_url:
            fixed_url = fixed_url.replace('/upload/', '/upload/raw/')

        if fixed_url != original_url:
            faculty.proposal_pdf_url = fixed_url
            faculty.save()

        return JsonResponse({
            'faculty_id': faculty.id,
            'original_url': original_url,
            'fixed_url': fixed_url,
            'was_fixed': fixed_url != original_url
        })

    except Faculty.DoesNotExist:
        return JsonResponse({'error': 'Faculty not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
