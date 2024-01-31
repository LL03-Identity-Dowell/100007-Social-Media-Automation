from django.shortcuts import render

# Create your views here.


import json
import random
from datetime import datetime

import requests
from django.db import transaction
from django.shortcuts import render
from django_q.tasks import async_task
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from create_article import settings
from step2.views import create_event
from website.models import Sentences, SentenceResults, SentenceRank, WebsiteManager
from website.models import User
from website.permissions import HasBeenAuthenticated
from website.serializers import SentenceSerializer, IndustrySerializer, CategorySerializer, UserTopicSerializer, \
    SelectedResultSerializer


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
    print("----------------> insert form data-- start---------")

    url = "http://uxlivinglab.pythonanywhere.com/"
    if not data_dict.get('eventId'):
        data_dict['eventId'] = get_event_id()
    # data_dict['dowelltime'] = get_dowellclock()
    print("data", data_dict)

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
    print(response.json())
    print("-------------end of insert function---------------")
    return response.json()


# get user aproval
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

    print(response)
    response_data_json = json.loads(response.json())
    print(response_data_json)

    try:
        for value in response_data_json['data']:
            aproval = {
                'topic': value['topic'],
                'post': value['post'],
                'article': value['article'],
                'schedule': value['schedule']
            }
        return (aproval)
    except:
        aproval = {'topic': 'False'}
    return (aproval)


class SelectedAutomationResultAPIView(generics.CreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = SelectedResultSerializer

    def post(self, request, *args, **kwargs):
        selected_result_serializer = SelectedResultSerializer(
            data=request.data)
        if not selected_result_serializer.is_valid():
            return Response(selected_result_serializer.errors, status=HTTP_400_BAD_REQUEST)
        userid = request.session['user_id']
        topic = get_client_approval(userid)
        sentence_ids = request.session.get('result_ids')

        if not sentence_ids:
            return Response({'message': 'The user does not have generated sentences in the session. Please generate '
                                        'sentences again.'}, status=HTTP_400_BAD_REQUEST)

        loop_counter = 1
        Rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        used_ranks = set()
        Rank_dict = {}  # added dictionary to store rankings
        for sentence_id in sentence_ids:
            available_ranks = [rank for rank in Rank if rank not in used_ranks]
            if not available_ranks:
                return Response({'message': 'No available ranks left.'}, status=HTTP_400_BAD_REQUEST)
            selected_rank = random.choice(available_ranks)
            used_ranks.add(selected_rank)
            key = 'rank_{}'.format(loop_counter)
            Rank_dict[key] = selected_rank
            loop_counter += 1
            sentence_result = SentenceResults.objects.get(
                pk=sentence_id)
            selected_result_obj = SentenceRank.objects.create(
                sentence_result=sentence_result, sentence_rank=selected_rank
            )

            # Store ranking for each sentence
            Rank_dict[sentence_result.sentence] = selected_rank

            request.session['data_dictionary'] = {
                **request.session['data_dictionary'],
                **{
                    "sentence_rank_{}".format(loop_counter - 1): {
                        "sentence_rank": selected_rank,
                        'sentence_result': sentence_result.sentence,
                        'sentence_id': sentence_id
                    }
                }
            }

        data_dictionary = request.POST.dict()
        data_dictionary['client_admin_id'] = request.session['userinfo']['client_admin_id']

        request.session['data_dictionary'] = {
            **request.session['data_dictionary'],
            **data_dictionary
        }

        # del request.session['data_dictionary']
        data_dic = request.session['data_dictionary']
        print(data_dic)

        insert_form_data(request.session['data_dictionary'])
        if topic.get('article') == True:
            async_task("services.generate_article",
                       data_dic, hook='services.hook_now2')
            return Response({'message': 'You articles are being generated in the background'})
        else:
            return Response({'message': 'Sentence ranked successfully'})
