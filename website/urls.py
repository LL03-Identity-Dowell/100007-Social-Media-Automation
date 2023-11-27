from django.urls import path

from website import views

urlpatterns = [
    # path('', views.under_maintenance, name='index'),
    path('topic/', views.topic, name='topic'),
    path('topics/', views.topics, name='topics'),
    path('article/', views.article, name='article'),
    path('articles/', views.articles, name='articles'),
    path('published/', views.published, name='published'),
    path('new_main/', views.new_home, name='new_home'),
    path('posts/', views.posts, name='posts'),
    path('api/v1', views.GenerateSentencesAPIView.as_view(), name='index_api'),
    path('api/v1/category/', views.UserCategoriesAPIView.as_view(), name='user_categories_api'),
    path('api/v1/topic/', views.UserTopicAPIView.as_view(), name='user_topics_api'),
    path('api/v1/selected_result/', views.SelectedResultAPIView.as_view(), name='selected_result_api'),
]
