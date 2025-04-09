from django.urls import path
from .views import (
    upload_pdf, get_sdg_classification, get_sdg_classified_data, get_project_data,
    update_project_details, update_progress_overview, update_objectives,
    update_key_outcomes, update_challenges, link_stakeholder_with_project, link_faculty_with_project, get_linked_faculties
)

urlpatterns = [
    # 🔄 PDF upload and SDG classification
    path("upload_pdf/", upload_pdf, name="upload_pdf"),

    # 🔍 Fetching data
    path("get_sdg_data/", get_sdg_classification, name="get_sdg_data"),
    path("sdg/<int:sdg_number>/", get_sdg_classified_data, name="get_sdg_classified_data"),
    path("sdg/get_project/<int:project_id>/", get_project_data, name="get_project_data"),
    path("sdg/get_linked_faculties/<int:projectId>/", get_linked_faculties, name="get_linked_faculties"),

    # ✏️ Updating project parts (PUT)
    path("sdg/update_project/<int:projectId>/", update_project_details, name="update_project_details"),
    path("sdg/update_progress/<int:projectId>/", update_progress_overview, name="update_progress_overview"),
    path("sdg/update_objectives/<int:projectId>/", update_objectives, name="update_objectives"),
    path("sdg/update_outcomes/<int:projectId>/", update_key_outcomes, name="update_key_outcomes"),
    path("sdg/update_challenges/<int:projectId>/", update_challenges, name="update_challenges"),
    path("sdg/link_stakeholders_with_project/<int:projectId>/<int:stakeholderId>/", link_stakeholder_with_project, name="link_stakeholder_with_project"),
    path("sdg/link_faculty_with_project/<int:projectId>/<int:facultyId>/", link_faculty_with_project, name="link_faculty_with_project"),
]
