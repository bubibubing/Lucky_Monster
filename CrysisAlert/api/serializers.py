from rest_framework import serializers
from django.contrib.auth.models import User
from app.models import Crisis, CrisisReport, Agency, Assistance

class OperatorAccountSerializer(serializers.ModelSerializer):
    reports = serializers.PrimaryKeyRelatedField(many=True, queryset=CrisisReport.objects.all())
    #creator = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'reports',)


class CrisisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crisis


class ReportViewSerializer(serializers.ModelSerializer):
    crisis_type = serializers.ReadOnlyField(source='crisis_type.crisis_type',
                                            read_only=True)
    status = serializers.CharField(source="get_status_display",
                                   read_only=True)
    create_date_time = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S",
                                                 read_only=True)

    class Meta:
        model = CrisisReport
        # exclude = ('last_modified',)
        fields = (
            'name',
            'mobile_number',
            'street_name',
            'crisis_type',
            'description',
            'injured_people_num',
            'status',
            'create_date_time',
        )

class ReportUpdateCreateSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source="creator.username")
    
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