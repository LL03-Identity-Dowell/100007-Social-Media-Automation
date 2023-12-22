from django.urls import path

from website import views

urlpatterns = [
    # path('', views.under_maintenance, name='index'),
    path('generate/', views.GenerateSentencesAPIView.as_view(), name='index_api'),
    path('category/', views.UserCategoriesAPIView.as_view(), name='user_categories_api'),
    path('topic/', views.UserTopicAPIView.as_view(), name='user_topics_api'),
    path('selected_result/', views.SelectedResultAPIView.as_view(), name='selected_result_api'),
]
