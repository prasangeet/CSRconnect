from django.db import models

# Create your models here.
class StakeholderUser(models.Model):  
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15, blank=True, null=True)
    program_name = models.CharField(max_length=255, default="Default Program Name")

    def __str__(self):
        return self.username
