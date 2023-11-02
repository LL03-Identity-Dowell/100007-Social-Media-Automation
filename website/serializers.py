from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from website.models import IndustryData, Sentences, UserTopic, Category


class IndustrySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        email = kwargs.pop('email')
        super().__init__(*args, **kwargs)

        q_filter = Q(user__email=email) | Q(is_default=True)
        self.fields['category'].queryset = Category.objects.filter(q_filter).order_by('-created_datetime')
        self.fields['category'].required = True

    class Meta:
        model = IndustryData
        fields = ['category', 'target_product']
        labels = {
            'target_industry': _('Category'),
            'target_product': _('Product/Services'),
        }


class SentenceSerializer(serializers.ModelSerializer):
    NUMBERS = (
        ('singular', 'singular'),
        ('plural', 'plural'),
    )
    subject_number=serializers.ChoiceField(choices=NUMBERS,default='singular')
    object_number=serializers.ChoiceField(choices=NUMBERS,default='singular')

    def __init__(self, *args, **kwargs):
        email = kwargs.pop('email')
        super().__init__(*args, **kwargs)

        q_filter = Q(user__email=email) | Q(is_default=True)
        self.fields['topic'].queryset = UserTopic.objects.filter(q_filter).order_by('-created_datetime')
        self.fields['topic'].required = True
        self.fields['object_determinant'].required = True

    class Meta:
        model = Sentences
        fields = (
            'subject_determinant', 'topic', 'subject_number', 'object_determinant', 'object', 'object_number',
            'verb', 'adjective',
        )


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class UserTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTopic
        fields = ('id', 'name')


class SelectedResultSerializer(serializers.Serializer):
    rank_1 = serializers.CharField(required=True)
    rank_2 = serializers.CharField(required=True)
    rank_3 = serializers.CharField(required=True)
    rank_4 = serializers.CharField(required=False)
    rank_5 = serializers.CharField(required=False)
    rank_6 = serializers.CharField(required=False)
    rank_7 = serializers.CharField(required=False)
    rank_8 = serializers.CharField(required=False)
    rank_9 = serializers.CharField(required=False)
    rank_10 = serializers.CharField(required=False)
    rank_11 = serializers.CharField(required=False)
    rank_12 = serializers.CharField(required=False)
