from django.urls import path

from .views import SelectedAutomationResultAPIView, AutomationAPIView

urlpatterns = [
    path('selected-automation-results/', SelectedAutomationResultAPIView.as_view(), name='selected_results'),
    path('automation/', AutomationAPIView.as_view(), name='automation_view'),
]