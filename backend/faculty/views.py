import json
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from cloudinary.uploader import upload
from .models import Faculty
from sdgs.models import SDG
from django.shortcuts import redirect

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
                sdg.faculties_linked.add(faculty)  # Correctly linking faculty to SDG model

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


def view_faculty_pdf(request, faculty_id):
    """
    Redirect to view faculty proposal PDF
    """
    try:
        faculty = Faculty.objects.get(id=faculty_id)
        
        if not faculty.proposal_pdf_url:
            return JsonResponse({'error': 'No proposal PDF found for this faculty'}, status=404)
        
        # Fix the Cloudinary URL if needed
        pdf_url = faculty.proposal_pdf_url
        
        # Ensure the URL is properly formatted for raw PDF files
        if '/upload/' in pdf_url and '/upload/raw/' not in pdf_url:
            pdf_url = pdf_url.replace('/upload/', '/upload/raw/')
        
        # Redirect to the Cloudinary URL
        return redirect(pdf_url)
        
    except Faculty.DoesNotExist:
        return JsonResponse({'error': 'Faculty not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def view_sdg_pdf(request, sdg_id=None, sdg_number=None):
    """
    Redirect to the PDF document URL for an SDG
    """
    try:
        if sdg_id:
            sdg = SDG.objects.get(id=sdg_id)
        elif sdg_number:
            sdg = SDG.objects.get(number=sdg_number)
        else:
            return JsonResponse({'error': 'SDG ID or number is required'}, status=400)
        
        # Get document URL if available
        document_url = getattr(sdg, 'document_url', None)
        
        if not document_url:
            return JsonResponse({'error': 'No PDF document associated with this SDG'}, status=404)
        
        # Redirect to the document URL
        return redirect(document_url)
        
    except SDG.DoesNotExist:
        return JsonResponse({'error': 'SDG not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def debug_pdf_url(request, faculty_id):
    """Debug function to check and fix PDF URLs"""
    try:
        faculty = Faculty.objects.get(id=faculty_id)
        
        original_url = faculty.proposal_pdf_url
        
        # Fix common Cloudinary URL issues
        fixed_url = original_url
        
        # Fix double 'raw' issue
        if '/raw/upload/raw/' in fixed_url:
            fixed_url = fixed_url.replace('/raw/upload/raw/', '/raw/upload/')
        
        # Fix missing 'raw' resource type
        elif '/upload/' in fixed_url and '/upload/raw/' not in fixed_url:
            fixed_url = fixed_url.replace('/upload/', '/upload/raw/')
            
        # Update the faculty record if URL was fixed
        if fixed_url != original_url:
            faculty.proposal_pdf_url = fixed_url
            faculty.save()
            
        # Return both URLs for comparison
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



