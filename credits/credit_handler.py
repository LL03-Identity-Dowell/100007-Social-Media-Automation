from django.contrib import messages
from django.core.handlers.wsgi import WSGIRequest

from credits.constants import STEP_1_SUB_SERVICE_ID, STEP_2_SUB_SERVICE_ID, STEP_3_SUB_SERVICE_ID, \
    STEP_4_SUB_SERVICE_ID
from credits.credit_manager import Credit
from credits.exceptions import CouldNotConsumeCreditError, CouldNotGetUserAPIKeyError


class CreditHandler:

    def format_response(self, request: WSGIRequest, response: dict):
        data = response
        if not data:
            messages.error(request, 'An error occurred while processing request')
            return {'success': False, 'message': 'An error occurred'}
        is_active = data.get("is_active")
        user_credits = data.get("total_credits")

        disable_key = data.get("disable_key")
        if not is_active:
            messages.error(request, 'SERVICE KEY is not activated')
            return {'success': False, 'message': 'SERVICE KEY is not activated'}
        if disable_key:
            messages.error(request, 'YOUR SERVICE KEY IS DISABLED BY ADMIN.')
            return {'success': False, 'message': 'YOUR SERVICE KEY IS DISABLED BY ADMIN.'}

        if user_credits <= 0:
            messages.error(request, "You have less credits. If you want to buy more credits click the 'Buy Credits' "
                                    "button")
            return {'success': False, 'message': "You have less credits. If you want to buy more credits click the "
                                                 "'Buy Credits' button", "link": "https://uxlivinglab.com/"}
        request.session['remaining_credits'] = response.get('remaining_credits')
        return {'success': True, 'message': 'Credits was successfully consumed', 'remaining_credits': user_credits}

    def format_steps_response(self, request: WSGIRequest, response: dict):
        data = response
        if not data:
            messages.error(request, 'An error occurred while processing request')
            return {'success': False, 'message': 'An error occurred'}
        if not data.get('success'):
            messages.error(request, response.get('message'))
            return response
        request.session['remaining_credits'] = response.get('remaining_credits')
        messages.success(request, 'Credits was successfully consumed')
        return response

    def login(self, request: WSGIRequest):
        credit = Credit()
        user_info = request.session.get('userinfo', None)

        if not user_info:
            response = {}
            return self.format_response(request, response)
        client_admin_id = user_info.get('client_admin_id', None)
        if not client_admin_id:
            response = {}
            return self.format_response(request, response)
        try:
            response = credit.get_user_api_key(work_space_id=client_admin_id)
            data = response.get('data')
            api_key = data.get('api_key')
            request.session['CREDIT_API_KEY'] = api_key
            response = data
        except CouldNotGetUserAPIKeyError:
            response = {}
        return self.format_response(request, response)


    def consume_step_1_credit(self, request: WSGIRequest):
        """
        This method consumes credits on step 1
        """

        user_api_key = request.session.get('CREDIT_API_KEY')
        if not user_api_key:
            return {'success': False, 'message': 'You do not have service id'}
        credit = Credit(user_api_key)
        sub_service_ids = [STEP_1_SUB_SERVICE_ID, ]

        product_type = 'product_service'
        try:
            response = credit.consume_credit(sub_service_ids=sub_service_ids, product_type=product_type)
        except CouldNotConsumeCreditError:
            response = {}
        return self.format_steps_response(request, response)

    def consume_step_2_credit(self, request: WSGIRequest):
        """
        This method consumes credits on step 1
        """
        user_api_key = request.session.get('CREDIT_API_KEY')
        if not user_api_key:
            return {'success': False, 'message': 'You do not have service id'}
        credit = Credit(user_api_key)
        sub_service_ids = [STEP_2_SUB_SERVICE_ID, ]

        product_type = 'product_service'
        try:
            response = credit.consume_credit(sub_service_ids=sub_service_ids, product_type=product_type)
        except CouldNotConsumeCreditError:
            response = {}
        return self.format_steps_response(request, response)

    def consume_step_3_credit(self, request: WSGIRequest):
        """
        This method consumes credits on step 3
        """
        user_api_key = request.session.get('CREDIT_API_KEY')
        if not user_api_key:
            return {'success': False, 'message': 'You do not have service id'}
        credit = Credit(user_api_key)
        sub_service_ids = [STEP_3_SUB_SERVICE_ID, ]

        product_type = 'product_service'
        try:
            response = credit.consume_credit(sub_service_ids=sub_service_ids, product_type=product_type)
        except CouldNotConsumeCreditError:
            response = {}
        return self.format_steps_response(request, response)


    def consume_step_4_credit(self, request: WSGIRequest):
        """
        This method consumes credits on step 4
        """
        user_api_key = request.session.get('CREDIT_API_KEY')
        if not user_api_key:
            return {'success': False, 'message': 'You do not have service id'}
        credit = Credit(user_api_key)
        sub_service_ids = [STEP_4_SUB_SERVICE_ID, ]

        product_type = 'product_service'
        try:
            response = credit.consume_credit(sub_service_ids=sub_service_ids, product_type=product_type)
        except CouldNotConsumeCreditError:
            response = {}
        return self.format_steps_response(request, response)
