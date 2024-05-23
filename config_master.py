from decouple import config
from django.http import HttpRequest

# Load from environment
DEFAULT_ACCESS_TOKEN = config('DEFAULT_ACCESS_TOKEN')

CREDITS_SYSTEM_BASE_URL = 'https://100105.pythonanywhere.com/'

GET_METHOD = 'GET'

POST_METHOD = 'POST'


UPLOAD_IMAGE_ENDPOINT = 'https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-image-to-drive/'


def session_id(request: HttpRequest) -> dict:
    # Try to get the session ID from cookies
    session_id = request.COOKIES.get('sessionid')
    if not session_id:
        # Fallback to headers if not found in cookies
        session_id = request.headers.get('Session-ID')
    return {'session_id': session_id}

SOCIAL_PLATFORM_FACEBOOK = 'facebook'

SOCIAL_PLATFORM_INSTAGRAM = 'instagram'

SOCIAL_PLATFORM_LINKEDIN = 'linkedin'

SOCIAL_PLATFORM_TWITTER = 'twitter'

SOCIAL_PLATFORM_YOUTUBE = 'youtube'

SOCIAL_PLATFORM_PINTEREST = 'pinterest'

SOCIAL_PLATFORM_CHOICES = (
    (SOCIAL_PLATFORM_FACEBOOK, SOCIAL_PLATFORM_FACEBOOK),
    (SOCIAL_PLATFORM_INSTAGRAM, SOCIAL_PLATFORM_INSTAGRAM),
    (SOCIAL_PLATFORM_LINKEDIN, SOCIAL_PLATFORM_LINKEDIN),
    (SOCIAL_PLATFORM_TWITTER, SOCIAL_PLATFORM_TWITTER),
    (SOCIAL_PLATFORM_YOUTUBE, SOCIAL_PLATFORM_YOUTUBE),
    (SOCIAL_PLATFORM_PINTEREST, SOCIAL_PLATFORM_PINTEREST),
)

SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME = config('SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME', 'uxliveadmin')

CREDITS_EXEMPTED_USERNAMES = ['uxliveadmin']
