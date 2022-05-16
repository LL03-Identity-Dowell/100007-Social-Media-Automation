import requests
# Create your views here.
from django.shortcuts import render
from datetime import datetime
from create_article import settings
from website.forms import UserEmailForm, IndustryForm, SentencesForm
from website.models import Sentences, SentenceResults, SentenceRank
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.http import HttpResponseRedirect
from datetime import datetime

@csrf_exempt
@xframe_options_exempt
def index(request):
    if 'session_id' and 'username' in request.session:
        emailForm = UserEmailForm()
        industryForm = IndustryForm()
        sentencesForm = SentencesForm()
        forms = {'emailForm': emailForm, 'industryForm': industryForm, 'sentencesForm': sentencesForm}
        if request.method == "POST":
            emailForm = UserEmailForm(request.POST)
            industryForm = IndustryForm(request.POST)
            print(industryForm)
            sentencesForm = SentencesForm(request.POST)
            print(industryForm.is_valid())
            if emailForm.is_valid() and industryForm.is_valid() and sentencesForm.is_valid():
                url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
                user = emailForm.save()
                industry = industryForm.save(commit=False)
                industry.user = user
                industry.save()
                object = sentencesForm.cleaned_data['object'].lower()
                subject = sentencesForm.cleaned_data['subject']
                verb = sentencesForm.cleaned_data['verb']
                objdet = sentencesForm.cleaned_data['object_determinant']
                objnum = sentencesForm.cleaned_data['object_number']
                subjdet = sentencesForm.cleaned_data['subject_determinant']
                subjnum = sentencesForm.cleaned_data['subject_number']
                adjective = sentencesForm.cleaned_data['adjective']

                # this code below is commented because the team lead requested that the code generates different sentences
                # # now for the grammar part of the sentence
                # tense = sentencesForm.cleaned_data['tense']
                # progressive = sentencesForm.cleaned_data['progressive']
                #
                # perfect = sentencesForm.cleaned_data['perfect']
                #
                # negated = sentencesForm.cleaned_data['negated']
                #
                # passive = sentencesForm.cleaned_data['passive']
                #
                # sentence_art = sentencesForm.cleaned_data['sentence_art']
                # modal_verb = sentencesForm.cleaned_data['modal_verb']
                # # save to database
                # sentence = Sentences(user=user,
                #                      object=object,
                #                      subject=subject,
                #                      verb=verb,
                #                      adjective=adjective,
                #                      object_determinant=objdet,
                #                      subject_determinant=subjdet,
                #                      object_number=objnum,
                #                      subject_number=subjnum,
                #                      tense=tense,
                #                      progressive=progressive,
                #                      passive=passive,
                #                      perfect=perfect,
                #                      negated=negated,
                #                      sentence_art=sentence_art,
                #                      modal_verb=modal_verb
                #
                #                      )
                # if progressive:
                #     progressive = 'progressive'
                # if perfect:
                #     perfect = 'perfect'
                # if negated:
                #     negated = 'negated'
                # if passive:
                #     passive = 'passive'
                # # create an api query string
                # querystring = {
                #     "object": object,
                #     "subject": subject,
                #     "verb": verb,
                #     "objmod": adjective,
                #     'subjdet': subjdet,
                #     'objdet': objdet,
                #     'objnum': objnum,
                #     'passive': passive,
                #     'progressive': progressive,
                #     'modal': modal_verb,
                #     'perfect': perfect,
                #     'subjnum': subjnum,
                #     'sentencetype': sentence_art,
                #     'negated': negated,
                #     'tense': tense
                #
                # }
                # headers = {
                #     'x-rapidapi-host': "linguatools-sentence-generating.p.rapidapi.com",
                #     'x-rapidapi-key': settings.LINGUA_KEY
                # }
                #
                # response = requests.request("GET", url, headers=headers, params=querystring)
                #
                # # sentence.sentence = response.json()['sentence']
                # # sentence.save()
                # return render(request, 'answer_display.html', {'sentence': response.json()['sentence']})

                def api_call(grammar_arguments=None):
                    if grammar_arguments is None:
                        grammar_arguments = {}
                    querystring = {
                        "object": object,
                        "subject": subject,
                        "verb": verb,
                        "objmod": adjective,
                        'subjdet': subjdet,
                        'objdet': objdet,
                        'objnum': objnum,
                        'subjnum': subjnum,

                    }
                    iter_sentence_type = []
                    if 'tense' in grammar_arguments:
                        # print('Current tense is {}'.format(grammar_arguments['tense']))
                        querystring['tense'] = grammar_arguments['tense'].capitalize()
                        iter_sentence_type.append(grammar_arguments['tense'].capitalize())
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
                    return [requests.request("GET", url, headers=headers, params=querystring).json()['sentence'],
                            type_of_sentence]

                data_dictionary = request.POST.dict()
                data_dictionary["user_id"]= request.session['session_id']
                data_dictionary.pop('csrfmiddlewaretoken')
                request.session['data_dictionary'] = data_dictionary

                # insert_form_data(request=request)

                sentence_grammar = Sentences.objects.create(user=user,
                                                            object=object,
                                                            subject=subject,
                                                            verb=verb,
                                                            adjective=adjective,
                                                            object_determinant=objdet,
                                                            subject_determinant=subjdet,
                                                            object_number=objnum,
                                                            subject_number=subjnum
                                                            )

                tenses = ['past', 'present', 'future']
                other_grammar = ['passive', 'progressive', 'perfect', 'negated']
                results = []
                result_ids = []
                counter=0
                for tense in tenses:
                    for grammar in other_grammar:
                        counter+=1
                        sentence_results = SentenceResults(sentence_grammar=sentence_grammar)
                        arguments = {'tense': tense, grammar: grammar}
                        api_result = api_call(arguments)
                        sentence_results.sentence = api_result[0]
                        sentence_results.sentence_type = api_result[1]
                        sentence_results.save()
                        results.append(sentence_results)
                        result_ids.append(sentence_results.pk)
                        request.session['data_dictionary'] = {
                            # **request.session['data_dictionary'], **{"api_sentence_{}_{}".format(sentence_results.pk,counter):{
                            **request.session['data_dictionary'], **{"api_sentence_{}".format(counter):{

                                "sentence": api_result[0], 'sentence_type': api_result[1],
                                'sentence_id': sentence_results.pk
                            }}
                        }

                request.session['result_ids'] = result_ids
                sentences_dictionary = {
                    'sentences': results,
                }
                return render(request, 'answer_display.html', context=sentences_dictionary)
        return render(request, 'stepwise.html', context=forms)
    else:
        return render(request, 'error.html')
@csrf_exempt
@xframe_options_exempt
def selected_result(request):
    if 'session_id' and 'username' in request.session:
        if request.method == 'POST':
            # sentences = request.session.get('sentences')
            sentence_ids = request.session.get('result_ids')
            loop_counter = 1
            print("*************************************")
            #print(request.session['data_dictionary'])
            for sentence_id in sentence_ids:
                selected_rank = request.POST.get('rank_{}'.format(loop_counter))
                # print(request.POST.get('rank_1'))
                # print(selected_rank)
                loop_counter += 1
                sentence_result = SentenceResults.objects.get(pk=sentence_id)
                selected_result_obj = SentenceRank.objects.create(
                    sentence_result=sentence_result, sentence_rank=selected_rank
                )


                request.session['data_dictionary'] = {**request.session['data_dictionary'],
                                                    #   **{"sentence_rank_{}_{}".format(sentence_id,loop_counter):{
                                                    **{"sentence_rank_{}".format(loop_counter-1):{
                                                          "sentence_rank": selected_rank,
                                                          'sentence_result': sentence_result.sentence,
                                                          'sentence_id': sentence_id
                                                      }}}
            print(request.session['data_dictionary'])
            print(f"----------------{loop_counter}----------------------------")
            data_dictionary = request.POST.dict()
            data_dictionary.pop('csrfmiddlewaretoken')
            request.session['data_dictionary'] = {**request.session['data_dictionary'], **data_dictionary}
            print("--------------------------------------------")
            print(insert_form_data(request.session['data_dictionary']))
            del request.session['data_dictionary']
            # return render(request, 'display_selected_result.html')
            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')

def get_event_id():
    dd=datetime.now()
    time=dd.strftime("%d:%m:%Y,%H:%M:%S")
    url="https://100003.pythonanywhere.com/event_creation"
    data={"platformcode":"FB" ,"citycode":"101","daycode":"0",
                    "dbcode":"pfm" ,"ip_address":"192.168.0.41",
                    "login_id":"lav","session_id":"new",
                    "processcode":"1","regional_time":time,
                    "dowell_time":time,"location":"22446576",
                    "objectcode":"1","instancecode":"100051","context":"afdafa ",
                    "document_id":"3004","rules":"some rules","status":"work"
                    }


    r=requests.post(url,json=data)
    return r.text

def get_dowellclock():
    response_dowell = requests.get('https://100009.pythonanywhere.com/dowellclock')
    data = response_dowell.json()
    return data['t1']

def insert_form_data(data_dict):
    print("----------------> insert form data-- start---------")
    url = 'http://100002.pythonanywhere.com/'
    data_dict['event_id'] = get_event_id()
    data_dict['dowelltime'] = get_dowellclock()
    print("data",data_dict)


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
#added code for posts
def posts(request):
    return render(request, 'posts.html')
#added code for not-scheduled
def not_scheduled(request):
    return render(request,'not-scheduled.html')
#added code for published
def published(request):
    return render(request,'published.html')
#added code for article
def article(request):
    return render(request,'article.html')
#added code for articles
def articles(request):
    return render(request,'show_articles.html')
#added code for topic
def topic(request):
    return render(request, 'topic.html')
#added code for topics
def topics(request):
    return render(request, 'topics.html')
#added code for new_home
def new_home(request):
    return render(request, 'new_main.html')
    #return render(request, 'new_home.html')
#added code for schedule
def schedule(request):
    return render(request, 'unscheduled.html')
def login(request):
    return render(request, 'login.html')