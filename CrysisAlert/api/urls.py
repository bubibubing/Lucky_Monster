from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api.views import ReportViewSet, ReportUpdateCreateView, OperatorAccountList, AccountDetailView, UserCreate

router = DefaultRouter()
router.register(r'crisis_reports', ReportUpdateCreateView)


urlpatterns = [
	url(r'^crisis_view/$', ReportViewSet.as_view(), name="crisis_view"),
	url(r'', include(router.urls)),
    url(r'^users/$', UserCreate.as_view(), name="create_account"),
	path('operators/', OperatorAccountList.as_view()),
	path('operators/<int:pk>/', AccountDetailView.as_view()),
]








