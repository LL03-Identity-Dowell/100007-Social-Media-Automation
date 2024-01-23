from django.urls import path
from .views import RankAutomationAPIView

urlpatterns = [
    path('rank-automation/', RankAutomationAPIView.as_view(), name='rank_automation'),
]
