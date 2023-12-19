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
                    Comments, PostComments, CreatePostComments,
                    LinkMediaChannelsView, AryshareProfileView, PostDetailDropdownView, DeletePostComment)

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
    path('main/', MainAPIView.as_view(), name='main-api'),
    path('user-approval/', UserApprovalView.as_view(),
         name='user_approval_api'),
    path('targeted_cities/', TargetedCitiesListView.as_view(),
         name='targeted-cities-list'),
    path('targeted_cities/create/', TargetedCitiesCreateView.as_view(),
         name='targeted-cities-create'),
    path('targeted_cities/update/', TargetedCitiesUpdateView.as_view(),
         name='targeted-cities-update'),
    path('hash-tags-and-mentions/', HashMentionView.as_view(),
         name='save_hash_mentions'),
    path('update-hash-tags-and-mentions/', HashMentionUpdateView.as_view(),
         name='update_hash_mentions'),
    path('facebook-form/', FacebookFormAPI.as_view(),
         name='facebook-form-api'),
    path('instagram-form/',  InstaFormAPI.as_view(),
         name='instagram-form-api'),
    path('X-form/',  XFormAPI.as_view(), name='X-form-api'),
    path('linkedIn-form/',  LinkedInFormAPI.as_view(),
         name='linkedIn-form-api'),
    path('youtube-form/',  YoutubeFormView.as_view(),
         name='youtube-form-api'),
    path('pinterest-form/',  PinterestFormView.as_view(),
         name='pinterest-form-api'),
    path('client-form/',  ClientProfileFormView.as_view(),
         name='client-form-api'),
    path('post-detail-dropdowns/',  PostDetailDropdownView.as_view(),
         name='post-detail-dropdowns-api'),

    path('list-articles/', ListArticleView.as_view(), name='list-articles'),
    path('article-detail/',
         ArticleDetailView.as_view(), name='article-detail'),
    path('article/generate/', IndexView.as_view(),
         name='index'),  # (step-2)ranked page
    path('article/AI/', GenerateArticleView.as_view(),
         name='submit-title'),  # Ai writer
    path('article/wiki/', GenerateArticleWikiView.as_view(),
         name='submit-title-wiki'),
    path('article/write_yourself/',
         WriteYourselfView.as_view(), name='write_yourself'),
    path('post_list/', PostListView.as_view(), name='submit-title'),
    path('post-detail/', PostDetailView.as_view(), name='post-detail'),
    path('save_post/', SavePostView.as_view(), name='save-post'),
    path('media_schedule/',
         MediaScheduleView.as_view(), name='media-schedule'),
    path('media_post/',
         MediaPostView.as_view(), name='media-post'),
    path('unscheduled/', UnScheduledView.as_view(), name='unscheduled'),
    path('unscheduled-json/',
         UnScheduledJsonView.as_view(), name='unscheduled-json'),
    path('scheduled-json/',
         ScheduledJsonView.as_view(), name='scheduled-json'),
    path('recent_posts/', MostRecentJSON.as_view(), name='recent_post'),
    path('social_media_channels/',
         SocialMediaChannelsView.as_view(), name='social_media_channels'),
    path('linked-account/',
         LinkedAccountsJson.as_view(), name='linked-account'),
    path('can-post/',
         CanPostOnSocialMedia.as_view(), name='can-post'),
    path('link/linkusers/', AryshareProfileView.as_view(), name='can-post'),
    path('link/', LinkMediaChannelsView.as_view(), name='can-post'),
    #  path('api/v1/logout/', LogoutUser.as_view(), name='logout'),
    path('comments/', Comments.as_view(), name='comments-endpoint'),
    path('comments/create/<str:post_id>/',
         CreatePostComments.as_view(), name='create-comments-endpoint'),
    path('comments/get-post-comments/<str:post_id>/',
         PostComments.as_view(), name='post-comments-endpoint'),
    path('comments/delete-comment/<str:post_id>/', DeletePostComment.as_view(),
         name='delete-post-comments-endpoint'),



]
