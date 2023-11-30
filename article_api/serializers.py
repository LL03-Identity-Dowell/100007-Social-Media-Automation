from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from website.models import IndustryData, Sentences, Category, UserTopic


class GenerateArticleSerializer(serializers.Serializer):
    article_title = serializers.CharField(required=True, max_length=100)


class IndustrySerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        q_filter = Q(is_default=True)
        self.fields['category'].queryset = Category.objects.filter(
            q_filter).order_by('-created_datetime')
        self.fields['category'].required = True

    class Meta:
        model = IndustryData
        fields = ['category', 'target_product']
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

    class Meta:
        model = Sentences
        fields = (
            'subject_determinant', 'topic', 'subject_number', 'object_determinant', 'object', 'object_number',
            'verb', 'adjective', 'email',
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        q_filter = Q(is_default=True)
        self.fields['topic'].queryset = UserTopic.objects.filter(
            q_filter).order_by('-created_datetime')
        self.fields['topic'].required = True
        self.fields['object_determinant'].required = True
