from decouple import config

DEFAULT_ACCESS_TOKEN = 'beb60174c73bf12e9b375e2c5a80815442100402'

CREDITS_SYSTEM_BASE_URL = 'https://100105.pythonanywhere.com/'

GET_METHOD = 'GET'

POST_METHOD = 'POST'


UPLOAD_IMAGE_ENDPOINT = 'https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-image-to-drive/'


def session_id(request):
    return {'session_id': request.GET.get("session_id", None)}


SOCIAL_PLATFORM_FACEBOOK = 'facebook'

SOCIAL_PLATFORM_INSTAGRAM = 'instagram'

SOCIAL_PLATFORM_LINKEDIN = 'linkedin'

SOCIAL_PLATFORM_TWITTER = 'twitter'

SOCIAL_PLATFORM_CHOICES = (
    (SOCIAL_PLATFORM_FACEBOOK, SOCIAL_PLATFORM_FACEBOOK),
    (SOCIAL_PLATFORM_INSTAGRAM, SOCIAL_PLATFORM_INSTAGRAM),
    (SOCIAL_PLATFORM_LINKEDIN, SOCIAL_PLATFORM_LINKEDIN),
    (SOCIAL_PLATFORM_TWITTER, SOCIAL_PLATFORM_TWITTER),
)

