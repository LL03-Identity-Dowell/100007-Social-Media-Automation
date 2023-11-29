from django.urls import path

from . import views
from .views import (MainAPIView, UserApprovalView, GenerateArticleView,
                    TargetedCitiesUpdateView,
                    TargetedCitiesCreateView, TargetedCitiesListView,
                    HashMentionView, HashMentionUpdateView, UnScheduledView, UnScheduledJsonView,
                    ScheduledJsonView, IndexView, MostRecentJSON, FacebookFormAPI,
                    InstaFormAPI, XFormAPI, LinkedInFormAPI, YoutubeFormView, PinterestFormView,
                    ClientProfileFormView, ListArticleView,
                    ArticleDetailView, PostListView, PostDetailView, SavePostView,
                    GenerateArticleWikiView, WriteYourselfView, MediaScheduleView,
                    MediaPostView, SocialMediaChannelsView, LinkedAccountsJson, CanPostOnSocialMedia,
                    LinkMediaChannelsView, AryshareProfileView, LogoutUser)

app_name = 'generate_article'

urlpatterns = [
    # path('', views.under_maintenance, name='home'),
    path('', views.dowell_login, name="dowelllogin"),
    path('scheduler/', views.post_scheduler, name='post-scheduler'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),  # socialmedia
    path('logout', views.Logout, name="logout"),  # client admin
    path('reset/password/', views.reset_password, name='reset-password'),
    path('confirm/reset/password/', views.confirm_reset_password,
         name='confirm-reset-password'),
    path('forget_password/', views.forget_password, name='forget_password'),
    path('topics/', views.topics, name='topics'),
    path('signup/', views.register, name='register'),
    path('user/info/', views.User_Info_ListView, name='user-info'),
    path('user/detail/<str:id>/', views.User_DetailView, name='user-detail'),
    path('address/', views.address, name='address'),
    path('proxy-api/', views.frontend_api_request, name='proxy-api'),
    path('exit/', views.exit_view, name='exit'),
    # path('list/article',views.list_article, name='list-article'),
    # path('saved/',views.save_article,name='save-article'),


    # React endpoints start here
    path('api/v1/main/', MainAPIView.as_view(), name='main-api'),
    path('api/v1/user-approval/', UserApprovalView.as_view(),
         name='user_approval_api'),
    path('api/v1/targeted_cities/', TargetedCitiesListView.as_view(),
         name='targeted-cities-list'),
    path('api/v1/targeted_cities/create/', TargetedCitiesCreateView.as_view(),
         name='targeted-cities-create'),
    path('api/v1/targeted_cities/update/', TargetedCitiesUpdateView.as_view(),
         name='targeted-cities-update'),
    path('api/v1/hash-tags-and-mentions/', HashMentionView.as_view(),
         name='save_hash_mentions'),
    path('api/v1/update-hash-tags-and-mentions/', HashMentionUpdateView.as_view(),
         name='update_hash_mentions'),
    path('api/v1/facebook-form/', FacebookFormAPI.as_view(),
         name='facebook-form-api'),
    path('api/v1/instagram-form/',  InstaFormAPI.as_view(),
         name='instagram-form-api'),
    path('api/v1/X-form/',  XFormAPI.as_view(), name='X-form-api'),
    path('api/v1/linkedIn-form/',  LinkedInFormAPI.as_view(),
         name='linkedIn-form-api'),
    path('api/v1/youtube-form/',  YoutubeFormView.as_view(),
         name='youtube-form-api'),
    path('api/v1/pinterest-form/',  PinterestFormView.as_view(),
         name='pinterest-form-api'),
    path('api/v1/client-form/',  ClientProfileFormView.as_view(),
         name='client-form-api'),
    path('api/v1/list-articles/', ListArticleView.as_view(), name='list-articles'),
    path('api/v1/article-detail/',
         ArticleDetailView.as_view(), name='article-detail'),
    path('api/v1/article/generate/', IndexView.as_view(),
         name='index'),  # (step-2)ranked page
    path('api/v1/article/AI/', GenerateArticleView.as_view(),
         name='submit-title'),  # Ai writer
    path('api/v1/article/wiki/', GenerateArticleWikiView.as_view(),
         name='submit-title-wiki'),
    path('api/v1/article/write_yourself/',
         WriteYourselfView.as_view(), name='write_yourself'),
    path('api/v1/post_list/', PostListView.as_view(), name='submit-title'),
    path('api/v1/post-detail/', PostDetailView.as_view(), name='post-detail'),
    path('api/v1/save_post/', SavePostView.as_view(), name='save-post'),
    path('api/v1/media_schedule/',
         MediaScheduleView.as_view(), name='media-schedule'),
    path('api/v1/media_post/',
         MediaPostView.as_view(), name='media-post'),
    path('api/v1/unscheduled/', UnScheduledView.as_view(), name='unscheduled'),
    path('api/v1/unscheduled-json/',
         UnScheduledJsonView.as_view(), name='unscheduled-json'),
    path('api/v1/scheduled-json/',
         ScheduledJsonView.as_view(), name='scheduled-json'),
    path('api/v1/recent_posts/', MostRecentJSON.as_view(), name='recent_post'),
    path('api/v1/social_media_channels/',
         SocialMediaChannelsView.as_view(), name='social_media_channels'),
    path('api/v1/linked-account/',
         LinkedAccountsJson.as_view(), name='linked-account'),
    path('api/v1/can-post/',
         CanPostOnSocialMedia.as_view(), name='can-post'),
    path('api/v1/link/linkusers/', AryshareProfileView.as_view(), name='can-post'),
    path('api/v1/link/', LinkMediaChannelsView.as_view(), name='can-post'),
    path('api/v1/logout/', LogoutUser.as_view(), name='logout'),




]
