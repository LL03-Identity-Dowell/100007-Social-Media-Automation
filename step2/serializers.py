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
    product_service_status = serializers.CharField()


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
    subject = serializers.CharField(allow_blank=True, )
    verb = serializers.CharField()


class PostCommentSerializer(serializers.Serializer):
    platforms = serializers.MultipleChoiceField(
        required=True, choices=SOCIAL_PLATFORM_CHOICES)
    comment = serializers.CharField(required=True)


class DeletePostCommentSerializer(serializers.Serializer):
    platform = serializers.ChoiceField(
        required=True, choices=SOCIAL_PLATFORM_CHOICES)
    comment_id = serializers.CharField(required=True)


class GroupHashtagSerializer(serializers.Serializer):
    group_name = serializers.CharField(required=True)
    hashtags = serializers.ListSerializer(
        child=serializers.CharField(required=True))


class EditPostSerializer(serializers.Serializer):
    title = serializers.CharField(required=True, )
    paragraph = serializers.CharField(required=True)
    image = serializers.URLField(required=True)


class PortfolioChannelListSerializer(serializers.ListSerializer):
    allow_empty = False


class PortfolioChannelsSerializer(serializers.Serializer):
    portfolio_code = serializers.CharField(required=True)
    channels = serializers.MultipleChoiceField(
        required=True, choices=SOCIAL_PLATFORM_CHOICES)

    class Meta:
        list_serializer_class = PortfolioChannelListSerializer


class SocialMediaRequestSerializer(serializers.Serializer):
    approve = serializers.ChoiceField(required=True, choices=(
        ('Approve Selected', 'Approve Selected'),
        ('Reject Selected', 'Reject Selected'),
        ('Approve All', 'Approve All'),
    ))
    social_media_request_id = serializers.ListField(
        child=serializers.IntegerField(required=True), required=True)


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    def validate_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image size should be 5MB.")
        file_extension = value.name.split('.')[-1].lower()
        if file_extension not in ['png', 'jpg', 'jpeg']:
            raise serializers.ValidationError(
                "Invalid image format. Only PNG and JPEG are allowed.")
        return value
    
    
class DataSerializer(serializers.Serializer):
    id = serializers.CharField()
    platform = serializers.CharField()
    
class ChannelAccessSerializer(serializers.Serializer):
    username = serializers.CharField()
    portfolio_info = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

    def validate_portfolio_info(self, value):
        for portfolio in value:
            if 'member_type' not in portfolio or 'username' not in portfolio:
                raise serializers.ValidationError("Each portfolio must have 'member_type' and 'username' fields.")
        return value
