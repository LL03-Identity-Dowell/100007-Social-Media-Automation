from django.contrib import admin
from .models import Data, paragraph, stepFour, SocialMediaRequest

# Register your models here.
admin.site.register(Data)
admin.site.register(paragraph)
admin.site.register(stepFour)


class SocialMediaRequestAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'is_approved')

    actions = ['approve_selected', 'reject_selected']

    def approve_selected(self, request, queryset):
        queryset.update(is_approved=True)
    approve_selected.short_description = "Approve selected items"

    def reject_selected(self, request, queryset):
        queryset.update(is_approved=False)
    reject_selected.short_description = "Reject selected items"


admin.site.register(SocialMediaRequest, SocialMediaRequestAdmin)
