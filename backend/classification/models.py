from django.db import models

class SDGClassification(models.Model):
    implementing_organisation = models.CharField(max_length=255)
    sdg_number = models.IntegerField()
    sdg_name = models.CharField(max_length=255)
    district = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    project_status = models.CharField(max_length=255, blank=True, null=True)
    project_type = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"{self.implementing_organisation} - SDG {self.sdg_number}"