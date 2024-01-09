from decouple import config

DEFAULT_ACCESS_TOKEN = 'beb60174c73bf12e9b375e2c5a80815442100402'

CREDITS_SYSTEM_BASE_URL = 'https://100105.pythonanywhere.com/'

GET_METHOD = 'GET'

POST_METHOD = 'POST'


UPLOAD_IMAGE_ENDPOINT = 'https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-image-to-drive/'


def session_id(request):
    return {'session_id': request.GET.get("session_id", None)}

SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME = 'uxliveadmin'
# SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME = 'wilfex'

CREDITS_EXEMPTED_USERNAMES = [SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME]

PRODIA_API_KEY = config('PRODIA_API_KEY', '')
