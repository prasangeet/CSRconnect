from django.urls import path
from .views import add_faculty, get_faculties, get_faculty_by_id
from . import views

urlpatterns = [
    path('get/', get_faculties, name='get-faculty'),
    path('add/', add_faculty, name='add-faculty'),
    path('csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('pdf/<int:faculty_id>/', views.view_faculty_pdf, name='view_faculty_pdf'),
    path('getfaculty/<int:faculty_id>/', get_faculty_by_id, name='get_faculty_by_id'),
]