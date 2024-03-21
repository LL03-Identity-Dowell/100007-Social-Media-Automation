from rest_framework import serializers

from config_master import SOCIAL_PLATFORM_CHOICES


class AutomationSerializer(serializers.Serializer):
    number_of_posts_per_day = serializers.IntegerField(required=True)
    number_of_days = serializers.IntegerField(default=1)
    channel = serializers.ChoiceField(required=True, choices=SOCIAL_PLATFORM_CHOICES)
    links = serializers.ListSerializer(child=serializers.CharField(), required=True)
    target_cities = serializers.ListSerializer(child=serializers.CharField(), required=True)
    hashtags = serializers.ListSerializer(child=serializers.CharField(), required=True)
