from rest_framework import permissions

from config_master import DEFAULT_ACCESS_TOKEN
import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class HasBeenAuthenticated(BaseAuthentication):
    def __init__(self):
        self.api_key_endpoint = 'https://100105.pythonanywhere.com/api/v1/process-api-key/'

    def validate_api_data(self, api_key, api_service_id):
        payload = {
            'api_key': api_key,
            'api_service_id': api_service_id
        }

        response = requests.post(self.api_key_endpoint, json=payload)
        api_key_data = response.json()
        print("api_key_data", api_key_data)
        print(api_key_data.get('success'))  # Retunnss "False"
        print(api_key_data.get('message'))  # returns "Limit exceeded"
        print(response.status_code)  # returns a 401

        if response.status_code == 200 and api_key_data.get('success'):
            if api_key_data.get('message') == 'Valid API key':
                if 'count' in api_key_data:
                    return True, {
                        "success": True,
                        "message": "The count is decremented",
                        "count": api_key_data['count']
                    }
                else:
                    return False, {
                        "success": True,
                        "message": "Limit exceeded"
                    }
            elif api_key_data.get('message') == 'API key is inactive':
                return False, {
                    "success": True,
                    "message": "API key is inactive"
                }
        else:
            if api_key_data.get('message') == 'Limit exceeded':
                return False, {
                    "success": True,
                    "message": "Limit exceeded"
                }
            elif api_key_data.get('message') == 'API key does not exist or the combination is invalid':
                return False, {
                    "success": False,
                    "message": "API key does not exist or the combination is invalid"
                }
            else:
                return False, {
                    "success": False,
                    "message": "Unknown error occurred"
                }

    def has_permission(self, request, view):
        api_key = request.data.get('api_key')
        api_service_id = request.data.get('api_service_id')
        if not api_key:
            raise AuthenticationFailed(
                'API key are required.')

        api_service_id = 'DOWELL10001'

        validation_endpoint = 'https://100105.pythonanywhere.com/api/v1/process-api-key/'
        response = requests.post(validation_endpoint, json={
                                 'api_key': api_key, 'api_service_id': api_service_id})
        api_key_data = response.json()
        print("here is", api_key_data)

        if response.status_code == 200 and api_key_data.get('success'):
            # API key and services are valid
            return True
        else:
            raise AuthenticationFailed('Invalid API key or API services.')
