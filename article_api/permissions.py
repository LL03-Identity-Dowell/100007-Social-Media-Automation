import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class HasBeenAuthenticated(BaseAuthentication):
    def __init__(self):
        self.api_key_endpoint = 'https://100105.pythonanywhere.com/api/v1/process-api-key/'
        self.api_service_id = 'DOWELL10015'  # Hardcoded API service ID

    def validate_api_data(self, api_key):
        payload = {
            'service_id': self.api_service_id
        }

        response = requests.post(self.api_key_endpoint, json=payload)
        api_key_data = response.json()
        print("api_key_data", api_key_data)
        print(api_key_data.get('success'))  # Returns "False"
        print(api_key_data.get('message'))  # returns "Limit exceeded"
        print(response.status_code)  # returns a 401

        if response.status_code == 200 and api_key_data.get('success'):
            return True, {
                "success": True,
                "message": "Credits was successfully consumed",
                "total_credits": api_key_data.get('total_credits')
            }
        elif response.status_code == 400 and api_key_data.get('message') == 'Service is not active':
            return False, {
                "success": False,
                "message": "Service is not active"
            }
        elif response.status_code == 404 and api_key_data.get('message') == 'Service not found':
            return False, {
                "success": False,
                "message": "Service not found"
            }
        elif response.status_code == 404 and api_key_data.get('message') == 'API key not found':
            return False, {
                "success": False,
                "message": "API key not found"
            }
        else:
            return False, {
                "success": False,
                "message": "Unknown error occurred"
            }

    def has_permission(self, request, view):
        api_key = request.data.get('api_key')
        if not api_key:
            raise AuthenticationFailed('API key is required.')

        validation_endpoint = 'https://100105.pythonanywhere.com/api/v3/process-services/?type=api_service&api_key={}'.format(
            api_key)
        print(api_key)
        print(validation_endpoint)
        response = requests.post(validation_endpoint, json={
            "service_id": self.api_service_id})
        api_key_data = response.json()
        print("here is", api_key_data)

        if response.status_code == 200 and api_key_data.get('success'):
            # API key and services are valid
            return True
        else:
            raise AuthenticationFailed('Invalid API key or API service ID.')
