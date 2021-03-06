from django.urls import path
from . import views

app_name = 'generate_article'

urlpatterns = [
    path('', views.main, name='main-view'),
    path('scheduled/', views.scheduled, name='scheduled-posts'),
    path('schedule/', views.unscheduled, name='unscheduled-posts'),
    path('scheduler/',views.post_scheduler, name='post-scheduler'),
    path('article_list/',views.list_article, name='article-list'),
    path('article_list/<str:filter>/', views.filtered_list_article, name='filtered-article-list'),
    path('article_detail/',views.article_detail, name='article-detail'),
    path('login/',views.login, name='login'),
    path('logout/',views.logout, name='logout'),
    path('reset/password/',views.reset_password, name='reset-password'),
    path('confirm/reset/password/',views.confirm_reset_password, name='confirm-reset-password'),
    path('forget_password/', views.forget_password, name='forget_password'),
    path('user/approval/',views.user_approval, name='user-approval'),
    path('user/approval/form/',views.user_approval_form, name='user-approval-form'),
    path('social_media_channels/',views.social_media_channels, name='social_media_channels'),
    path('link/facebook/',views.facebook, name='facebook'),
    path('link/facebook/form/',views.facebook_form, name='facebook-form'),
    path('link/instagram/',views.insta, name='instagram'),
    path('link/instagram/form/',views.insta_form, name='instagram-form'),
    path('link/twitter/',views.twitter, name='twitter'),
    path('link/twitter/form/',views.twitter_form, name='twitter-form'),
    path('link/linkedin/',views.linkedin, name='linkedin'),
    path('link/linkedin/form/',views.linkedin_form, name='linkedin-form'),
    path('link/youtube/',views.youtube, name='youtube'),
    path('link/youtube/form/',views.youtube_form, name='youtube-form'),
    path('client/profile/',views.client_profile, name='client-profile'),
    path('client/profile/form/',views.client_profile_form, name='client-profile-form'),
    path('client/',views.client, name='client'),
    path('user/team/',views.user_team, name='user-team'),
    path('user/usage/',views.user_usage, name='user-usage'),
    path('user/plan/',views.user_plan, name='user-plan'),
    path('comments/',views.comments, name='comments'),
    path('generate/comments/',views.generate_comments, name='generate-comments'),
    path('selected/comments/',views.selected_comments, name='selected-comment'),
    path('emoji/comments/',views.comments_emojis, name='comment-emoji'),
    path('topics/',views.topics, name='topics'),
    path('signup/',views.register, name='register'),
    path('article/generate/', views.index, name='index-view'),
    path('article/automate/',views.generate_article_automatically, name='automatic-view'),
    path('article/AI/',views.generate_article, name='submit-title'),
    path('article/Wiki/',views.generate_article_wiki, name='submit-title-wiki'),
    path('write/article/',views.write_yourself, name='write-yourself'),
    path('verify/article/',views.verify_article, name='verify-article'),
    # path('list/article',views.list_article, name='list-article'),
    # path('saved/',views.save_article,name='save-article'),
]
