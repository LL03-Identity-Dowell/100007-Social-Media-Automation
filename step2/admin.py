from django.contrib import admin

from .models import Data, paragraph, stepFour, SocialMediaRequest

# Register your models here.
admin.site.register(Data)
admin.site.register(paragraph)
admin.site.register(stepFour)


@admin.register(SocialMediaRequest)
class SocialMediaRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'name', 'is_approved', 'created_datetime']
    list_filter = ['created_datetime', ]
