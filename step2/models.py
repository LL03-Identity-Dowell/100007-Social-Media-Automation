from djongo import models


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

class Data(models.Model):
    title = models.CharField(max_length=130)
    paragraph = models.TextField(max_length=2000)
    source = models.TextField(max_length=2000)
    STATUS_CHOICES = [
        ("Accepted", 'Accepted'),
        ("Rejected", 'Rejected'),
    ]
    status = models.CharField(max_length=12,choices=STATUS_CHOICES, null = True, blank = True)

class paragraph(models.Model):
    title = models.CharField(max_length=130)
    paragraph = models.TextField(max_length=2000)
    citation_and_url = models.TextField(max_length=2000)
    STATUS_CHOICES = [
        ("Accepted", 'Accepted'),
        ("Rejected", 'Rejected'),
    ]
    status = models.CharField(max_length=12,choices=STATUS_CHOICES, null = True, blank = True)

class stepFour(models.Model):
    title = models.CharField(max_length=130)
    paragraph = models.TextField(max_length=2000)
    source = models.TextField(max_length=2000, blank =False, null = True)
    qualitative_categorization = models.CharField(max_length=130)
    targeted_for = models.CharField(max_length = 130)
    designed_for = models.CharField(max_length = 130)
    targeted_category = models.CharField(max_length = 130)
    image = models.ImageField(upload_to ='article_images/')


class SocialMediaRequest(BaseModel):
    username = models.CharField(max_length=500, null=False, blank=False)
    email = models.CharField(max_length=500, null=False, blank=False)
    name = models.CharField(max_length=500, null=False, blank=False)
    is_approved = models.BooleanField(default=False)
