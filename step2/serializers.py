from rest_framework import serializers

from config_master import SOCIAL_PLATFORM_CHOICES


class ProfileSerializer(serializers.Serializer):
    userinfo = serializers.DictField()
    portfolio_info = serializers.ListField(child=serializers.DictField())
    username = serializers.CharField()
    user_id = serializers.CharField()
    timezone = serializers.CharField()
    operations_right = serializers.CharField()
    org_id = serializers.CharField()


class ListArticleSerializer(serializers.Serializer):
    article_id = serializers.CharField()
    title = serializers.CharField()
    paragraph = serializers.CharField()
    source = serializers.CharField()


class UserApprovalSerializer(serializers.Serializer):
    status = serializers.CharField(required=True)


class PostSerializer(serializers.Serializer):
    title = serializers.CharField()
    paragraph = serializers.CharField()
    source = serializers.CharField()


class SessionSerializer(serializers.Serializer):
    session_id = serializers.CharField()


class CitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    country = serializers.CharField()


class UnScheduledJsonSerializer(serializers.Serializer):
    response = serializers.ListField(child=serializers.DictField())


class ScheduledJsonSerializer(serializers.Serializer):
    response = serializers.ListField(child=serializers.DictField())


class MostRecentJsonSerializer(serializers.Serializer):
    response = serializers.ListField(child=serializers.DictField())


class RankedTopicListSerializer(serializers.Serializer):
    ranks = serializers.CharField()
    sentence = serializers.CharField()
    key = serializers.CharField()
    created_by = serializers.CharField()


class PostCommentSerializer(serializers.Serializer):
    platforms = serializers.MultipleChoiceField(required=True, choices=SOCIAL_PLATFORM_CHOICES)
    comment = serializers.CharField(required=True)


class DeletePostCommentSerializer(serializers.Serializer):
    platform = serializers.ChoiceField(required=True, choices=SOCIAL_PLATFORM_CHOICES)
    comment_id = serializers.CharField(required=True)


class GroupHashtagSerializer(serializers.Serializer):
    group_name = serializers.CharField(required=True)
    hashtags = serializers.ListSerializer(child=serializers.CharField(required=True))


class EditPostSerializer(serializers.Serializer):
    title = serializers.CharField(required=True, )
    paragraph = serializers.CharField(required=True)
    image = serializers.URLField(required=True)


class PortfolioChannelListSerializer(serializers.ListSerializer):
    allow_empty = False


class PortfolioChannelsSerializer(serializers.Serializer):
    portfolio_code = serializers.CharField(required=True)
    channels = serializers.MultipleChoiceField(required=True, choices=SOCIAL_PLATFORM_CHOICES)

    class Meta:
        list_serializer_class = PortfolioChannelListSerializer


class SocialMediaRequestSerializer(serializers.Serializer):
    approve = serializers.ChoiceField(required=True, choices=(
        ('Approve Selected', 'Approve Selected'),
        ('Reject Selected', 'Reject Selected'),
        ('Approve All', 'Approve All'),
    ))
    social_media_request_id = serializers.ListField(child=serializers.IntegerField(required=True), required=True)
