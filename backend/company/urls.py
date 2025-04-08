from django.urls import path
from .views import add_company, update_company_details, fetch_company_details, fetch_all_companies

urlpatterns = [
    path('add-company/', add_company, name='add_company'),
    path('update-company/<int:company_id>/', update_company_details, name='update_company_details' ),
    path('get-company/<int:company_id>/', fetch_company_details, name='fetch_company_details' ),
    path('get-all-companies/', fetch_all_companies, name='fetch_all_companies' ),
]