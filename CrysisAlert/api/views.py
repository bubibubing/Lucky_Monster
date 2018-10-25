from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import permissions
from rest_framework import views
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.permissions import IsOwnerOrReadOnly
from app.models import CrisisReport, Assistance, Agency, Facility
from api.serializers import (
    ReportViewSerializer, 
    CrisisSerializer, 
    AgencySerializer, 
    AssistanceSerializer, 
    OperatorAccountSerializer, 
    ReportUpdateCreateSerializer, 
    UserSerializer
)


# Create your views here.
class ReportViewSet(generics.ListAPIView):
    #queryset = CrisisReport.objects.all()
    serializer_class = ReportViewSerializer

    def get_queryset(self):
        queryset = CrisisReport.objects.all()
        crisis_type = self.request.query_params.get('crisis_type', None)
        crisis_status = self.request.query_params.get('status', None)

        if status is not None:
            queryset = queryset.filter(status=crisis_status)

        if crisis_type is not None:
            queryset = queryset.filter(crisis_type__crisis_type=crisis_type)

        return queryset

class ReportUpdateCreateView(viewsets.ModelViewSet):
    queryset = CrisisReport.objects.all()
    serializer_class = ReportUpdateCreateSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                         IsOwnerOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class UserCreate(views.APIView):
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OperatorAccountList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer


class AccountDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly,)