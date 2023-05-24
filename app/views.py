import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from app.services.helper import *
from app.services.constants import *
from app.serializers import DowellFunctionSerializer

@method_decorator(csrf_exempt, name='dispatch')
class checkServerStatus(APIView):

    def get(self, request):
        return Response({"info": "Welcome to social-media-automaion app"}, status=status.HTTP_200_OK)
