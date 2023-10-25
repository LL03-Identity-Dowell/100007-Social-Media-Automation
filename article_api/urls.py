from django.urls import path
from rest_framework.authtoken import views

from article_api.views import APIKeyProcessor
from article_api.views import GenerateSentencesAPIView

urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name='obtain_token_api_view'),
    path('process-api-key/', APIKeyProcessor.as_view(), name='process-api-key'),
    path('generate-sentences/', GenerateSentencesAPIView.as_view(), name='generate_sentence_api_view'),
]
