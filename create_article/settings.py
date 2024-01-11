"""
Django settings for create_article project.

Generated by 'django-admin startproject' using Django 3.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import mimetypes
import os
from pathlib import Path

from decouple import config

mimetypes.add_type("text/javascript", ".js", True)
mimetypes.add_type("text/css", ".css", True)
mimetypes.add_type("text/html", ".html", True)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '#&2i(s#=e#3ez2m6q#w!p+ok^rp@3(q7g%iqj*bkr6piklhd52'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework.authtoken',
    "bootstrap_datepicker_plus",
    'step2',
    'formtools',
    'crispy_forms',
    'website',
    'djangobower',
    'bootstrap4',
    'rest_framework',
    'tempus_dominus',
    'sorl.thumbnail',
    'article_api',
    'django_q',


    'corsheaders',
    'credits',
]

CRISPY_TEMPLATE_PACK = 'bootstrap4'

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # 'djangobower.finders.BowerFinder',
]


ROOT_URLCONF = 'create_article.urls'


BOWER_INSTALLED_APPS = (
    'jquery#1.9',
    'underscore',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'step2.context_processors.session_id',
                'website.context_processors.session_id',
            ],
        },
    },
]

WSGI_APPLICATION = 'create_article.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    # 'default': {
    # 'ENGINE': 'djongo',
    # 'NAME': 'social-media-auto',
    # 'CLIENT': {
    #     'host': 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority',
    #     }
    #     },
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }

}
# DATABASE_ROUTERS = ('website.dbrouter.WebsiteDBRouter',)

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = "/static/"
STATICFILES_DIRS = [BASE_DIR/'static']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# todo replace with your key
LINGUA_KEY = '1ab6a8ab35msh454e13d4febb540p1f0fe3jsn5303c2162430'
OPENAI_KEY = config('OPENAI_KEY', '')
ARYSHARE_KEY = config('ARYSHARE_KEY', '')

SESSION_ENGINE = 'django.contrib.sessions.backends.db'


SESSION_COOKIE_SAMESITE = 'None'  # As a string
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
# SESSION_COOKIE_SAMESITE = 'Lax'  # or 'Strict'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
         
    ]
}


Q_CLUSTER = {
    'name': 'auto',
    'workers': 4,
    'timeout': 300,
    'retry': 350,
    'queue_limit': 50,
    'ack_failures': True,
    'attempt_count': 1,
    'bulk': 10,
    'orm': 'default'}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'Authorization',
    'Content-Type',
]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Replace with your frontend origin
]
CORS_ALLOW_ALL_ORIGINS = True

# # 'logs' directory
# LOGGING_DIR = os.path.join(BASE_DIR, 'LOGS')
#
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'file': {
#             'level': 'ERROR',
#             'class': 'logging.FileHandler',
#             'filename': os.path.join(LOGGING_DIR, 'error.log'),
#             'formatter': 'verbose',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file'],
#             'level': 'ERROR',
#             'propagate': True,
#         },
#     },
# }
