from rest_framework import serializers
from .models import SDGClassification, ProgressOverview, Objectives, KeyOutcomes, Challenges, Stakeholders, FacultiesLinked

class SDGClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = "__all__"  # This includes all model fields in the API response

class ProjectPartialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = ['organization_name', 'project_status', 'project_type']

class ProjectOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = ['id', 'program_name', 'implementing_organisation', 'district', 'state', 'description']

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