from django.urls import path
from website import views

urlpatterns = [
<<<<<<< HEAD
    # path('', views.under_maintenance, name='index'),
    path('generate/', views.GenerateSentencesAPIView.as_view(), name='index_api'),
    path('category/', views.UserCategoriesAPIView.as_view(), name='user_categories_api'),
    path('topic/', views.UserTopicAPIView.as_view(), name='user_topics_api'),
    path('selected_result/', views.SelectedResultAPIView.as_view(), name='selected_result_api'),
=======
    #path('', views.under_maintenance, name='index'),
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
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
]
