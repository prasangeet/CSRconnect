from django.db import models
from django.contrib.auth.models import AbstractUser

# Optional: Extend User if you want to customize login later
class CompanyUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Store hashed password!
    
    # Link to CompanyDetails
    details = models.OneToOneField("CompanyDetails", on_delete=models.CASCADE, related_name="company_user")
    
    is_approved = models.BooleanField(default=False)
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({'Approved' if self.is_approved else 'Pending'})"


class CompanyDetails(models.Model):
    name = models.CharField(max_length=100)  # Required field
    industry = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    website = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='company_logo', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # SDG and project relations
    sdg_initiatives = models.ManyToManyField("sdgs.SDG", related_name="company_details", blank=True)
    project_initiatives = models.ManyToManyField("classification.SDGClassification", related_name="company_details", blank=True)

    def __str__(self):
        return self.name
