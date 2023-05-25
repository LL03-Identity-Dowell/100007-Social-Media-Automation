from django.urls import path
from . import views

app_name = 'generate_article'

urlpatterns = [
    path('', views.index, name='main-view'),
    path('article/',views.generate_article, name='submit-title'),
    # path('article/',views.article_generated,name='article'),
]
