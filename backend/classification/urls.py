from django.urls import path
from .views import upload_pdf, get_sdg_classification, get_sdg_classified_data, get_project_data

urlpatterns = [
    path("upload_pdf/", upload_pdf, name="upload_pdf"),
    path("get_sdg_data/", get_sdg_classification, name="get_sdg_data"),
    path("sdg/<int:sdg_number>/", get_sdg_classified_data, name="get_sdg_classified_data"),  # New endpoint
    path("sdg/get_project/<int:project_id>/", get_project_data, name="get_project_data")
]
