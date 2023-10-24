from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from website.models import IndustryData, Sentences, Category, UserTopic


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


class CombinedSentenceIndustrySerializer(IndustrySerializer):
    NUMBERS = (
        ('singular', 'singular'),
        ('plural', 'plural'),
    )
    subject_number = serializers.ChoiceField(choices=NUMBERS, default='singular')
    object_number = serializers.ChoiceField(choices=NUMBERS, default='singular')
    category = serializers.ChoiceField(choices=Category.objects.all(), default='singular')
    target_product = serializers.CharField(max_length=100, )

    class Meta:
        model = Sentences
        fields = IndustrySerializer.Meta.fields + [
            'subject_determinant', 'topic', 'subject_number', 'object_determinant', 'object', 'object_number',
            'verb', 'adjective',
        ]
