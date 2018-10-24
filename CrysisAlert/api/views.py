from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics

from api.serializers import ReportSerializer, CrisisSerializer, AgencySerializer, AssistanceSerializer
from app.models import CrisisReport, Assistance, Agency, Facility


# Create your views here.
class ReportViewSet(generics.ListAPIView):
	serializer_class = ReportSerializer

	def get_queryset(self):
		queryset = CrisisReport.objects.all().order_by("create_date_time")
		crisis_type = self.request.query_params.get('crisis_type', None)
		status = self.request.query_params.get('status', None)
		if status is not None:
			queryset = queryset.filter(status=status)

		if crisis_type is not None:
			queryset = queryset.filter(crisis_type__crisis_type=crisis_type)

		return queryset
		







