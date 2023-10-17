from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .views import MainAPIView


class MainAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_main_api_view_authenticated(self):
        session_id = "posw9egmjv5pvlnvow6tvzgx8bsve1tv"

        # Set up a mock response for the first API request
        def mock_response_1(request):
            response = {"portfolio_info": [
                {"product": "Social Media Automation"}]}
            return response

        self.client.post = mock_response_1

        # Define the URL for your MainAPIView
        url = reverse("main-api")

        # Make a GET request to the MainAPIView with an authenticated session ID
        response = self.client.get(url, {"session_id": session_id})

        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert response data (customize this based on your serializer)
        self.assertIn("userinfo", response.data)
        self.assertIn("portfolio_info", response.data)
        self.assertIn("username", response.data)
        self.assertIn("user_id", response.data)
        self.assertIn("timezone", response.data)
        self.assertIn("operations_right", response.data)
        self.assertIn("org_id", response.data)

    def test_main_api_view_unauthenticated(self):
        # Define the URL for your MainAPIView
        url = reverse("main-api")

        # Make a GET request to the MainAPIView without a session ID
        response = self.client.get(url)

        # Assert the response status code for unauthenticated access
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertRedirects(
            response, "https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")
