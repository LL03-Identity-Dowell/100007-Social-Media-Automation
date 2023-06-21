from django.urls import path
from .views import SentenceApiView

urlpatterns = [
    path('',SentenceApiView.as_view()),
]