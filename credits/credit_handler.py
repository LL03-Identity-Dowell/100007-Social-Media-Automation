from django.contrib import messages
from django.core.handlers.wsgi import WSGIRequest

from credits.constants import STEP_1_SUB_SERVICE_ID, STEP_2_SUB_SERVICE_ID, STEP_3_SUB_SERVICE_ID, \
    STEP_4_SUB_SERVICE_ID, SERVICE_ID
from credits.credit_manager import Credit
from credits.exceptions import CouldNotConsumeCreditError, CouldNotGetUserAPIKeyError


class CreditHandler:

    def format_response(self, request: WSGIRequest, response: dict):
        data = response
        credit_response = {}
        if not data:
            credit_response.update({'success': False, 'message': 'Please create a service/api Key for this workspace', 'error_code': 1})
            # PLEASE CREATE SERVICE/API KEY FOR THIS WORKSPACE
            request.session['credit_response'] = credit_response
            return credit_response
        is_active = data.get("is_active")
        user_credits = data.get("total_credits")
        disable_key = data.get("disable_key")

        if not is_active:
            credit_response.update(
                {'success': False, 'message': 'Please activate the service/api key', 'error_code': 2})
                # PLEASE ACTIVATE THE SERVICE/API KEY
            request.session['credit_response'] = credit_response
            return credit_response

        if disable_key:
            credit_response.update(
                {'success': False, 'message': 'Your service/api key is disabled', 'error_code': 3})
                # YOUR SERVICE/API KEY IS DISABLED
            request.session['credit_response'] = credit_response
            return credit_response

        if user_credits <= 0:
            credit_response.update(
                {'success': False, 'message': "kindly buy credits", "link": "https://uxlivinglab.com/",
                 'error_code': 4})
            request.session['credit_response'] = credit_response
            return credit_response

        # Checking if social media service is active or not
        services = response.get('services')
        social_media_service: dict = {}
        for service_data in services:
            if service_data.get('service_id') == SERVICE_ID:
                social_media_service = service_data
                break
        if not social_media_service:
            credit_response.update({'success': False, 'message': 'Social Media service not found'})
            request.session['credit_response'] = credit_response
            return credit_response

        if not social_media_service.get('is_active'):
            credit_response.update({'success': False, 'message': 'Please activate social media service'})
            # PLEASE ACTIVATE THE SOCIAL MEDIA SERVICE
            request.session['credit_response'] = credit_response
            return credit_response

        request.session['remaining_credits'] = response.get('remaining_credits')
        if request.session.get('credit_response', ):
            del request.session['credit_response']
        response['success'] = True
        return response

    def format_steps_response(self, request: WSGIRequest, response: dict):
        data = response

        if not data:
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

    def check_if_user_has_enough_credits(self, sub_service_id: str, request: WSGIRequest):
        """
        This method check if a user has enough credits to perform a step
        """
        credit_response = {}
        response = self.login(request)

        if not response.get('services'):
            credit_response.update({'success': False, 'message': 'No services found error'})
            request.session['credit_response'] = credit_response
            return credit_response

        services = response.get('services')
        social_media_service: dict = {}
        for service_data in services:
            if service_data.get('service_id') == SERVICE_ID:
                social_media_service = service_data
                break
        if not social_media_service:
            credit_response.update({'success': False, 'message': 'Social Media service not found'})
            request.session['credit_response'] = credit_response
            return credit_response

        sub_service_data: dict = {}
        for sub_service in social_media_service.get('sub_service'):
            if sub_service.get('sub_service_id') == sub_service_id:
                sub_service_data = sub_service
                break
        if not sub_service_data:
            messages.error(request, 'Please activate the service/api key')
            credit_response.update({'success': False, 'message': 'Please activate the service/api key'})
            request.session['credit_response'] = credit_response
            return credit_response

        sub_service_credits = sub_service_data.get('sub_service_credits')
        remaining_credits = response.get('total_credits')

        if remaining_credits < sub_service_credits:
            message = f'You do not have enough credits to access perform actions on this step. You have {str(remaining_credits)} credits. Required credits are: {str(sub_service_credits)}'

            credit_response.update({'success': False, 'message': message})
            request.session['credit_response'] = credit_response
            return credit_response
        return {'success': True, 'message': 'You have enough credits to perform this action'}
