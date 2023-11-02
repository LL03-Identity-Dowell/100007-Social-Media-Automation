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
    org_id = models.CharField(max_length=500, null=True, blank=True)
    is_approved = models.BooleanField(default=False)


class Step2Manager:
    def create_social_media_request(self, data):
        """
        This method creates social media request
        """
        SocialMediaRequest.objects.filter(
            username=data.get('username'),
            org_id=data.get('org_id'),
        ).delete()
        return SocialMediaRequest.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            name=data.get('name'),
            org_id=data.get('org_id'),
        )

    def get_all_unapproved_social_media_request(self, data):
        """
        """
        return SocialMediaRequest.objects.filter(
            is_approved=False,
        )

    def update_social_media_request_status(self, data):
        return SocialMediaRequest.objects.filter(id__in=data.get('social_media_request_id')).update(
            is_approved=data.get('is_approved'))

    def get_approved_user_social_media_request(self, data):
        social_media_request = SocialMediaRequest.objects.filter(
            username=data.get('username'),
            org_id=data.get('org_id'),
            is_approved=True,
        )
        if social_media_request:
            return social_media_request.last()