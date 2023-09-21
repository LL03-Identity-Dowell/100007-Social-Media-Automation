from django.urls import path

from credits.views import CreditErrorView

urlpatterns = [
    path('error/', CreditErrorView.as_view(), name='credit_error_view'),
]