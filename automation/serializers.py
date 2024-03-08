from rest_framework import serializers

from config_master import SOCIAL_PLATFORM_CHOICES


class AutomationSerializer(serializers.Serializer):
    number_of_posts_per_day = serializers.IntegerField(required=True)
    channel = serializers.ChoiceField(required=True, choices=SOCIAL_PLATFORM_CHOICES)
