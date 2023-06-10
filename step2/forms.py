from django import forms
from .models import stepFour
from tempus_dominus.widgets import DatePicker, TimePicker, DateTimePicker

class MyForm(forms.Form):
    date_field = forms.DateField(widget=DatePicker())
    date_field_required_with_min_max_date = forms.DateField(
        required=True,
        widget=DatePicker(
            options={
                'minDate': '2009-01-20',
                'maxDate': '2017-01-20',
            },
        ),
        initial='2013-01-01',
    )
    """
    In this example, the date portion of `defaultDate` is irrelevant;
    only the time portion is used. The reason for this is that it has
    to be passed in a valid MomentJS format. This will default the time
    to be 14:56:00 (or 2:56pm).
    """
    time_field = forms.TimeField(
        widget=TimePicker(
            options={
                'enabledHours': [9, 10, 11, 12, 13, 14, 15, 16],
                'defaultDate': '1970-01-01T14:56:00'
            },
            attrs={
                'input_toggle': True,
                'input_group': False,
            },
        ),
    )
    datetime_field = forms.DateTimeField(
        widget=DateTimePicker(
            options={
                'useCurrent': True,
                'collapse': False,
            },
            attrs={
                'append': 'fa fa-calendar',
                'icon_toggle': True,
            }
        ),
    )

class StepFourForm(forms.ModelForm):
    class Meta:
        model = stepFour
        fields = [
                  "title",
                  "paragraph",
                  "source",
                  "qualitative_categorization",
                  "targeted_for",
                  "designed_for",
                  "targeted_category",
                  "image",
                  ]
    # class Meta:
    #     model = User
    #     fields = '__all__'


class VerifyArticleForm(forms.Form):
    url = forms.URLField(max_length=500, required=True, )
    articletextarea = forms.CharField(widget=forms.Textarea, max_length=2000, required=True, )

    class Meta:
        fields = ('url', 'articletextarea',)

    def __init__(self, *args, **kwargs):
        super(VerifyArticleForm, self).__init__(*args, **kwargs)
        self.fields['url'].widget.attrs['placeholder'] = 'Enter source url of the article'
        self.fields['articletextarea'].widget.attrs['placeholder'] = 'Type here......'

        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'
