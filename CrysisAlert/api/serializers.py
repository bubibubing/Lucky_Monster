from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth import password_validation 
from app.models import Crisis, CrisisReport, Agency, Assistance

PASSWORD_MIN_LENGTH = 8

class OperatorAccountSerializer(serializers.ModelSerializer):
    reports = serializers.PrimaryKeyRelatedField(many=True, queryset=CrisisReport.objects.all())
    #creator = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'reports',)


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
        )

    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())],
            max_length=50,
        )

    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], 
                                        email=validated_data['email'], 
                                        password=validated_data['password'])
        return user


    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


class PasswordChangeSerializer(serializers.ModelSerializer):
    """
    Change Password Serializer
    """
    old_password = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    # Password
    password1 = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    # Confirmation password
    password2 = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    def validate(self, data):
        if not self.context['request'].user.check_password(data['old_password']):
            raise serializers.ValidationError({'old_password': 'Wrong password.'})

        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'Password': 'Confirmation not ccorrect'})

        return data
    
    class Meta:
        model = User
        fields = ('id', 'old_password', 'password1', 'password2')


class CrisisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crisis



class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ('id', 'contact_num',)


class AssistanceSerializer(serializers.ModelSerializer):

    type_of_assistance = serializers.SerializerMethodField()
    class Meta:
        model = Assistance
        fields = ('type_of_assistance')


class ReportViewSerializer(serializers.ModelSerializer):
    crisis_type = serializers.ReadOnlyField(source='crisis_type.crisis_type',
                                            read_only=True)
    status = serializers.CharField(source="get_status_display",
                                   read_only=True)
    create_date_time = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S",
                                                 read_only=True)
    assistance = serializers.StringRelatedField(many=True)

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
            'assistance',
        )


class ReportUpdateCreateSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source="creator.username")
    
    class Meta:
        model = CrisisReport
        exclude = ('last_modified',)