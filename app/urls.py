from django.urls import path
from app.views import *

urlpatterns = [
    path('test-server-status/',checkServerStatus.as_view()),
    path('data-in-collection/',dataIntoCollection.as_view()),
    path('data-in-collection/<str:company_id>/',dataIntoCollection.as_view()),
]