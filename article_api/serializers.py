from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from article_api.models import IndustryData, Sentences


class GenerateArticleSerializer(serializers.Serializer):
    article_title = serializers.CharField(required=True, max_length=100)


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryData
        fields = ['target_industry', 'target_product']
        labels = {
            'target_industry': _('Category'),
            'target_product': _('Product/Services'),
        }


class SentenceSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, )
    NUMBERS = (
        ('singular', 'singular'),
        ('plural', 'plural'),
    )
    subject_number = serializers.ChoiceField(choices=NUMBERS, default='singular')
    object_number = serializers.ChoiceField(choices=NUMBERS, default='singular')
    subject = serializers.CharField(required=True, max_length=100)

    class Meta:
        model = Sentences
        fields = (
            'subject_determinant', 'subject_number', 'object_determinant', 'object', 'object_number',
            'verb', 'adjective', 'email', 'subject'
        )

