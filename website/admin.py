from django.contrib import admin

# Register your models here.
from website.models import Sentences, SentenceResults, SentenceRank, MTopic, IndustryData, Category, UserTopic

admin.site.register(Sentences)
admin.site.register(SentenceResults)
admin.site.register(SentenceRank)
admin.site.register(MTopic)

@admin.register(IndustryData)
class IndustryDataAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'category', 'target_product', 'created_datetime']
    list_filter = ['created_datetime', ]


@admin.register(UserTopic)
class UserTopicAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'name', 'created_datetime']
    list_filter = ['created_datetime', ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'name', 'created_datetime']
    list_filter = ['created_datetime', ]
