from django.contrib import admin

from .models import Data, paragraph, stepFour, SocialMediaRequest

# Register your models here.
admin.site.register(Data)
admin.site.register(paragraph)
admin.site.register(stepFour)


@admin.register(SocialMediaRequest)
class SocialMediaRequestAdmin(admin.ModelAdmin):
    """
    SocialMediaRequest Admin
    """
    list_display = ('id', 'username', 'is_approved', 'created_datetime', 'modified_datetime')
    list_display_links = ('id',)
    search_fields = ('id', 'created_datetime', 'modified_datetime')
    ordering = ('-created_datetime',)
    readonly_fields = ('modified_by',)
