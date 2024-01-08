# Create your models here.
from django.db import models


class BaseModel(models.Model):
    """
    This model contains fields that are available in all the models
    """
    created_datetime = models.DateTimeField(auto_now_add=True, null=True)
    created_by = models.CharField(max_length=500, default='', null=True)
    modified_datetime = models.DateTimeField(auto_now=True, null=True)
    modified_by = models.CharField(max_length=500, default='', null=True)

    class Meta:
        abstract = True


class User(BaseModel):
    email = models.EmailField(blank=False)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name_plural = 'Article Api Users'


class IndustryData(BaseModel):
    CHOICES = (
        ('Technology & Telecom', 'Technology & Telecom'),
        ('Food & Beverages', 'Food & Beverages'),
        ('Travel & Leisure', 'Travel & Leisure'),
        ('Restaurants & Hotels', 'Restaurants & Hotels'),
        ('Automotive', 'Automotive'),
        ('Apparel', 'Apparel'),
        ('Banking & Insurance', 'Banking & Insurance'),
        ('Chain stores', 'Chain stores'),
        ('Alcohol', 'Alcohol'),
        ('Tobacco', 'Tobacco'),
        ('Business Services & consultancies', 'Business Services & consultancies'),
        ('Transportation', 'Transportation'),
        ('Media', 'Media'),
        ('Heavy equipments', 'Heavy equipments'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    target_industry = models.CharField(max_length=100, blank=False)
    target_product = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.user


class Sentences(BaseModel):
    SUBJECT_CHOICES = (
        ('Livinglab', 'Livinglab'),
        ('Innovation', 'Innovation'),
        ('User experience', 'User experience'),
        ('Storytelling', 'Storytelling'),
        ('Consumer Behaviour', 'Consumer Behaviour'),
        ('Behavioral economics', 'Behavioral economics'),
        ('Consumer Insights', 'Consumer Insights'),
        ('Statistics', 'Statistics'),
    )

    DETERMINANTS = (
        ('-', ''),
        ('the', 'the'),
        ('a', 'a'),
        ('an', 'an'),
    )

    SENTENCE_ARTS = (
        ('Declarative', 'Declarative'),
        ('Yes-no', 'Yes-no'),
        ('What(object)', 'What(object)'),
        ('Who(subject)', 'Who(subject)'),

    )
    TENSES = (
        ('present', 'present'),
        ('past', 'past'),
        ('future', 'future'),

    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    subject_determinant = models.CharField(max_length=100, blank=False, choices=DETERMINANTS,
                                           default=DETERMINANTS[0][0])
    subject = models.CharField(max_length=100, blank=False, choices=SUBJECT_CHOICES, default=SUBJECT_CHOICES[0][0])
    subject_number = models.CharField(max_length=100, blank=True, null=True)
    object_determinant = models.CharField(max_length=100, blank=False, choices=DETERMINANTS, default=DETERMINANTS[0][0])
    object = models.CharField(max_length=100, blank=False)
    object_number = models.CharField(max_length=100, blank=False)
    verb = models.CharField(max_length=100, blank=True, null=True)
    adjective = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.pk.__str__()

    class Meta:
        verbose_name_plural = 'Sentence grammar'


class SentenceResults(BaseModel):
    sentence_grammar = models.ForeignKey(Sentences, on_delete=models.CASCADE)
    sentence = models.TextField(max_length=400)
    sentence_type = models.CharField(max_length=100)

    def __str__(self):
        return self.sentence

    class Meta:
        verbose_name_plural = 'Sentence results'
