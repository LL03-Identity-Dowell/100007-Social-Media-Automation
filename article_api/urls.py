from django.urls import path
from rest_framework.authtoken import views

from article_api.views import GenerateSentencesAPIView

urlpatterns = [
    path('api-token-auth/', views.obtain_auth_token, name='obtain_token_api_view'),
    path('generate-sentences/', GenerateSentencesAPIView.as_view(), name='generate_sentence_api_view'),
]
