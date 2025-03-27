from django.db import models

class SDGClassification(models.Model):
    program_name = models.CharField(max_length=255)
    implementing_organisation = models.CharField(max_length=255)
    sdg_number = models.IntegerField()
    sdg_name = models.CharField(max_length=255)
    district = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    project_status = models.CharField(max_length=255, blank=True, null=True)
    project_type = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)  # Can store numbers & currency symbols
    modalities = models.TextField(blank=True, null=True)  # Additional implementation details
    details = models.TextField(blank=True, null=True)  # Any extra relevant info

    def __str__(self):
        return f"{self.implementing_organisation} - SDG {self.sdg_number} ({self.sdg_name})"
