from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth import password_validation 
from app.models import Crisis, CrisisReport, Agency, Assistance

PASSWORD_MIN_LENGTH = 8

class CrisisSerializer(serializers.ModelSerializer):
    """
    Serializer for crisis types
    """

    class Meta:
        model = Crisis
        fields = "__all__"


class ReportViewSerializer(serializers.ModelSerializer):
    """
    Serializer for crisis reports
    """
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
    """
    Serializer for creating or updating a crisis report
    """
    creator = serializers.ReadOnlyField(source="creator.username")
    
    class Meta:
        model = CrisisReport
        exclude = ('last_modified',)


class UserSerializer(serializers.ModelSerializer):
    """
    Call center operator account serializer
    """

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
        """
        Create a new user account with username, email and password fileds.
        """
        user = User.objects.create_user(username=validated_data['username'], 
                                        email=validated_data['email'], 
                                        password=validated_data['password'])
        return user


    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',)


class PasswordChangeSerializer(serializers.ModelSerializer):
    """
    Change Password Serializer
    """
    # old password
    old_password = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    # new password
    password1 = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    # confirm new password
    password2 = serializers.CharField(
            min_length=PASSWORD_MIN_LENGTH,
            required=True,
        )

    def validate(self, data):
        """
        Validate the passwords.
        """
        # confirm the user's old password
        if not self.context['request'].user.check_password(data['old_password']):
            raise serializers.ValidationError({'old_password': 'Wrong password.'})

        # confirm the passwords entered twice are the same
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'Password': 'Confirmation not correct'})

        return data
    
    class Meta:
        model = User
        fields = ('id', 'old_password', 'password1', 'password2',)


class AgencySerializer(serializers.ModelSerializer):
    """
    Serializer for agency
    """

    class Meta:
        model = Agency
        fields = ('id', 'contact_num',)


class AssistanceSerializer(serializers.ModelSerializer):
    """
    Serializer for assistances required
    """

    type_of_assistance = serializers.SerializerMethodField()
    class Meta:
        model = Assistance
        fields = ('type_of_assistance',)


class OperatorAccountSerializer(serializers.ModelSerializer):
    """
    Serializer for all call center operator accounts and their created crisis reports
    """

    reports = serializers.PrimaryKeyRelatedField(many=True, queryset=CrisisReport.objects.all())

    class Meta:
        model = User
        fields = ("id", "username", "reports")