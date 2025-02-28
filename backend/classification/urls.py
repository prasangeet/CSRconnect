from django.urls import path
from .views import upload_pdf, get_sdg_classification

urlpatterns = [
    path("upload_pdf/", upload_pdf, name="upload_pdf"),
    path("get_sdg_data/", get_sdg_classification, name='get_sdg_data')
]
