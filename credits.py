import logging

import requests

from config_master import CREDITS_SYSTEM_BASE_URL, GET_METHOD
from constants import CREDITS_GET_USER_API_KEY_URL
from custom_exceptions import CouldNotGetUserAPIKeyError


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

    def send(self, method, url, params=None, headers=None, data=None, json=None):
        """
        This method makes all the requests to the credit system
        """
        url = f'{str(self.base_url)}{str(url)}'
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
