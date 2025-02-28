from django.db import models

# Create your models here.
class SDGClassification(models.Model):
    implementing_organisation = models.CharField(max_length=255)
    sdg_number = models.IntegerField()
    sdg_name = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    project_status = models.CharField(max_length=100)
    project_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.implementing_organisation} - SDG {self.sdg_number}"