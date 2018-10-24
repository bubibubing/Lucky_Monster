from rest_framework import serializers
from app.models import Crisis, CrisisReport, Agency, Assistance

class CrisisSerializer(serializers.ModelSerializer):
	class Meta:
		model = Crisis

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrisisReport
        exclude = ('last_modified',)

class AgencySerializer(serializers.ModelSerializer):
	class Meta:
		model = Agency
		fields = ('id', 'contact_num',)

class AssistanceSerializer(serializers.ModelSerializer):

	type_of_assistance = serializers.SerializerMethodField()
	class Meta:
		model = Assistance
		fields = ('id', 'crisis', 'type_of_assistance', 'agencies')