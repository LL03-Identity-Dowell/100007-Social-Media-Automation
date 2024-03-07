from rest_framework import serializers


class AutomationSerializer(serializers.Serializer):
    number_of_posts_per_day = serializers.IntegerField(required=True)
