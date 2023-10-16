from rest_framework import serializers

class ProfileSerializer(serializers.Serializer):
    userinfo = serializers.DictField()
    portfolio_info = serializers.ListField(child=serializers.DictField())
    username = serializers.CharField()
    user_id = serializers.CharField()
    timezone = serializers.CharField()
    operations_right = serializers.CharField()
    org_id = serializers.CharField()
    
