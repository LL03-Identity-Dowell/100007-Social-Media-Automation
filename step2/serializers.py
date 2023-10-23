from rest_framework import serializers


class ProfileSerializer(serializers.Serializer):
    userinfo = serializers.DictField()
    portfolio_info = serializers.ListField(child=serializers.DictField())
    username = serializers.CharField()
    user_id = serializers.CharField()
    timezone = serializers.CharField()
    operations_right = serializers.CharField()
    org_id = serializers.CharField()


class ListArticleSerializer(serializers.Serializer):
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


class RankedTopicListSerializer(serializers.Serializer):
    ranks = serializers.CharField()
    sentence = serializers.CharField()
    key = serializers.CharField()
    created_by = serializers.CharField()
    
