from rest_framework import serializers
from .models import SDGClassification

class SDGClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = "__all__"  # This includes all model fields in the API response
