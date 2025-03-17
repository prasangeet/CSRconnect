from django.urls import path
from .views import add_faculty, get_faculties

urlpatterns = [
    path('get/', get_faculties, name='get-faculty'),
    path('add/', add_faculty, name='add-faculty'),
]