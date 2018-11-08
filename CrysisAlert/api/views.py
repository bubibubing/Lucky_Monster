from rest_framework import status, views, viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from api.permissions import IsOwnerOrReadOnly
from app.models import CrisisReport, Assistance, Agency, Facility, Crisis
from app.views import getInfo, info_dispatch
from api.serializers import (
    ReportViewSerializer, 
    CrisisSerializer, 
    AgencySerializer, 
    AssistanceSerializer, 
    OperatorAccountSerializer, 
    ReportUpdateCreateSerializer, 
    UserSerializer,
    PasswordChangeSerializer,
)


# Create your views here.
class ReportViewSet(generics.ListAPIView):
    """
    Return a list of all crisis reports
    """

    queryset = CrisisReport.objects.all()
    serializer_class = ReportViewSerializer

    def get_queryset(self):
        """
        Return a query set
        
        Filters are applied to get the query set
        """

        queryset = CrisisReport.objects.all()
        crisis_type = self.request.query_params.get('crisis_type', None)
        crisis_status = self.request.query_params.get('status', None)

        if crisis_status is not None:
            queryset = queryset.filter(status=crisis_status)
        if crisis_type is not None:
            queryset = queryset.filter(crisis_type__crisis_type=crisis_type)

        return queryset


class CrisisViewSet(generics.ListAPIView):
    """
    Return a list of all crsis types in the database
    """

    queryset = Crisis.objects.all()
    serializer_class = CrisisSerializer


class ReportUpdateCreateView(viewsets.ModelViewSet):
    """
    Create or update a report

    get:
        get a list of all crisis reports
    
    post:
        create a new crisis report, need user login
    
    put:
        update an existing crisis reports. Only admin and creator have the permission.
    """
    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

    queryset = CrisisReport.objects.all()
    serializer_class = ReportUpdateCreateSerializer

    def perform_create(self, serializer):
        print(serializer.validated_data)
        info_dispatch(serializer.validated_data)
        serializer.save(creator=self.request.user)


class UserCreateView(views.APIView):
    """
    View for creating a new account

    post:
        create a new user account
        return a user token if success
    """

    # allow any
    permission_classes = (permissions.AllowAny, )
    
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # if valid, save the new account
            user = serializer.save()
            if user:
                # retrieve the token
                token, _ = Token.objects.get_or_create(user=user)
                json = serializer.data
                json['token'] = token.key
                # response the user token
                return Response(json, status=status.HTTP_201_CREATED)

        # fail to create a new accoun
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordChangeView(generics.UpdateAPIView):
    """
    View for changing the password

    put:
        update the user password.
        needs token authentication.
    """

    authentication_classes = (TokenAuthentication, BasicAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    def get_object(self, queryset=None):
        return self.request.user

    def put(self, request, format='json'):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = self.get_object()
            # set the password
            user.set_password(serializer.data['password1'])
            user.save()
            return Response({'Status': 'Password changed', 'username': user.username}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(views.APIView):
    """
    View for user login

    post:
        login
    """

    permission_classes = (permissions.AllowAny,)
 
    def post(self, request, format="json"):
        data = request.data
        username = data['username']
        password = data['password']
        # authenticate the user
        user = authenticate(username=username, password=password)

        # a backend authenticated the credentials
        if user is not None:
            login(request, user)
            # retrieve the key
            token = Token.objects.get(user=user)
            json = {"username": username, "token": token.key}
            return Response(json, status=status.HTTP_200_OK)
        # no backend authenticated the credentials
        else:
            return Response({'Login': False}, status=status.HTTP_404_NOT_FOUND)


class UserLogoutView(views.APIView):
    """
    View for user logout
    """

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response({'Logout': True}, status=status.HTTP_200_OK)


class OperatorAccountList(generics.ListAPIView):
    """
    List all user accounts
    """

    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer


class AccountDetailView(generics.RetrieveAPIView):
    """
    List a user account details
    """

    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer
    authentication_classes = (TokenAuthentication, 
                              BasicAuthentication, 
                              SessionAuthentication, 
                              IsOwnerOrReadOnly,)
