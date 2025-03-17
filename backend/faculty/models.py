from django.db import models

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    areas_of_work = models.JSONField()
    sdg_contribution = models.CharField(max_length=100)
    proposal_pdf_url = models.URLField(blank=True, null=True)
