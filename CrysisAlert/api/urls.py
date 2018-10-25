from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api.views import ReportViewSet, ReportUpdateCreateView, OperatorAccountList, AccountDetailView

router = DefaultRouter()
router.register(r'crisis_reports', ReportUpdateCreateView)


urlpatterns = [
	url(r'^crisis_view/$', ReportViewSet.as_view(), name="crisis_view"),
	url(r'', include(router.urls)),
	path('operators/', OperatorAccountList.as_view()),
	path('operators/<int:pk>/', AccountDetailView.as_view()),
]








