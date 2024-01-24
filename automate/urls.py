from django.urls import path
from .views import RankAutomationAPIView
from . import views
from website.views import views

urlpatterns = [
    path('rank-automation/', RankAutomationAPIView.as_view(), name='rank_automation'),
]
