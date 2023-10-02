from django import forms
from django.utils.translation import ugettext_lazy as _

from website.models import User, IndustryData, Sentences, Category


class UserEmailForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'
        widgets = {
            'email': forms.TextInput(attrs={'class': 'form-control'}),
        }


class IndustryForm(forms.ModelForm):
    class Meta:
        model = IndustryData
        fields = ('category', 'target_product')
        labels = {
            'category': _('Category'),
            'target_product':_('Product/Services'),
        }
        widgets = {
            'category': forms.Select(attrs={'class': 'form-select'}),
            # 'target_industry': forms.TextInput(attrs={'class': 'form-select'}),
            'target_product': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        email = kwargs.pop('email')
        super(IndustryForm, self).__init__(*args, **kwargs)

        self.fields['category'].queryset = Category.objects.filter(user__email=email)






class SentencesForm(forms.ModelForm):
    NUMBERS = (
        ('singular', 'singular'),
        ('plural', 'plural'),
    )

    subject_number = forms.ChoiceField(choices=NUMBERS, initial='singular', widget=forms.RadioSelect(attrs={'class': "custom-radio-list"}))
    object_number = forms.ChoiceField(choices=NUMBERS, initial='singular', widget=forms.RadioSelect(attrs={'class': "custom-radio-list"}))

    class Meta:
        model = Sentences
        fields = (
            'subject_determinant', 'topic', 'subject_number', 'object_determinant', 'object', 'object_number',
            'verb', 'adjective',
        )
        labels = {
            'subject_determinant': _('Specify Topic'),
            'object': _('Purpose of Article'),
            'topic': _('Your topic'),
            'object_determinant': _('Specify Purpose'),
            'verb': _('Activities'),
            'adjective': _('Can you specify activity'),


        }
        help_texts = {
            'verb': _('(verbs eg. test)'),
            'adjective': _(''),
            'object': _('(e.g digital documentation)')
            # 'subject': _('(subject of a sentence is the person, place, thing, or idea that is performing the action)'),
        }

        widgets = {
            'subject_determinant': forms.Select(attrs={'class': 'form-select'}),
            'topic': forms.Select(attrs={'class': 'form-select'}),
            'object_determinant': forms.Select(attrs={'class': 'form-select'}),
            'object': forms.TextInput(attrs={'class': 'form-control'}),
            'verb': forms.TextInput(attrs={'class': 'form-control'}),
            'adjective': forms.TextInput(attrs={'class': 'form-control'})
        }

    def clean(self):
        cleaned_data = super().clean()
        subject_number = cleaned_data.get('subject_number')
        object_number = cleaned_data.get('object_number')

        if subject_number == 'singular' and object_number == 'plural':
            self.add_error('object_number', _('Cannot have a singular subject and a plural object.'))
        elif subject_number == 'plural' and object_number == 'singular':
            self.add_error('object_number', _('Cannot have a plural subject and a singular object.'))

        return cleaned_data
