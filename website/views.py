from datetime import datetime

import requests
from django.contrib import messages
from django.db import transaction
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from create_article import settings
from credits.constants import STEP_1_SUB_SERVICE_ID
from credits.credit_handler import CreditHandler
from step2.views import create_event
from website.forms import IndustryForm, SentencesForm
from website.models import Sentences, SentenceResults, SentenceRank
from website.models import User
from website.permissions import HasBeenAuthenticated
from website.serializers import SentenceSerializer, IndustrySerializer


@csrf_exempt
@xframe_options_exempt
@transaction.atomic
def index(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        industryForm = IndustryForm()
        sentencesForm = SentencesForm()
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
            if not credit_response.get('success'):
                return redirect(reverse('credit_error_view'))
            industryForm = IndustryForm(request.POST)
            print(industryForm.is_valid())
            sentencesForm = SentencesForm(request.POST)
            print(industryForm.is_valid())

            if industryForm.is_valid() and sentencesForm.is_valid():

                # Adding the step 1 form data into the user session
                request.session['industry_form_data'] = industryForm.cleaned_data
                request.session['sentences_form_data'] = sentencesForm.cleaned_data

                url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
                email = request.session['userinfo'].get('email')
                user = User.objects.create(email=email)
                industry = industryForm.save(commit=False)
                industry.user = user
                industry.save()

                object = sentencesForm.cleaned_data['object'].lower()
                subject = sentencesForm.cleaned_data['subject']
                verb = sentencesForm.cleaned_data['verb']
                objdet = sentencesForm.cleaned_data['object_determinant']
                adjective = sentencesForm.cleaned_data['adjective']

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
                    subject=subject,
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
        sentences_form_data = request.session.get('sentences_form_data')

        if industry_form_data:
            industryForm = IndustryForm(initial=industry_form_data)
        if sentences_form_data:
            sentencesForm = SentencesForm(initial=sentences_form_data)
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

    def post(self, request):

        session_id = request.GET.get('session_id', None)
        # has_permission=can_view_page(request)
        # if not has_permission:
        #     return Response({'message':'You are not allowed to view this page'},status=HTTP_400_BAD_REQUEST)
        industry_serializer = IndustrySerializer(data=request.data)
        sentence_serializer = SentenceSerializer(data=request.data)
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
        subject = sentence_serializer.data['subject']
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
            subject=subject,
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


@csrf_exempt
@xframe_options_exempt
@transaction.atomic
def selected_result(request):
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
                data_dictionary.pop('csrfmiddlewaretoken')
                request.session['data_dictionary'] = {
                    **request.session['data_dictionary'],
                    **data_dictionary
                }

                # del request.session['data_dictionary']

                insert_form_data(request.session['data_dictionary'])

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
