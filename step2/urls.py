from django.urls import path

from .views import (AdminApproveSocialMediaRequestView, FetchImages, ImageLibrary, MainAPIView, UserApprovalView, GenerateArticleView,
                    TargetedCitiesUpdateView,
                    TargetedCitiesCreateView, TargetedCitiesListView,
                    MentionView, MentionUpdateView, UnScheduledView, UnScheduledJsonView,
                    ScheduledJsonView, IndexView, MostRecentJSON, FacebookFormAPI,
                    InstaFormAPI, XFormAPI, LinkedInFormAPI, YoutubeFormView, PinterestFormView,
                    ClientProfileFormView, ListArticleView,
                    ArticleDetailView, Analytics,PostListView, PostDetailView, SavePostView,
                    GenerateArticleWikiView, WriteYourselfView, MediaScheduleView,
                    MediaPostView, SocialMediaChannelsView, LinkedAccountsJson, CanPostOnSocialMedia,
                    Comments, PostComments, CreatePostComments, EditPostView,
                    LinkMediaChannelsView, AryshareProfileView, PostDetailDropdownView, DeletePostComment,
                    FetchUserInfo, GroupHashtagView, GroupHashtagDetailView, SocialMediaPortfolioView,NewPostGeneration, LogoutUser)

app_name = 'generate_article'

urlpatterns = [
    path('main/', MainAPIView.as_view(), name='main-api'),
    path('user-approval/', UserApprovalView.as_view(),
         name='user_approval_api'),
    path('targeted_cities/', TargetedCitiesListView.as_view(),
         name='targeted-cities-list'),
    path('targeted_cities/create/', TargetedCitiesCreateView.as_view(),
         name='targeted-cities-create'),
    path('targeted_cities/update/', TargetedCitiesUpdateView.as_view(),
         name='targeted-cities-update'),
    path('mentions/', MentionView.as_view(),
         name='save_mentions'),
    path('update-mentions/', MentionUpdateView.as_view(),
         name='update_mentions'),
    path('facebook-form/', FacebookFormAPI.as_view(),
         name='facebook-form-api'),
    path('instagram-form/', InstaFormAPI.as_view(),
         name='instagram-form-api'),
    path('X-form/', XFormAPI.as_view(), name='X-form-api'),
    path('linkedIn-form/', LinkedInFormAPI.as_view(),
         name='linkedIn-form-api'),
    path('youtube-form/', YoutubeFormView.as_view(),
         name='youtube-form-api'),
    path('pinterest-form/', PinterestFormView.as_view(),
         name='pinterest-form-api'),
    path('client-form/', ClientProfileFormView.as_view(),
         name='client-form-api'),
    path('post-detail-dropdowns/', PostDetailDropdownView.as_view(),
         name='post-detail-dropdowns-api'),
    path('fetch_user_settings_data/', FetchUserInfo.as_view(),
         name='test'),

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
    path('edit_post/<str:post_id>/', EditPostView.as_view(), name='edit-post'),
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
    path('social_media_channels/approve/',
         AdminApproveSocialMediaRequestView.as_view(), name='approve_social_media_channels'),
    path('social_media_channels/',
         SocialMediaChannelsView.as_view(), name='social_media_channels'),
    path('linked-account/',
         LinkedAccountsJson.as_view(), name='linked-account'),
    path('can-post/',
         CanPostOnSocialMedia.as_view(), name='can-post'),
    path('link/linkusers/', AryshareProfileView.as_view(), name='can-post'),
    path('link/', LinkMediaChannelsView.as_view(), name='can-post'),
     path('logout/', LogoutUser.as_view(), name='logout'),
    path('comments/', Comments.as_view(), name='comments-endpoint'),
    path('comments/create/<str:post_id>/',
         CreatePostComments.as_view(), name='create-comments-endpoint'),
    path('comments/get-post-comments/<str:post_id>/',
         PostComments.as_view(), name='post-comments-endpoint'),
    path('comments/delete-comment/<str:post_id>/', DeletePostComment.as_view(),
         name='delete-post-comments-endpoint'),
    path('group-hashtags/', GroupHashtagView.as_view(),
         name='group-hashtag-endpoint'),
    path('group-hashtags/<str:group_hashtag_id>/', GroupHashtagDetailView.as_view(),
         name='group-hashtag-detail-endpoint'),
    path('social-media-portfolio/', SocialMediaPortfolioView.as_view(),
         name='social-media-portfolio-endpoint'),
    path('upload_image/', ImageLibrary.as_view(),
         name='upload-image-endpoint'),
    path('fetch_image/', FetchImages.as_view(),
         name='fetch-image-endpoint'),
     path('post_analytics/', Analytics.as_view(),
         name='post-analytics-endpoint'),
     path('post_generation/', NewPostGeneration.as_view(),
         name='post-generation-endpoint'),
     
     

]
