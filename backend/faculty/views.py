from django.http import JsonResponse
from cloudinary.uploader import upload
from .models import Faculty

# Create your views here.
def add_faculty(request):
    if request.method == 'POST':
        name = request.POST['name']
        specialization = request.POST['specialization']
        areas_of_work = request.POST.getlist('areas_of_work[]')
        sdg_contribution = request.POST['sdg_contribution']
        proposal_pdf = request.FILES['proposal_pdf']

        # Upload to Cloudinary
        cloudinary_response = upload(proposal_pdf, resource_type="raw")

        # Save faculty data to the database
        faculty = Faculty.objects.create(
            name=name,
            specialization=specialization,
            areas_of_work=areas_of_work,
            sdg_contribution=sdg_contribution,
            proposal_pdf_url=cloudinary_response['url']
        )
        return JsonResponse({'message': 'Faculty added successfully',
                             'faculty_id': faculty.id,
                             'faculty': {
                                    'name': faculty.name,
                                    'specialization': faculty.specialization,
                                    'areas_of_work': faculty.areas_of_work,
                                    'sdg_contribution': faculty.sdg_contribution,
                                    'proposal_pdf_url': faculty.proposal_pdf_url
                                }})


def get_faculties(request):
    faculties = Faculty.objects.all().values()
    return JsonResponse(list(faculties), safe=False)
