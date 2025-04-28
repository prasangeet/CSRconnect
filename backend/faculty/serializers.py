# serializers.py
from rest_framework import serializers
from .models import Faculty
from sdgs.models import SDG

class SDGSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDG
        fields = ['id', 'number', 'name']

class FacultySerializer(serializers.ModelSerializer):
    linked_sdgs = serializers.SerializerMethodField()

    class Meta:
        model = Faculty
        fields = [
            'id', 'name', 'email', 'specialization',
            'areas_of_work', 'sdg_contributions', 'linked_sdgs',
            'phone_number', 'proposal_pdf_url', 'profile_picture_url'
        ]

    def get_linked_sdgs(self, obj):
        sdgs = obj.sdgs.all()
        return SDGSerializer(sdgs, many=True).data
