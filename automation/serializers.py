from rest_framework import serializers


class AutomationSerializer(serializers.Serializer):
    page_id = serializers.CharField(required=True)
    page_link = serializers.CharField(required=True)
    number_of_posts_per_day = serializers.IntegerField(required=True)
    password = serializers.CharField(required=True)
