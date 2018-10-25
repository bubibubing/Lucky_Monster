from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import permissions

from django.contrib.auth.models import User
from api.permissions import IsOwnerOrReadOnly
from api.serializers import ReportViewSerializer, CrisisSerializer, AgencySerializer, AssistanceSerializer, OperatorAccountSerializer, ReportUpdateCreateSerializer
from app.models import CrisisReport, Assistance, Agency, Facility


# Create your views here.
class ReportViewSet(generics.ListAPIView):
    #queryset = CrisisReport.objects.all()
    serializer_class = ReportViewSerializer

    def get_queryset(self):
        queryset = CrisisReport.objects.all()
        crisis_type = self.request.query_params.get('crisis_type', None)
        status = self.request.query_params.get('status', None)

        if status is not None:
            queryset = queryset.filter(status=status)

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



class OperatorAccountList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer


class AccountDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = OperatorAccountSerializer
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly,)