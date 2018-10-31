from rest_framework import serializers
from app.models import CrisisReport

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrisisReport
    