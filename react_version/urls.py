from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from server import serverReports

from step2 import views as step2_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v2/', include('step2.urls')),
    path('server/', serverReports),
    path('website/api/v2/', include('website.urls')),
    path('credit/', include('credits.urls')),

    path('api/v2/', include('article_api.urls')),
    path('automation/api/v2/', include('automation.urls')),

]

# Set static url in urls.py file of project
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
