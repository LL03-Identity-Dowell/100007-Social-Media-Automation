# Register your models here.
from django.contrib import admin

from article_api.models import User, IndustryData, Sentences, SentenceResults


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    SocialMediaRequest Admin
    """
    list_display = ('id', 'email', 'created_datetime', 'modified_datetime')
    list_display_links = ('id',)
    search_fields = ('id', 'email', 'created_datetime', 'modified_datetime')
    ordering = ('-created_datetime',)
    readonly_fields = ('modified_by',)


@admin.register(Sentences)
class SentencesAdmin(admin.ModelAdmin):
    """
    Sentences Admin
    """
    list_display = ('id', 'subject', 'verb', 'adjective', 'created_datetime', 'modified_datetime')
    list_display_links = ('id',)
    search_fields = ('id', 'subject', 'created_datetime', 'modified_datetime')
    ordering = ('-created_datetime',)
    readonly_fields = ('modified_by',)


@admin.register(IndustryData)
class IndustryDataAdmin(admin.ModelAdmin):
    """
    IndustryData Admin
    """
    list_display = ('id', 'user', 'target_industry', 'target_product', 'created_datetime', 'modified_datetime')
    list_display_links = ('id',)
    search_fields = ('id', 'target_industry', 'created_datetime', 'modified_datetime')
    ordering = ('-created_datetime',)
    readonly_fields = ('modified_by',)


@admin.register(SentenceResults)
class SentenceResultsAdmin(admin.ModelAdmin):
    """
    SentenceResults Admin
    """
    list_display = ('id', 'sentence', 'sentence_type', 'created_datetime', 'modified_datetime')
    list_display_links = ('id',)
    search_fields = ('id', 'sentence', 'created_datetime', 'modified_datetime')
    ordering = ('-created_datetime',)
    readonly_fields = ('modified_by',)
