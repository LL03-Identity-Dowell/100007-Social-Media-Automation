from rest_framework import serializers

class ProfileSerializer(serializers.Serializer):
    userinfo = serializers.DictField()
    portfolio_info = serializers.ListField(child=serializers.DictField())
    username = serializers.CharField()
    user_id = serializers.CharField()
    timezone = serializers.CharField()
    operations_right = serializers.CharField()
    org_id = serializers.CharField()
    
class UserApprovalSerializer(serializers.Serializer):
    session_id = serializers.CharField(required=True)
    user_id = serializers.IntegerField(required=True)
    
class PostSerializer(serializers.Serializer):
    title = serializers.CharField()
    paragraph = serializers.CharField()
    source = serializers.CharField()
    
class SessionSerializer(serializers.Serializer):
    session_id = serializers.CharField()
    
class CitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

    
