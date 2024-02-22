from djongo import models

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