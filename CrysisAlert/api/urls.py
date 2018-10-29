from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api.views import (
        ReportViewSet, 
        ReportUpdateCreateView, 
        OperatorAccountList, 
        AccountDetailView, 
        UserCreateView,
        UserLoginView,
        UserLogoutView,
    )

router = DefaultRouter()
router.register(r'crisis_reports', ReportUpdateCreateView)


urlpatterns = [
	url(r'^crisis_view/$', ReportViewSet.as_view(), name="crisis_view"),
	url(r'', include(router.urls)),
    url(r'^users/create$', UserCreateView.as_view(), name="create_account"),
    url(r'^users/login$', UserLoginView.as_view(), name="login"),
    url(r'users/logout$', UserLogoutView.as_view(), name="logout"),
	path('operators/', OperatorAccountList.as_view()),
	path('operators/<int:pk>/', AccountDetailView.as_view()),
]








