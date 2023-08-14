from django.contrib import messages
from django.core.handlers.wsgi import WSGIRequest

from credits.constants import STEP_1_SUB_SERVICE_ID, STEP_1_SERVICE_ID
from credits.credit_manager import Credit
from credits.exceptions import CouldConsumeCreditError


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

    def consume_step_1_credit(self, request: WSGIRequest):
        """
        This method consumes credits on step 1
        """
        user_api_key = request.session.get('CREDIT_API_KEY')
        if not user_api_key:
            return False
        credit = Credit(user_api_key)
        sub_service_ids = [STEP_1_SUB_SERVICE_ID, ]
        service_id = STEP_1_SERVICE_ID
        product_type = 'product_service'
        try:
            response = credit.consume_credit(sub_service_ids=sub_service_ids, service_id=service_id,
                                             product_type=product_type)
        except CouldConsumeCreditError:
            messages.error(request, 'An error occurred while processing request')
        return True
