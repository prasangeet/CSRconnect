from django.db import models
from faculty.models import Faculty  # Assuming Faculty model is in the same directory
from stakeholders.models import StakeholderUser  # Assuming StakeholderUser model is in the same directory
from company.models import CompanyDetails  # Assuming CompanyUser model is in the same directory

class SDGClassification(models.Model):
    program_name = models.CharField(max_length=255)
    implementing_organisation = models.CharField(max_length=255)
    sdg_number = models.IntegerField()
    sdg_name = models.CharField(max_length=255)
    district = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    project_status = models.CharField(max_length=255, blank=True, null=True)
    project_type = models.CharField(max_length=255, blank=True, null=True)
    company = models.ForeignKey(CompanyDetails, on_delete=models.CASCADE, related_name='sdg_classifications', blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)  # Can store numbers & currency symbols
    modalities = models.TextField(blank=True, null=True)  # Additional implementation details
    details = models.TextField(blank=True, null=True)  # Any extra relevant info
    contact_email = models.EmailField(blank=True, null=True)  # Contact email for the project
    duration = models.CharField(max_length=255, blank=True, null=True)  # Duration of the project
    start_date = models.DateField(blank=True, null=True)  # Start date of the project
    end_date = models.DateField(blank=True, null=True)  # End date of the project

    def __str__(self):
        return f"{self.implementing_organisation} - SDG {self.sdg_number} ({self.sdg_name})"
    

class ProgressOverview(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='progress_overview')
    overall_completion = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage completion
    budget_utilized = models.DecimalField(max_digits=10, decimal_places=2)  # Amount utilized
    beneficaries_reached = models.IntegerField()  # Number of beneficiaries reached
    timeline_status = models.CharField(max_length=255, blank=True, null=True)  # Status of the timeline

    def __str__(self):
        return f"Progress Overview for {self.sdg_classification}"
    
class Objectives(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='objectives')
    description = models.TextField()

    def __str__(self):
        return f"Objective for {self.sdg_classification}: {self.description[:50]}"
    
class KeyOutcomes(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='key_outcomes')
    description = models.TextField()

    def __str__(self):
        return f"Key Outcome for {self.sdg_classification}: {self.description[:50]}"
    
class Challenges(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='challenges')
    description = models.TextField()

    def __str__(self):
        return f"Challenge for {self.sdg_classification}: {self.description[:50]}"
    
class Stakeholders(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='stakeholders')
    stakeholder = models.ForeignKey(StakeholderUser, on_delete=models.CASCADE, related_name='linked_projects')
    role = models.CharField(max_length=255, blank=True, null=True)  # Role of the stakeholder in the project

    def __str__(self):
        return f"Stakeholder for {self.sdg_classification}: {self.name} - {self.role}"
    
class FacultiesLinked(models.Model):
    sdg_classification = models.ForeignKey(SDGClassification, on_delete=models.CASCADE, related_name='faculties_linked')
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='linked_projects')
    role = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Faculty Linked to {self.sdg_classification}: {self.faculty.name}"


