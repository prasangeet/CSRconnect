from rest_framework import serializers
from company.models import CompanyDetails
from sdgs.models import SDG
from classification.models import SDGClassification


class SDGSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDG
        fields = ["id", "number", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDGClassification
        fields = [
            "id",
            "program_name",
            "implementing_organisation",
            "sdg_number",
            "sdg_name",
            "district",
            "state",
            "project_status",
            "project_type",
            "budget",
            "modalities",
            "details",
        ]


class CompanyDetailsSerializer(serializers.ModelSerializer):
    sdg_initiatives = SDGSerializer(many=True, read_only=True)
    project_initiatives = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = CompanyDetails
        fields = [
            "id",
            "name",
            "industry",
            "location",
            "website",
            "description",
            "logo",
            "created_at",
            "csr_policy",
            "updated_at",
            "sdg_initiatives",
            "project_initiatives",
        ]


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDetails
        fields = [
            "name",
            "industry",
            "location",
            "website",
            "description",
            "logo",
            "csr_policy",  # ✅ Added here
        ]
        read_only_fields = ["logo"]


class CompanyProjectSerializer(serializers.ModelSerializer):
    project_initiatives = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = CompanyDetails
        fields = [
            "id",
            "name",
            "csr_policy",  # ✅ Optional
            "project_initiatives",
        ]