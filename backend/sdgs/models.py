from django.db import models

class SDG(models.Model):
    name = models.CharField(max_length=100)
    number = models.IntegerField(unique=True)  # Unique SDG number
    faculties_linked = models.ManyToManyField("faculty.Faculty", related_name="sdgs", blank=True)  # Link faculties
    projects_linked = models.ManyToManyField("classification.SDGClassification", related_name="sdgs", blank=True)  # Link projects
    description = models.TextField()
    image_url = models.URLField()
    color = models.CharField(max_length=7)

    def __str__(self):
        return f"SDG {self.number}: {self.name}"

        
    def faculty_count(self):
        """Return the count of linked faculty members"""
        return self.faculties_linked.count()
        
    def project_count(self):
        """Return the count of linked projects"""
        return self.projects_linked.count()