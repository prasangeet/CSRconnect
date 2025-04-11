from rest_framework import serializers
from .models import SDGClassification, ProgressOverview, Objectives, KeyOutcomes, Challenges, Stakeholders, FacultiesLinked

class SDGClassificationSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = SDGClassification
        fields = "__all__"  # This includes all model fields in the API response

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

class ProjectPartialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = ['program_name', 'implementing_organization', 'project_status', 'project_type']

class ProjectOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = ['district', 'state', 'modalities', 'company_name', 'budget', 'contact_email', 'start_date', 'end_date']

class ProgressOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressOverview
        fields = '__all__'

class ObjectivesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objectives
        fields = '__all__'

class KeyOutcomesSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyOutcomes
        fields = '__all__'

class ChallengesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenges
        fields = '__all__'

class StakeholdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stakeholders
        fields = '__all__'

class FacultiesLinkedSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultiesLinked
        fields = '__all__'