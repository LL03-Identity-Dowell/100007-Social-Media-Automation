import json
from datetime import datetime

import requests
from django.contrib import messages
from django.db import transaction
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django_q.tasks import async_task
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from create_article import settings
from create_article.permissions import HasBeenAuthenticated
from credits.constants import STEP_1_SUB_SERVICE_ID
from credits.credit_handler import CreditHandler
from step2.views import create_event
from website.forms import IndustryForm, SentencesForm
from website.models import Sentences, SentenceResults, SentenceRank, WebsiteManager
from website.models import User
from website.serializers import SentenceSerializer, IndustrySerializer, CategorySerializer, UserTopicSerializer, \
    SelectedResultSerializer


def under_maintenance(request):
    context = {
        'message': "Kindly bear with us and check back in a few.",
    }
    return render(request, 'under_maintenance.html', context)

@csrf_exempt
@xframe_options_exempt
@transaction.atomic
def index(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        website_manager = WebsiteManager()
        user = website_manager.get_or_create_user({'email': request.session['userinfo']['email']})
        email = request.session['userinfo']['email']
        industryForm = IndustryForm(email=email)
        sentencesForm = SentencesForm(email=email)
        try:
            profile = str(request.session['operations_right'])
        except:
            profile = 'member'
        forms = {'industryForm': industryForm,
                 'sentencesForm': sentencesForm, 'profile': profile}

        # credit_handler = CreditHandler()
        # credit_response = credit_handler.check_if_user_has_enough_credits(
        #     sub_service_id=STEP_1_SUB_SERVICE_ID,
        #     request=request,
        # )

        if request.method == "POST":
            # if not credit_response.get('success'):
            #     return redirect(reverse('credit_error_view'))
            industryForm = IndustryForm(request.POST, email=email)
            print(industryForm.is_valid())
            sentencesForm = SentencesForm(request.POST, email=email)
            print(industryForm.is_valid())
            userid = request.session['user_id']
            topic = get_client_approval(userid)
            print(topic)
            if industryForm.is_valid() and sentencesForm.is_valid():

                # Adding the step 1 form data into the user session
                request.session['post_data'] = request.POST

                url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
                email = request.session['userinfo'].get('email')
                user = User.objects.create(email=email)
                industry = industryForm.save(commit=False)
                industry.user = user
                industry.save()

                object = sentencesForm.cleaned_data['object'].lower()
                subject = sentencesForm.cleaned_data['topic'].name

                verb = sentencesForm.cleaned_data['verb']
                objdet = sentencesForm.cleaned_data['object_determinant']
                adjective = sentencesForm.cleaned_data['adjective']
                auto_strings = {
                    "object": object,
                    "subject": subject,
                    "verb": verb,
                    "objdet": objdet,
                    "objmod": adjective,
                    "email": email,
                    'user': user,
                    'approve': topic

                }

                data_di = {
                    'target_product': industryForm.cleaned_data['target_product'],
                    'target_industry': industryForm.cleaned_data['category'].name,
                    'subject_determinant': sentencesForm.cleaned_data['subject_determinant'],
                    'subject': subject,
                    'subject_number': sentencesForm.cleaned_data['subject_number'],
                    'object_determinant': objdet,
                    'object': object,
                    'object_number': sentencesForm.cleaned_data['object_number'],
                    'adjective': adjective,
                    'verb': verb,
                    "email": email,
                    'user_id': request.session['user_id'],
                    "session_id": request.session["session_id"],
                    "org_id": request.session['org_id'],
                    'username': request.session['username'],
                    'event_id': create_event()['event_id'],
                    'client_admin_id': request.session['userinfo']['client_admin_id'],
                    'time_zone':request.session['timezone']
                }
                userid=request.session['user_id']
 
                print(topic)
                if topic['topic'] == 'True':
                    async_task("automate.services.step_1", auto_strings, data_di, hook='automate.services.hook_now')
                    print('yes.......o')
                    return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")
                else:

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
                            iter_sentence_type.append(
                                grammar_arguments['progressive'])

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
                        topic=sentencesForm.cleaned_data['topic'],
                        verb=verb,
                        adjective=adjective,
                    )

                    tenses = ['past', 'present', 'future']
                    other_grammar = ['passive',
                                     'progressive', 'perfect', 'negated']
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
                            for counter, (api_result, sentence_result) in
                            enumerate(zip(api_results, sentence_results), start=1)
                        }
                    }

                    sentences_dictionary = {
                        'sentences': sentence_results,
                    }

                    # messages.success(
                    #     request, 'Topics generated and ranked successfully. Click on Step 2 to generate articles.')
                    return render(request, 'answer_display.html', context=sentences_dictionary)
            else:
                messages.error(request, 'Please fix the errors below!')

                forms = {'industryForm': industryForm,
                         'sentencesForm': sentencesForm, 'profile': profile}

        # Checking if the session contains any form data for step one.
        # If available, the forms are initialized with those values
        industry_form_data = request.session.get('industry_form_data')
        form_data = request.session.get('form_data')

        if form_data:
            industryForm = IndustryForm(form_data, email=email)
            sentencesForm = SentencesForm(form_data, email=email)
        else:
            industryForm = IndustryForm(email=email)
            sentencesForm = SentencesForm(email=email)

        forms = {'industryForm': industryForm,
                 'sentencesForm': sentencesForm, 'profile': profile}
        messages.info(
            request, 'Step 1: Generate topics for your social media posts')
        return render(request, 'stepwise.html', context=forms)
    else:
        return render(request, 'error.html')


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
        credit_handler = CreditHandler()
        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_1_SUB_SERVICE_ID,
            request=request,
        )
        if not credit_response.get('success'):
            return Response(credit_response, status=HTTP_400_BAD_REQUEST)

        email = request.session['userinfo']['email']
        industry_serializer = IndustrySerializer(email=email, data=request.data)
        sentence_serializer = SentenceSerializer(email=email, data=request.data)

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
        data_dictionary["session_id"] = request.session.get('session_id', None)
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




@csrf_exempt
@xframe_options_exempt
@transaction.atomic
def selected_result(request):
    userid = request.session['user_id']
    topic = get_client_approval(userid)
    try:
        if 'session_id' and 'username' in request.session:
            if request.method == 'POST':
                # credit_handler = CreditHandler()
                # credit_response = credit_handler.check_if_user_has_enough_credits(
                #     sub_service_id=STEP_1_SUB_SERVICE_ID,
                #     request=request,
                # )

                # if not credit_response.get('success'):
                #     return redirect(reverse('credit_error_view'))
                sentence_ids = request.session.get('result_ids')

                loop_counter = 1
                for sentence_id in sentence_ids:
                    selected_rank = request.POST.get(
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
                data_dictionary.pop('csrfmiddlewaretoken')
                request.session['data_dictionary'] = {
                    **request.session['data_dictionary'],
                    **data_dictionary
                }

                # del request.session['data_dictionary']
                data_dic = request.session['data_dictionary']

                insert_form_data(request.session['data_dictionary'])

                print(topic)
                if topic['article'] == 'True':
                    async_task("automate.services.generate_article", data_dic, hook='automate.services.hook_now2')
                    print('yes.......o')
                else:
                    pass

                # Removing industry form data and sentence forms data from the session
                request.session.pop('industry_form_data', None)
                request.session.pop('sentences_form_data', None)
                # credit_handler = CreditHandler()
                # credit_handler.consume_step_1_credit(request)
                # return redirect("https://100014.pythonanywhere.com/?redirect_url=https://www.socialmediaautomation.uxlivinglab.online")
                return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")

        else:
            return render(request, 'error.html')
    except Exception as e:
        print(str(e))
        return render(request, 'error.html')


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


# added code for posts


def posts(request):
    return render(request, 'posts.html')


# added code for not-scheduled


def not_scheduled(request):
    return render(request, 'not-scheduled.html')


# added code for published


def published(request):
    return render(request, 'published.html')


# added code for article


def article(request):
    return render(request, 'article.html')


# added code for articles


def articles(request):
    return render(request, 'show_articles.html')


# added code for topic


def topic(request):
    return render(request, 'topic.html')


# added code for topics


def topics(request):
    return render(request, 'topics.html')


# added code for new_home


def new_home(request):
    return render(request, 'new_main.html')
    # return render(request, 'new_home.html')


# added code for schedule


def schedule(request):
    return render(request, 'unscheduled.html')


def login(request):
    return render(request, 'login.html')


@csrf_exempt
@xframe_options_exempt
def category_topic(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method == "GET":
            #
            return render(request, 'category_topic.html', )
        elif request.method == "POST":
            website_manager = WebsiteManager()
            try:
                topic_list = request.POST.get('topic_value').split(',')

            except Exception as e:
                topic_list = None

            try:
                category_list = request.POST.get('category_list').split(',')

            except Exception as e:
                category_list = None
            data = {
                'category_list': category_list,
                'topic_list': topic_list,
                'email': request.session['userinfo']['email'],
                'created_by': request.session['userinfo']['email'],
            }

            if len(category_list) == 1 and category_list[0] == '':
                print('No category')
            else:
                website_manager.create_user_categories_from_list(data)
                messages.success(request, 'Categories saved successfully')

            if topic_list:
                website_manager.create_user_topics_from_list(data)
                messages.success(request, 'Topics have been saved successfully')
            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


class SelectedResultAPIView(generics.CreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = SelectedResultSerializer

    def post(self, request, *args, **kwargs):
        selected_result_serializer = SelectedResultSerializer(data=request.data)
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

        data_dictionary = request.data.dict()
        data_dictionary['client_admin_id'] = request.session['userinfo']['client_admin_id']

        request.session['data_dictionary'] = {
            **request.session['data_dictionary'],
            **data_dictionary
        }

        # del request.session['data_dictionary']
        data_dic = request.session['data_dictionary']

        insert_form_data(request.session['data_dictionary'])

        print(topic)
        if topic['article'] == 'True':
            async_task("automate.services.generate_article", data_dic, hook='automate.services.hook_now2')
            print('yes.......o')
        else:
            pass

        return Response({'message': 'Sentence ranked successfully'})
