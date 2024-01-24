from django.db import models, transaction
from django.db.models import Q
from django.db.models.signals import pre_save
from django.dispatch import receiver


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


# Create your models here.
class User(models.Model):
    email = models.EmailField(blank=False)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name_plural = 'Users'


class Category(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='categories')
    name = models.CharField(max_length=1000, blank=False, null=False)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name


@receiver(pre_save, sender=Category)
def validate_category_save(sender, instance, **kwargs):
    if not instance.user and instance.is_default == False:
        raise ValueError('A category which is not default has to be assigned to a user!')

class UserTopic(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='user_topic')
    name = models.CharField(max_length=1000, blank=False, null=False)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name


@receiver(pre_save, sender=UserTopic)
def validate_category_save(sender, instance, **kwargs):
    if not instance.user and instance.is_default == False:
        raise ValueError('A category which is not default has to be assigned to a user!')

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
    # target_industry = models.CharField(max_length=100, blank=False)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True, blank=True,
                                 related_name='industry_data')
    target_product = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.user


class Sentences(models.Model):

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
    # subject = models.CharField(max_length=100, blank=False, choices=SUBJECT_CHOICES, default=SUBJECT_CHOICES[0][0])
    topic = models.ForeignKey(UserTopic, on_delete=models.PROTECT, null=True, blank=True,
                              related_name='sentence')
    subject_number = models.CharField(max_length=100, blank=True, null=True)
    object_determinant = models.CharField(max_length=100, blank=True, null=True, choices=DETERMINANTS,
                                          default=DETERMINANTS[0][0])
    object = models.CharField(max_length=100, blank=False)
    object_number = models.CharField(max_length=100, blank=False)
    verb = models.CharField(max_length=100, blank=True, null=True)
    adjective = models.CharField(max_length=100, blank=True, null=True)

    # sentence = models.TextField(max_length=400)# single sentence got from database
    #     for part two of the Modelform
    # tense = models.CharField(max_length=100, blank=False, choices=TENSES, default=TENSES[0][0])
    # sentence_art = models.CharField(max_length=100, blank=False, choices=SENTENCE_ARTS, default=SENTENCE_ARTS[0][0])
    # modal_verb = models.CharField(max_length=100, blank=False, choices=MODAL_VERBS, default=MODAL_VERBS[0][0])
    # progressive = models.BooleanField(default=False)
    # negated = models.BooleanField(default=False)
    # perfect = models.BooleanField(default=False)
    # passive = models.BooleanField(default=False)
    automated_rank = models.IntegerField(null=True, blank=True)  ##(abel_) update for ranking automations 
    def __str__(self):
        return self.pk.__str__()

    class Meta:
        verbose_name_plural = 'Sentence grammar'


class SentenceResults(models.Model):
    sentence_grammar = models.ForeignKey(Sentences, on_delete=models.CASCADE)
    sentence = models.TextField(max_length=400)
    sentence_type = models.CharField(max_length=100)

    # sentence_art = models.CharField(max_length=100, blank=False, choices=SENTENCE_ARTS, default=SENTENCE_ARTS[0][0])
    # modal_verb = models.CharField(max_length=100, blank=False, choices=MODAL_VERBS, default=MODAL_VERBS[0][0])
    def __str__(self):
        return self.sentence

    class Meta:
        verbose_name_plural = 'Sentence results'


class SentenceRank(models.Model):
    sentence_result = models.ForeignKey(SentenceResults, on_delete=models.CASCADE)
    sentence_rank = models.CharField(null=True, max_length=2)

    def __str__(self):
        return self.sentence_result.sentence


# to not to be used
class Topic(models.Model):
    owner = models.CharField(max_length=100, primary_key=True, default=None)
    rank = models.CharField(null=True, max_length=2)
    sentence = models.TextField(max_length=400)
    key = models.CharField(null=True, max_length=100, blank=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.owner

    class Meta:
        ordering = ['-updated']


# class MyTopic (models.Model):
#     owner = models.CharField(max_length=100,primary_key=True,default=None)
#     ranks = models.IntegerField(blank=True,null=True)
#     sentence = models.TextField(max_length=400)
#     keyes = models.CharField(null=True,max_length=100,blank=True)
#     username=models.CharField(null=True,max_length=100,blank=True)
#     updated = models.DateTimeField(auto_now=True)


#     def __str__(self):
#         return self.owner

#     class Meta:
#          ordering = ['-updated']

class MTopic(models.Model):
    username = models.CharField(null=True, max_length=100, blank=True)
    ranks = models.IntegerField(blank=True, null=True)
    sentence = models.TextField(max_length=400)
    keyes = models.CharField(null=True, max_length=100, blank=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['-updated']


class WebsiteManager:

    def create_user_categories_from_list(self, data: dict):
        """
        This method creates user categories from a list
        """
        with transaction.atomic():
            category_list = data.get('category_list')
            user = self.get_or_create_user(data)

            for name in category_list:
                if name == '':
                    continue
                Category.objects.create(
                    user=user,
                    name=name,
                    created_by=data.get('created_by'),
                )

    def create_user_topics_from_list(self, data: dict):
        """
        This method creates user topics from a list
        """
        with transaction.atomic():
            topic_list = data.get('topic_list')
            user = self.get_or_create_user(data)

            for name in topic_list:
                if name == '':
                    continue
                UserTopic.objects.create(
                    user=user,
                    name=name,
                    created_by=data.get('created_by'),
                )

    def get_user_categories_by_email(self, data):
        """
        This method returns categories created by a user
        """
        q_filter = Q(user__email=data.get('email')) | Q(is_default=True)
        return Category.objects.filter(q_filter)

    def get_user_topics_by_email(self, data):
        """
        This method returns topics created by a user
        """
        q_filter = Q(user__email=data.get('email')) | Q(is_default=True)
        return UserTopic.objects.filter(q_filter)

    def get_or_create_user(self, data):
        """
        This method returns or creates a user
        """
        user = User.objects.filter(email=data.get('email'))
        if user:
            return user.last()
        return User.objects.create(email=data.get('email'))
