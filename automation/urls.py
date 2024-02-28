from django.urls import path
from .views import SelectedAutomationResultAPIView

urlpatterns = [
    path('selected-automation-results/', SelectedAutomationResultAPIView.as_view(), name='selected_results'),
]