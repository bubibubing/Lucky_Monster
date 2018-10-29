from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import permissions
from rest_framework import views
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from api.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated
from app.models import CrisisReport, Assistance, Agency, Facility
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
    queryset = CrisisReport.objects.all()
    serializer_class = ReportViewSerializer

    def get_queryset(self):
        queryset = CrisisReport.objects.all()
        crisis_type = self.request.query_params.get('crisis_type', None)
        crisis_status = self.request.query_params.get('status', None)

        if crisis_status is not None:
            queryset = queryset.filter(status=crisis_status)
        if crisis_type is not None:
            queryset = queryset.filter(crisis_type__crisis_type=crisis_type)

        return queryset


class ReportUpdateCreateView(viewsets.ModelViewSet):
    queryset = CrisisReport.objects.all()
    serializer_class = ReportUpdateCreateSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                         IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class UserCreateView(views.APIView):
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordChangeView(generics.UpdateAPIView):
    # authentication_classes = 
    permission_classes = (IsAuthenticated,)
    serializer_class = PasswordChangeSerializer

    def get_object(self, queryset=None):
        return self.request.user

    def put(self, request, format='json'):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = self.get_object()
            user.set_password(serializer.data['password1'])
            user.save()
            return Response({'Success': 'Password changed'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserLoginView(views.APIView):
    def post(self, request, format="json"):
        data = request.data
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)

        # a backend authenticated the credentials
        if user is not None:
            login(request, user)
            return Response({'Login': True}, status=status.HTTP_200_OK)
        # no backend authenticated the credentials
        else:
            return Response({'Login': False}, status=status.HTTP_404_NOT_FOUND)


class UserLogoutView(views.APIView):
    def post(self, request, format=None):
        logout(request)
        return Response({'Success': True}, status=status.HTTP_200_OK)



class OperatorAccountList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer


class AccountDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly,)