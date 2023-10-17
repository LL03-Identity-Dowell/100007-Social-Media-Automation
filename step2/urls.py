from django.urls import path

from . import views
from .views import (MainAPIView, UserApprovalView, GenerateArticleView,
                    PostListView, TargetedCitiesUpdateView,
                    TargetedCitiesCreateView, TargetedCitiesListView,
                    HashMentionView, HashMentionUpdateView, UnScheduledView, UnScheduledJsonView,
                    ScheduledJsonView, IndexView,MostRecentJSON)


app_name = 'generate_article'

urlpatterns = [
    # path('', views.under_maintenance, name='home'),
    path('', views.dowell_login, name="dowelllogin"),
    path('scheduled/', views.scheduled, name='scheduled-posts'),
    path('scheduler/', views.post_scheduler, name='post-scheduler'),
    path('article_list/articles/', views.list_article_view,
         name='article-list-articles'),
    path('article_list/<str:filter>/', views.filtered_list_article,
         name='filtered-article-list'),
    path('post-detail/', views.post_detail, name='post-detail'),
    path('article-detail/', views.article_detail, name='article-detail'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),  # socialmedia
    path('logout', views.Logout, name="logout"),  # client admin
    path('reset/password/', views.reset_password, name='reset-password'),
    path('confirm/reset/password/', views.confirm_reset_password,
         name='confirm-reset-password'),
    path('forget_password/', views.forget_password, name='forget_password'),
    path('social_media_channels/', views.social_media_channels,
         name='social_media_channels'),
    path('link/linkusers/', views.aryshare_profile, name='aryshare'),
    path('link_social_media/', views.link_media_channels, name='link_social_media'),
    path('link/facebook/', views.facebook, name='facebook'),
    path('link/facebook/form/', views.facebook_form, name='facebook-form'),
    path('link/instagram/', views.insta, name='instagram'),
    path('link/instagram/form/', views.insta_form, name='instagram-form'),
    path('link/twitter/', views.twitter, name='twitter'),
    path('link/twitter/form/', views.twitter_form, name='twitter-form'),
    path('link/linkedin/', views.linkedin, name='linkedin'),
    path('link/linkedin/form/', views.linkedin_form, name='linkedin-form'),
    path('link/youtube/', views.youtube, name='youtube'),
    path('link/youtube/form/', views.youtube_form, name='youtube-form'),
    path('link/pinterest/', views.Pinterest, name='pinterest'),
    path('link/pinterest/form/', views.pinterest_form, name='pinterest-form'),
    path('client/profile/', views.client_profile, name='client-profile'),
    path('client/profile/form/', views.client_profile_form,
         name='client-profile-form'),
    path('client/', views.client, name='client'),
    path('user/team/', views.user_team, name='user-team'),
    path('user/usage/', views.user_usage, name='user-usage'),
    path('user/plan/', views.user_plan, name='user-plan'),
    path('comments/', views.comments, name='comments'),
    path('generate/comments/', views.generate_comments, name='generate-comments'),
    path('selected/comments/', views.selected_comments, name='selected-comment'),
    path('emoji/comments/', views.comments_emojis, name='comment-emoji'),
    path('topics/', views.topics, name='topics'),
    path('signup/', views.register, name='register'),
    path('article/Wiki/', views.generate_article_wiki, name='submit-title-wiki'),
    path('write/article/', views.write_yourself, name='write-yourself'),
    path('verify/article/', views.verify_article, name='verify-article'),
    path('user/info/', views.User_Info_ListView, name='user-info'),
    path('user/detail/<str:id>/', views.User_DetailView, name='user-detail'),
    path('address/', views.address, name='address'),
    path('recent/', views.most_recent, name='recent-post'),
    path('save_post/', views.Save_Post, name='save-post'),
    path('media_post/', views.Media_Post, name='media-post'),
    path('media_schedule/', views.Media_schedule, name='media-schedule'),
    path('proxy-api/', views.frontend_api_request, name='proxy-api'),
    path('exit/', views.exit_view, name='exit'),
    path('linked-account/', views.linked_account_json, name='linked-account'),
    # path('list/article',views.list_article, name='list-article'),
    # path('saved/',views.save_article,name='save-article'),



    # React endpoints start here
    path('api/v1/main/', MainAPIView.as_view(), name='main-api'),
    path('api/v1/user-approval/', UserApprovalView.as_view(),
         name='user_approval_api'),
    path('api/v1/article/AI/', GenerateArticleView.as_view(), name='submit-title'),
    path('api/v1/article_list/', PostListView.as_view(), name='submit-title'),
    path('api/v1/csrf_cookie/', GetCSRFToken.as_view(), name='csrftoken'),
    path('api/v1/targeted_cities/', TargetedCitiesListView.as_view(),
         name='targeted-cities-list'),
    path('api/v1/targeted_cities/create/', TargetedCitiesCreateView.as_view(),
         name='targeted-cities-create'),
    path('api/v1/targeted_cities/update/', TargetedCitiesUpdateView.as_view(),
         name='targeted-cities-update'),
    path('api/v1/hash-tags-and-mentions/', HashMentionView.as_view(),
         name='save_hash_mentions'),
    path('api/v1/update-hash-tags-and-mentions/ ', HashMentionUpdateView.as_view(),
         name='update_hash_mentions'),
    path('api/v1/unscheduled/', UnScheduledView.as_view(), name='unscheduled'),
    path('api/v1/unscheduled-json/',
         UnScheduledJsonView.as_view(), name='unscheduled-json'),
    path('api/v1/scheduled-json/',
         ScheduledJsonView.as_view(), name='scheduled-json'),
    path('api/v1/article/generate/', IndexView.as_view(),
         name='index'),  # Create Article(step-2)
    #step-4
    path('api/v1/recent_posts/', MostRecentJSON.as_view(),
         name='recent_post'), 







]
