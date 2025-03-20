from django.http import HttpResponse
from django.http import JsonResponse
from django.middleware.csrf import get_token

def home(request):
    return HttpResponse("Welcome to the CSR Portal!")

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})