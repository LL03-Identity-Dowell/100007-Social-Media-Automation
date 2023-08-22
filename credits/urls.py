from django.urls import path

from credits.views import CreditErorrView

urlpatterns = [
    path('error/', CreditErorrView.as_view(), name='credit_error_view'),
]
