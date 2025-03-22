from django.db import models

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    areas_of_work = models.JSONField()  # Stores areas of work as a list
    sdg_contributions = models.JSONField(default=list)  # Stores SDG numbers as a list of integers
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    profile_picture_url = models.URLField(blank=True, null=True)
    proposal_pdf_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name
