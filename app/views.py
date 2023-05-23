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


@method_decorator(csrf_exempt, name='dispatch')
class dataIntoCollection(APIView):

    def post(self, request):
        name = request.data.get('name')
        data_type = request.data.get('data_type')
        company_id = request.data.get('company_id')

        field = {
            'eventId':get_event_id()['event_id'],
            'name': name, 
            'data_type': data_type,
            'company_id': company_id
        }

        update_field = {
            "info": "nothing to update"
        }

        serializer = DowellFunctionSerializer(data= field)
        if serializer.is_valid():
            response = dowellconnection(*test_data_management,"insert",field, update_field)
            if response:
                return Response({"message": "Data inserted !."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Data insertion failed !"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, company_id):
        field = {
            "company_id": company_id
        }

        update_field = {
            "info": "nothing to update"
        }

        response = dowellconnection(*test_data_management,"fetch",field,update_field)
        if response:
            return Response({"fetched_data":json.loads(response)},status=status.HTTP_200_OK)
        else:
            return Response({"fetched_data":json.loads(response) },status=status.HTTP_204_NO_CONTENT)