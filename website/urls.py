from django.conf.urls import url
from django.urls import path

from website import views

urlpatterns = [
    # path('', views.under_maintenance, name='index'),
    path('', views.index, name='index'),
    path('api/v1', views.GenerateSentencesAPIView.as_view(), name='index_api'),
    path('schedule/', views.schedule, name='schedule'),
    url('selected_result/', views.selected_result, name='selected_result'),
    url('topic/', views.topic, name='topic'),
    url('topics/', views.topics, name='topics'),
    url('article/', views.article, name='article'),
    url('articles/', views.articles, name='articles'),
    url('published/', views.published, name='published'),
    url('not_scheduled/', views.not_scheduled, name='not_scheduled'),
    url('new_main/', views.new_home, name='new_home'),
    url('posts/', views.posts, name='posts'),
    path('categories-and-topics', views.category_topic, name='category_topic'),
]
