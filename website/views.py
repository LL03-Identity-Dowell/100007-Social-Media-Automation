import json
from datetime import datetime

import requests
from django.db import transaction
from django.shortcuts import render
from django_q.tasks import async_task
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from create_article import settings
from helpers import fetch_user_info
from step2.views import create_event
from website.models import Sentences, SentenceResults, SentenceRank, WebsiteManager
from website.models import User
from website.permissions import HasBeenAuthenticated
from website.serializers import SentenceSerializer, IndustrySerializer, CategorySerializer, UserTopicSerializer, \
    SelectedResultSerializer


def under_maintenance(request):
    context = {
        'message': "Kindly bear with us and check back in a few.",
    }
    return render(request, 'under_maintenance.html', context)


class GenerateSentencesAPIView(generics.CreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = SentenceSerializer

    def get_serializer(self):
        request = self.request
        email = request.session['userinfo']['email']
        return SentenceSerializer(email=email)

    def post(self, request, *args, **kwargs):

        session_id = request.GET.get('session_id', None)
        # has_permission=can_view_page(request)
        # if not has_permission:
        #     return Response({'message':'You are not allowed to view this page'},status=HTTP_400_BAD_REQUEST)

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
        # auto_strings = {
        #     "object": object,
        #     "subject": subject,
        #     "verb": verb,
        #     "objdet": objdet,
        #     "objmod": adjective,
        #     "email": email,
        #     'user': user,
        #     'approve': topic,
        #     'topic': sentence_serializer.validated_data['topic'],

        # }

        # data_di = {
        #     'target_product': industry_serializer.validated_data['target_product'],
        #     'target_industry': industry_serializer.validated_data['category'].name,
        #     'subject_determinant': sentence_serializer.validated_data.get('subject_determinant', ''),
        #     'subject': subject,
        #     'subject_number': sentence_serializer.validated_data['subject_number'],
        #     'object_determinant': objdet,
        #     'object': object,
        #     'object_number': sentence_serializer.validated_data['object_number'],
        #     'adjective': adjective,
        #     'verb': verb,
        #     "email": email,
        #     'user_id': request.session['user_id'],
        #     "session_id": request.session["session_id"],
        #     "org_id": request.session['org_id'],
        #     'username': request.session['username'],
        #     'event_id': create_event()['event_id'],
        #     'client_admin_id': request.session['userinfo']['client_admin_id'],
        # }
        userid = request.session['user_id']
        # if topic['topic'] == True:
        #     async_task("automation.services.step_1", auto_strings,
        #                data_di, hook='automation.services.hook_now')
        # return Response({"message": "Topics saved successfully"}, status=status.HTTP_200_OK)

        def api_call(grammar_arguments=None):
            if grammar_arguments is None:
                grammar_arguments = {}

            querystring = {
                "object": object,
                "subject": subject,
                "verb": verb,
                "objdet": objdet,
                "objmod": adjective,
            }

            iter_sentence_type = []
            if 'tense' in grammar_arguments:
                querystring['tense'] = grammar_arguments['tense'].capitalize()
                iter_sentence_type.append(
                    grammar_arguments['tense'].capitalize())

            if 'progressive' in grammar_arguments:
                querystring['progressive'] = 'progressive'
                iter_sentence_type.append(grammar_arguments['progressive'])

            if 'perfect' in grammar_arguments:
                querystring['perfect'] = 'perfect'
                iter_sentence_type.append(grammar_arguments['perfect'])

            if 'negated' in grammar_arguments:
                querystring['negated'] = 'negated'
                iter_sentence_type.append(grammar_arguments['negated'])

            if 'passive' in grammar_arguments:
                querystring['passive'] = 'passive'
                iter_sentence_type.append(grammar_arguments['passive'])

            if 'modal_verb' in grammar_arguments:
                querystring['modal'] = grammar_arguments['modal_verb']

            if 'sentence_art' in grammar_arguments:
                querystring['sentencetype'] = grammar_arguments['sentence_art']
            iter_sentence_type.append("sentence.")
            type_of_sentence = ' '.join(iter_sentence_type)

            headers = {
                'x-rapidapi-host': "linguatools-sentence-generating.p.rapidapi.com",
                'x-rapidapi-key': settings.LINGUA_KEY
            }
            response = requests.request(
                "GET", url, headers=headers, params=querystring).json()
            return [response['sentence'], type_of_sentence]

        data_dictionary = request.POST.dict()
        data_dictionary["user_id"] = request.session['user_id']
        data_dictionary["session_id"] = session_id
        data_dictionary["org_id"] = request.session['org_id']
        data_dictionary["username"] = request.session['username']
        data_dictionary["session_id"] = request.session.get(
            'session_id', None)
        data_dictionary['event_id'] = create_event()['event_id']
        data_dictionary['email'] = email

        try:
            data_dictionary.pop('csrfmiddlewaretoken')
        except KeyError:
            print('csrfmiddlewaretoken key not in data_dictionary')
        request.session['data_dictionary'] = data_dictionary

        sentence_grammar = Sentences.objects.create(
            user=user,
            object=object,
            topic=sentence_serializer.validated_data['topic'],
            verb=verb,
            adjective=adjective,
        )

        tenses = ['past', 'present', 'future']
        other_grammar = ['passive', 'progressive', 'perfect', 'negated']
        api_results = []

        for tense in tenses:
            for grammar in other_grammar:
                arguments = {'tense': tense, grammar: grammar}
                api_result = api_call(arguments)
                api_results.append(api_result)

        with transaction.atomic():
            sentence_results = [
                SentenceResults(
                    sentence_grammar=sentence_grammar,
                    sentence=api_result[0],
                    sentence_type=api_result[1]
                )
                for api_result in api_results
            ]
            SentenceResults.objects.bulk_create(sentence_results)

        result_ids = SentenceResults.objects.filter(
            sentence_grammar=sentence_grammar).values_list('pk', flat=True)
        request.session['result_ids'] = list(result_ids)

        request.session['data_dictionary'] = {
            **request.session['data_dictionary'],
            **{
                f"api_sentence_{counter}": {
                    "sentence": api_result[0],
                    'sentence_type': api_result[1],
                    'sentence_id': sentence_result.pk
                }
                for counter, (api_result, sentence_result) in enumerate(zip(api_results, sentence_results), start=1)
            }
        }

        sentences_dictionary = {
            'sentences': sentence_results,
        }
        return Response(request.session['data_dictionary'])


class UserCategoriesAPIView(generics.ListCreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = CategorySerializer

    def get_queryset(self):
        request = self.request
        email = request.session['userinfo']['email']
        return WebsiteManager().get_user_categories_by_email({'email': email})

    def list(self, request):
        queryset = self.get_queryset()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        category_serializer = CategorySerializer(data=request.data)
        if category_serializer.is_valid():
            validated_data = category_serializer.validated_data
            email = request.session['userinfo']['email']

            category_list = validated_data.get('name').split(',')
            WebsiteManager().create_user_categories_from_list(
                {'category_list': category_list, 'email': email, 'created_by': email})
            return Response({'message': 'Categories created successfully'})

        else:
            return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserTopicAPIView(generics.ListCreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = UserTopicSerializer

    def get_queryset(self):
        request = self.request
        email = request.session['userinfo']['email']
        return WebsiteManager().get_user_topics_by_email({'email': email})

    def list(self, request):
        queryset = self.get_queryset()
        serializer = UserTopicSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user_topic_serializer = UserTopicSerializer(data=request.data)
        if user_topic_serializer.is_valid():
            validated_data = user_topic_serializer.validated_data
            email = request.session['userinfo']['email']
            topic_list = validated_data.get('name').split(',')
            WebsiteManager().create_user_topics_from_list(
                {'topic_list': topic_list, 'email': email, 'created_by': email})
            return Response({'message': 'User Topics created successfully'})

        else:
            return Response(user_topic_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class SelectedResultAPIView(generics.CreateAPIView):
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
        for sentence_id in sentence_ids:
            selected_rank = request.data.get(
                'rank_{}'.format(loop_counter))

            loop_counter += 1
            sentence_result = SentenceResults.objects.get(
                pk=sentence_id)
            selected_result_obj = SentenceRank.objects.create(
                sentence_result=sentence_result, sentence_rank=selected_rank
            )

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


        data_dic = request.session['data_dictionary']

        insert_form_data(request.session['data_dictionary'])
        del request.session['data_dictionary']
        if topic.get('article') == True:
            user_data = fetch_user_info(request)
            async_task("automation.services.generate_article",
                       data_dic, user_data, hook='automation.services.hook_now2')
            return Response({'message': 'Your articles are being generated in the background'})
        else:
            return Response({'message': 'Sentence ranked successfully'})
