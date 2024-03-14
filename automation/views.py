# Create your views here.


import json
import logging
import uuid
from datetime import datetime

import requests
from django_q.tasks import async_task
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from automation.automate import Automate
from automation.serializers import AutomationSerializer
from helpers import fetch_user_info
from step2.views import create_event
from website.models import User
from website.permissions import HasBeenAuthenticated
from website.serializers import SentenceSerializer, IndustrySerializer, SelectedResultSerializer


def get_event_id():
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    url = "https://100003.pythonanywhere.com/event_creation"
    data = {"platformcode": "FB", "citycode": "101", "daycode": "0",
            "dbcode": "pfm", "ip_address": "192.168.0.41",
            "login_id": "lav", "session_id": "new",
            "processcode": "1", "regional_time": time,
            "dowell_time": time, "location": "22446576",
            "objectcode": "1", "instancecode": "100051", "context": "afdafa ",
            "document_id": "3004", "rules": "some rules", "status": "work"
            }

    r = requests.post(url, json=data)
    return r.text


def get_dowellclock():
    response_dowell = requests.get(
        'https://100009.pythonanywhere.com/dowellclock')
    data = response_dowell.json()
    return data['t1']


def insert_form_data(data_dict):
    url = "http://uxlivinglab.pythonanywhere.com/"
    if not data_dict.get('eventId'):
        data_dict['eventId'] = get_event_id()
    # data_dict['dowelltime'] = get_dowellclock()

    data = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "socialmedia",
        "document": "socialmedia",
        "team_member_ID": "345678977",
        "function_ID": "ABCDE",
        "command": "insert",

        "field": data_dict,

        'update_field': {
            "name": "Joy update",
            "phone": "123456",
            "age": "26",
            "language": "English",

        },
        "platform": "bangalore",

    }
    headers = {'content-type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response.json()


def get_client_approval(user):
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "user_info",
        "document": "user_info",
        "team_member_ID": "1071",
        "function_ID": "ABCDE",
        "command": "fetch",
        "field": {"user_id": user},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }

    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    response_data_json = json.loads(response.json())

    try:
        for value in response_data_json['data']:
            if 'topic' in value.keys():
                aproval = {
                    'topic': value.get('topic', 'False'),
                    'post': value.get('post', 'False'),
                    'article': value.get('article', 'False'),
                    'schedule': value.get('schedule', 'False')
                }
                return (aproval)
        return ({'topic': 'False'})
    except Exception as e:
        logging.exception(e)
        aproval = {'topic': 'False'}
    return (aproval)


class SelectedAutomationResultAPIView(generics.CreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = SelectedResultSerializer

    def post(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        email = request.session['userinfo']['email']
        industry_serializer = IndustrySerializer(
            email=email, data=request.data)
        sentence_serializer = SentenceSerializer(
            email=email, data=request.data)

        if not industry_serializer.is_valid():
            return Response(industry_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if not sentence_serializer.is_valid():
            return Response(sentence_serializer.errors, status=HTTP_400_BAD_REQUEST)
        try:
            profile = str(request.session['operations_right'])
        except:
            profile = 'member'

        url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
        email = request.session['userinfo'].get('email')
        user = User.objects.create(email=email)
        industry = industry_serializer.save()
        industry.user = user
        industry.save()

        object = sentence_serializer.data['object'].lower()
        subject = sentence_serializer.validated_data['topic'].name
        verb = sentence_serializer.data['verb']
        objdet = sentence_serializer.data['object_determinant']
        adjective = sentence_serializer.data['adjective']

        userid = request.session['user_id']
        topic = get_client_approval(userid)
        auto_strings = {
            "object": object,
            "subject": subject,
            "verb": verb,
            "objdet": objdet,
            "objmod": adjective,
            "email": email,
            'user': user,
            'approve': topic,
            'topic': sentence_serializer.validated_data['topic'],

        }

        data_di = {
            'target_product': industry_serializer.validated_data['target_product'],
            'target_industry': industry_serializer.validated_data['category'].name,
            'subject_determinant': sentence_serializer.validated_data.get('subject_determinant', ''),
            'subject': subject,
            'subject_number': sentence_serializer.validated_data['subject_number'],
            'object_determinant': objdet,
            'object': object,
            'object_number': sentence_serializer.validated_data['object_number'],
            'adjective': adjective,
            'verb': verb,
            "email": email,
            'user_id': request.session['user_id'],
            "session_id": request.session["session_id"],
            "org_id": request.session['org_id'],
            'username': request.session['username'],
            'event_id': create_event()['event_id'],
            'client_admin_id': request.session['userinfo']['client_admin_id'],
            'user_info': request.session.get('userinfo'),
        }
        if topic['topic'] == True:
            session = {**request.session}
            automate = Automate(session=session)
            async_task(automate.generate_topics,
                       auto_strings, data_di, hook='automation.services.hook_now')

        return Response({"message": "Topics saved successfully"}, status=status.HTTP_200_OK)


class AutomationAPIView(generics.ListCreateAPIView):

    permission_classes = (HasBeenAuthenticated,)
    serializer_class = AutomationSerializer

    def get_queryset(self):
        user_info = fetch_user_info(request=self.request)
        automations = user_info['data'][0].get('automations', [])
        return automations

    def get(self, request, *args, **kwargs):
        user_info = fetch_user_info(request=self.request)
        automations = user_info['data'][0].get('automations', [])
        return Response(automations, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = AutomationSerializer(data=request.data)
        email = request.session['userinfo']['email']
        industry_serializer = IndustrySerializer(
            email=email, data=request.data)
        sentence_serializer = SentenceSerializer(
            email=email, data=request.data)

        if not industry_serializer.is_valid():
            return Response(industry_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if not sentence_serializer.is_valid():
            return Response(sentence_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        email = request.session['userinfo'].get('email')
        user = User.objects.create(email=email)
        industry = industry_serializer.save()
        industry.user = user
        industry.save()

        object = sentence_serializer.data['object'].lower()
        subject = sentence_serializer.validated_data['topic'].name
        verb = sentence_serializer.data['verb']
        objdet = sentence_serializer.data['object_determinant']
        adjective = sentence_serializer.data['adjective']

        userid = request.session['user_id']
        auto_strings = {
            "object": object,
            "subject": subject,
            "verb": verb,
            "objdet": objdet,
            "objmod": adjective,
            "email": email,
            'topic': sentence_serializer.validated_data['topic'].id,
            "user": user.id,
        }

        data_dic = {
            'target_product': industry_serializer.validated_data['target_product'],
            'target_industry': industry_serializer.validated_data['category'].name,
            'subject_determinant': sentence_serializer.validated_data.get('subject_determinant', ''),
            'subject': subject,
            'subject_number': sentence_serializer.validated_data['subject_number'],
            'object_determinant': objdet,
            'object': object,
            'object_number': sentence_serializer.validated_data['object_number'],
            'adjective': adjective,
            'verb': verb,
            "email": email,
            'user_id': request.session['user_id'],
            "session_id": request.session["session_id"],
            "org_id": request.session['org_id'],
            'username': request.session['username'],
            'event_id': create_event()['event_id'],
            'client_admin_id': request.session['userinfo']['client_admin_id'],
        }
        session = {**request.session}
        session.pop('data_dictionary', None)
        session.pop('result_ids', None)
        user_info = fetch_user_info(request=request)
        automations = user_info['data'][0].get('automations', [])
        automation_data = {**serializer.validated_data}
        automation_data['id'] = str(uuid.uuid4())
        automation_data['session'] = session
        automation_data['auto_strings'] = auto_strings
        automation_data['data_dic'] = data_dic
        automations = [automation for automation in automations if automation]
        automations.append(automation_data)
        org_id = request.session['org_id']

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = json.dumps({
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "update",

            "field": {
                'user_id': request.session['user_id'],
            },
            "update_field": {
                "automations": automations,
                "org_id": org_id,
                "has_automation": True
            },
            "platform": "bangalore"
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.json())
        return Response({"message": "Automation saved successfully"}, status=status.HTTP_200_OK)
