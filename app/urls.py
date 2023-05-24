from django.urls import path
from app.views import *

urlpatterns = [
    path('test-server-status/',checkServerStatus.as_view()),
]