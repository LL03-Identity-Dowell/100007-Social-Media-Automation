from django.core.handlers.wsgi import WSGIRequest

from credits.credit_manager import Credit


class CreditHandler:

    def login(self, request: WSGIRequest):
        credit = Credit()
        user_info = request.session.get('userinfo', None)
        if not user_info:
            return False
        client_admin_id = user_info.get('client_admin_id', None)
        if not client_admin_id:
            return False
        user_api_key = credit.get_user_api_key(work_space_id=client_admin_id)
        request.session['CREDIT_API_KEY'] = user_api_key
        return True
