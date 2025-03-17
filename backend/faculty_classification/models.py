from django.db import models

# Create your models here.
class Faculty(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='faculty_avatars/', null=True, blank=True)
    specialization = models.CharField(max_length=100)
    areas_of_work = models.TextField()
    proposal_paper = models.FileField(upload_to='proposal_papers/')
    sdg_contribution = models.CharField(max_length=100, blank=True, null=True)
    classification = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name