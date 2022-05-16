from django.contrib import admin

# Register your models here.
from website.models import Sentences, SentenceResults, SentenceRank

admin.site.register(Sentences)
admin.site.register(SentenceResults)
admin.site.register(SentenceRank)
