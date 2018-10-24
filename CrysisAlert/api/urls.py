from django.conf.urls import url
from api.views import ReportViewSet

urlpatterns = [
	url(r'^crisis_report/$', ReportViewSet.as_view(), name="crisis_report")
]

		







