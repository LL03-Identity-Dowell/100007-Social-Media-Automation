import json
import logging

import requests

from config_master import CREDITS_SYSTEM_BASE_URL, GET_METHOD, POST_METHOD
from credits.constants import CREDITS_GET_USER_API_KEY_URL, CREDITS_PROCESS_PRODUCT_SERVICE_URL, SERVICE_ID
from credits.exceptions import CouldNotGetUserAPIKeyError, CouldConsumeCreditError


class Credit:
    """
    This class handles all the functionality related to the credit system
    """

    def __init__(self, api_key=None):
        logging.info('Initializing Credit object')
        self.base_url = CREDITS_SYSTEM_BASE_URL
        if api_key:
            self.api_key = api_key
        else:
            self.api_key = None

    def send(self, method, url, params=None, headers=None, data=None, ):
        """
        This method makes all the requests to the credit system
        """
        if headers is None:
            headers = {}
        if data is None:
            data = {}
        url = f'{str(self.base_url)}{str(url)}'
        if params is None:
            params = {}
        params['api_key'] = self.api_key
        headers['content-type'] = 'application/json'
        data = json.dumps(data)
        try:
            response = requests.request(method, url, params=params, headers=headers, data=data, json=json)
            response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None

    def get_user_api_key(self, work_space_id):
        """
        This method returns a user's API key
        """
        method = GET_METHOD
        params = {
            'type': 'get_api_key',
            'workspace_id': work_space_id,
        }
        url = CREDITS_GET_USER_API_KEY_URL
        try:
            response = self.send(method=method, params=params, url=url)
        except Exception as e:
            print(f"An error occurred: {e}")
            raise CouldNotGetUserAPIKeyError(str(e))
        if not response.get('success'):
            raise CouldNotGetUserAPIKeyError(response.get('message'))
        data = response.get('data')
        api_key = data.get('api_key')
        self.api_key = api_key
        return api_key

    def consume_credit(self, sub_service_ids: list[str], product_type):
        """
        This method consumes credits
        """
        method = POST_METHOD
        params = {
            'type': product_type,
        }
        url = CREDITS_PROCESS_PRODUCT_SERVICE_URL
        data = {
            "sub_service_ids": sub_service_ids,
            "service_id": SERVICE_ID,
        }
        try:
            response = self.send(method=method, params=params, url=url, data=data)
        except Exception as e:
            print(f"An error occurred: {e}")
            raise CouldConsumeCreditError(str(e))
        if not response.get('success'):
            raise CouldConsumeCreditError(response.get('message'))
        return response
