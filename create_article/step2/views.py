from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponseRedirect
import requests
import json
import time
from bs4 import BeautifulSoup
from bs4.element import Comment
import wikipediaapi
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from mega import Mega
from create_article import settings
from website.models import Sentences, SentenceResults, SentenceRank
import urllib

# helper functions
def get_image(urls):
    url = 'http://100045.pythonanywhere.com/dowellmega'
    headers = {'content-type': 'application/json'}
    response = requests.post(url = url,headers=headers)
    responses = json.loads(response.text)
    mega=Mega()
    m = mega.login(responses["username"],responses["password"])
    file=m.download_url(urls,'/home/100007/create_article/static/photos')
    return file

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

def save_data(collection, document, field, team_member_ID):
    url = "http://100002.pythonanywhere.com/"

    # adding eddited field in article
    field['edited'] = 0
    field['event_id'] = get_event_id()
    payload = json.dumps({
      "cluster": "socialmedia",
      "database": "socialmedia",
      "collection": collection,
      "document": document,
      "team_member_ID": team_member_ID,
      "function_ID": "ABCDE",
      "command": "insert",
      "field": field,
      "update_field": {
        "order_nos": 21
      },
      "platform": "bangalore"
    })
    headers = {
      'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)

def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)
    return u" ".join(t.strip() for t in visible_texts)

def pretty_print(headline, json_obj):
    print("-----------------", headline, "-----------------")
    print(json.dumps(json_obj, sort_keys=True, indent=4, separators=(',', ': ')))

def get_dowellclock():
    response_dowell = requests.get('https://100009.pythonanywhere.com/dowellclock')
    data = response_dowell.json()
    return data['t1']

# Create your views here.

@csrf_exempt
@xframe_options_exempt
def main(request):
    context={}
    if 'session_id' and 'username' in request.session:
        context["username"]= request.session['username']
        return render(request, 'main.html',context)
    else:
        try:
            session_id=request.GET.get('session_id',None)
            print("session_id",str(session_id))
            if session_id:
                print('session id present')
                url = "http://100002.pythonanywhere.com/"
                # adding eddited field in article
                payload = json.dumps({
                "cluster": "login",
                "database": "login",
                "collection": "login",
                "document": "login",
                "team_member_ID": "6752828281",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"SessionID":session_id},
                "update_field": "nil",
                "platform": "bangalore"
                })
                headers = {
                'Content-Type': 'application/json'
                }

                response = requests.request("POST", url, headers=headers, data=payload)
                data = json.loads(response.text)
                print('data = ', data)
                print('username',data['data'][0]["Username"])
                print('id',data['data'][0]["SessionID"])
                request.session['username'] = data['data'][0]["Username"]
                request.session['session_id'] =  data['data'][0]["SessionID"]
                context["username"]=data['data'][0]["Username"]
                print(request.session['username'])
                print(request.session['session_id'])
                print('redirecting to main')
                return render(request, 'main.html',context)
            else:
                print('not present')
                return render(request, 'error.html',context)
        except:
            return render(request, 'error.html',context)

def forget_password(request):
    return render(request, 'main.html')


@csrf_exempt
@xframe_options_exempt
def login(request):
    return render(request, 'login.html')
    # return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def logout(request):
    return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def reset_password(request):
    return render(request, 'reset_password.html')
    # return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def confirm_reset_password(request):
    # return render(request, 'login.html')
    return HttpResponseRedirect(reverse("generate_article:login"))

@csrf_exempt
@xframe_options_exempt
def register(request):
    return render(request, 'signup.html')

@csrf_exempt
@xframe_options_exempt
def user_approval(request):
    return render(request, 'user_approval.html')
    # return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def user_approval_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:client"))
    else:
        topic = request.POST.get("topic")
        article = request.POST.get("article")
        post = request.POST.get("post")
        schedule = request.POST.get("schedule")

        print(topic, article, post, schedule)

        return HttpResponseRedirect(reverse("generate_article:client"))

@csrf_exempt
@xframe_options_exempt
def social_media_channels(request):
    return render(request, 'social_media_channels.html')

@csrf_exempt
@xframe_options_exempt
def facebook(request):
    return render(request, 'facebook.html')

@csrf_exempt
@xframe_options_exempt
def facebook_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

@csrf_exempt
@xframe_options_exempt
def insta(request):
    return render(request, 'insta.html')

@csrf_exempt
@xframe_options_exempt
def insta_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

@csrf_exempt
@xframe_options_exempt
def twitter(request):
    return render(request, 'twitter.html')

@csrf_exempt
@xframe_options_exempt
def twitter_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

@csrf_exempt
@xframe_options_exempt
def linkedin(request):
    return render(request, 'linkedin.html')

@csrf_exempt
@xframe_options_exempt
def linkedin_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

@csrf_exempt
@xframe_options_exempt
def youtube(request):
    return render(request, 'youtube.html')

@csrf_exempt
@xframe_options_exempt
def youtube_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

@csrf_exempt
@xframe_options_exempt
def client_profile(request):
    return render(request, 'dowell/clients_profile.html')

@csrf_exempt
@xframe_options_exempt
def client_profile_form(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("generate_article:client"))
    else:
        address = request.POST.get("address")
        business = request.POST.get("business")
        product = request.POST.get("product")
        logo = request.FILES.get("logo")

        print(address, business, product)
        return HttpResponseRedirect(reverse("generate_article:client"))

@csrf_exempt
@xframe_options_exempt
def client(request):
    return render(request, 'dowell/main.html')

@csrf_exempt
@xframe_options_exempt
def user_team(request):
    return render(request, 'my_team.html')

@csrf_exempt
@xframe_options_exempt
def user_usage(request):
    return render(request, 'user_usage.html')

@csrf_exempt
@xframe_options_exempt
def user_plan(request):
    return render(request, 'user_plan.html')

@csrf_exempt
@xframe_options_exempt
def comments(request):
    if 'session_id' and 'username' in request.session:

        # fetching topics according to the user logged in
        url = 'http://100002.pythonanywhere.com/'

        data = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "socialmedia",
            "document": "socialmedia",
            "team_member_ID": "345678977",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"user_id": request.session['session_id']},

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
        topics = response.json()

        # fetching hastags from database
        url = "http://100002.pythonanywhere.com/"

        payload = {
         "cluster": "client_scans",
          "database": "client_data",
          "collection": "hashtags",
          "document": "hashtags",
          "team_member_ID": "10003345",
          "function_ID": "ABCDE",
          "command": "fetch",
          "field": {
            "category": "hashtags"
          },
          "update_field": {
            "order_nos": 21
          },
          "platform": "bangalore"
        }
        headers = {
          'Content-Type': 'application/json'
        }

        response = requests.post( url, headers=headers, json=payload)
        # print(response.text)
        response = json.loads(response.text)
        hashtags = []
        for hashtag in response["data"]:
            if 'hashtag' in hashtag:
                hashtags.append({'hashtag': hashtag['hashtag'], 'group_no': hashtag['group_no']})
        print(hashtags)
        return render(request, 'comments.html',{'topics': topics['data'], 'hashtags': hashtags})
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def generate_comments(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("main-view"))
        else:
            Dowellhandler = request.POST.get("Dowellhandler")
            Product = request.POST.get("Product")
            Hashtag = request.POST.get("Hashtag")
            Topic = request.POST.get("Topic")

            Hashtag = Hashtag.replace('#', '')
            hashtag_split = Hashtag.split()

            Hashtag = hashtag_split[0]
            Hashtag_group = hashtag_split[1]

            url = 'http://100002.pythonanywhere.com/'

            data = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "socialmedia",
                "document": "socialmedia",
                "team_member_ID": "345678977",
                "function_ID": "ABCDE",
                "command": "find",
                "field": {"_id": Product},

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
            topics = response.json()
            # print(topics['data']['target_product'])

            print(Dowellhandler, topics['data']['target_product'], Hashtag, Topic)
            url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"

            def api_call(grammar_arguments=None):
                if grammar_arguments is None:
                    grammar_arguments = {}
                querystring = {
                    "object": Dowellhandler,
                    "subject": topics['data']['target_product'],
                    "verb": Hashtag,
                    'subjdet': Topic,
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
                print(requests.request("GET", url, headers=headers, params=querystring))
                return [requests.request("GET", url, headers=headers, params=querystring).json()['sentence'],
                        type_of_sentence]

            data_dictionary = request.POST.dict()
            data_dictionary["user_id"]= request.session['session_id']
            data_dictionary["Hashtag_group"]= Hashtag_group
            data_dictionary.pop('csrfmiddlewaretoken')
            request.session['data_dictionary'] = data_dictionary
            sentence_grammar = Sentences.objects.create( object = Dowellhandler,
                                                         subject = topics['data']['target_product'],
                                                         verb = Hashtag,
                                                         subject_determinant = Topic,
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
                        **request.session['data_dictionary'], **{"api_sentence_{}".format(counter):{

                            "sentence": api_result[0], 'sentence_type': api_result[1],
                            'sentence_id': sentence_results.pk
                        }}
                    }

            request.session['result_ids'] = result_ids
            sentences_dictionary = {
                'sentences': results,
            }
            print(sentences_dictionary)
            # insert_form_data(request=request)

            return render(request, 'comments_display.html', context=sentences_dictionary)
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def selected_comments(request):
    if 'session_id' and 'username' in request.session:
        if request.method == 'POST':
            sentence_ids = request.session.get('result_ids')
            selected_comment = request.POST.get("comment")

            # testing emoji API RiteKit
            emoji_url = "https://api.ritekit.com/v1/emoji/suggestions?text="

            # text = selected_comment
            # text = urllib.parse.quote(text)

            #using dummy text
            text = "Why%20robots%20may%20soon%20steal%20all%20manufacturing%20jobs%20%E2%80%93%20but%20it%E2%80%99s%20not%20all%20bad%20news"
            final_url = f'{emoji_url}{text}&client_id=a3740ebc104bf4fea425f64b8fca12babb5358d761b4'
            payload={}
            headers = {}

            emoji_response = requests.request("GET", final_url, headers=headers, data=payload)
            emojis = json.loads(emoji_response.text)
            emojis = emojis["emojis"]

            counter = 1
            print("*************************************")
            for sentence_id in sentence_ids:
                sentence_result = SentenceResults.objects.get(pk=sentence_id)
                if sentence_result.sentence == selected_comment:
                    request.session['data_dictionary']['api_sentence_{}'.format(counter)]['selected'] = True
                    # print(True)
                else:
                    request.session['data_dictionary']['api_sentence_{}'.format(counter)]['selected'] = False
                    # print(False)
                counter += 1
            print(request.session['data_dictionary'])
            print(f"----------------{counter}----------------------------")
            data_dictionary = request.POST.dict()
            data_dictionary.pop('csrfmiddlewaretoken')
            request.session['data_dictionary'] = {**request.session['data_dictionary'], **data_dictionary}
            print("--------------------------------------------")
            del request.session['data_dictionary']
            return render(request, 'comments_emojis.html', {'comment' : selected_comment, 'emojis' : emojis})
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def comments_emojis(request):
    if 'session_id' and 'username' in request.session:
        if request.method == 'POST':
            selected_comment = request.POST.get("comment")
            selected_emoji = request.POST.get("emoji")

            print(selected_comment + selected_emoji)
            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def topics(request):
    return render(request, 'topics.html')

@csrf_exempt
@xframe_options_exempt
def unscheduled(request):
    if 'session_id' and 'username' in request.session:
        end_time = time.time()
        print(end_time - 1609459200)
        orig = datetime.fromtimestamp(end_time)
        start = orig - timedelta(hours = 24)
        print(start.timestamp()- 1609459200)
        url = 'http://100032.pythonanywhere.com/api/fetch-fields-from-db'
        request_data={
            'fields':['_id','Topic_description', 'channel', 'mega_drive_link','Image_id'],
            'database_name':'mongodb',
            'collection':'socialmedia_form',
            'database':'client_data',
            ''
            # 'start_point':start.timestamp()- 1609459200,
            'start_point':0,
            'end_point':end_time - 1609459200,
        }
        headers = {'content-type': 'application/json'}
        response = requests.post(url, json=request_data,headers=headers)
        print(response)
        posts = response.json()
        print(posts)
        # for i in range(len(posts)):
        #     posts[i]['image_name'] = get_image(posts[i]['mega_drive_link'])
        #     print(posts[i]['image_name'])
        return render(request, 'unscheduled.html',{'posts':posts})
    else:
        return render(request, 'error.html')
@csrf_exempt
@xframe_options_exempt
def post_scheduler(request):

    # url = "http://100002.pythonanywhere.com/"

    # # adding eddited field in article
    # payload = json.dumps({
    #   "cluster": cluster,
    #   "database": "client_data",
    #   "collection": "socialmedia_form",
    #   "document": document,
    #   "team_member_ID": team_member_ID,
    #   "function_ID": "ABCDE",
    #   "command": "update",
    #   "field": {'_id': id},
    #   "update_field": {
    #     "is_scheduled": True,
    #     "schedule": date,
    #   },
    #   "platform": "bangalore"
    # })
    # headers = {
    #   'Content-Type': 'application/json'
    # }

    # response = requests.request("POST", url, headers=headers, data=payload)
    # print(response.text)

    return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def scheduled(request):
    if 'session_id' and 'username' in request.session:
        return render(request, 'scheduled.html')
    else:
        return render(request, 'error.html')
@xframe_options_exempt
def index(request):
    if 'session_id' and 'username' in request.session:
        url = 'http://100032.pythonanywhere.com/api/fetch-fields-from-db'
        request_data={
            'fields':['_id','verb','subject', 'target_industry', 'sentence_rank_1','sentence_rank_2','sentence_rank_3','sentence_rank_4','sentence_rank_5','sentence_rank_6',
            'sentence_rank_7','sentence_rank_8','sentence_rank_9','sentence_rank_10','sentence_rank_11','sentence_rank_12'],
            'database_name':'mongodb',
            'collection':'socialmedia',
            'database':'social-media-auto',
            'start_point':0,
            'end_point':time.time() - 1609459200,
        }
        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data,headers=headers)
        print(response)
        data = response.json()

        topics = []

        for i in range(len(data)):
            for key in data[i].keys():
                if key.startswith('sentence_rank_'):
                    if data[i][key]['sentence_rank'] is not None:
                        topic = { "rank": data[i][key]['sentence_rank'], "sentence": data[i][key]['sentence_result'], "id":data[i]['_id'], "key":key,
                        "subject":data[i]['subject'], "verb": data[i]['verb'],
                        "target_industry": data[i]['target_industry']}
                        topics.append(topic)

            # subjects.append(data[i]['subject'])
            # verbs.append(data[i]['verb'])
        return render(request, 'article/main.html',{'topics':topics})
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def generate_article_automatically(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("main-view"))
    else:
        title = request.POST.get("title")
        subject = request.POST.get("subject")
        verb = request.POST.get("verb")
        target_industry = request.POST.get("target_industry")
        dowellclock = get_dowellclock()
    SERVER = "https://panel.ai-writer.com/"
    API_KEY = "B91ACB505A7392D27356C26747EDD70D"

    # first, we create a new research request for the keyword title
    research_request_obj = requests.post(SERVER + '/aiw/apiendpoint2/put_research_request/'+requests.utils.quote(title), params={"api_key":API_KEY, "identifier": "test_identifier"}).json()

    # show output
    pretty_print("NEW REQUEST", research_request_obj)


    # now get the research result, we will wait for a while and keep asking the server about it
    for _ in range(30):

        # request the result of the query
        research_result = requests.get(SERVER + '/aiw/apiendpoint2/get_research_result/'+research_request_obj["id"], params={"api_key":API_KEY}).json()

        # if the result is here, we will break the waiting loop
        if "result" in research_result and research_result["result"] is not None:
            break

        # the sleep makes sure we do not bomb the API endpoints
        time.sleep(30)

    para = ''
    src = ''
    # go through all rewritten paragraphs and print them
    for p in research_result["result"]["article"]:
        print(p["paragraph_text"])
        save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": p["paragraph_text"],"citation_and_url": p["paragraph_sources"], 'subject': subject, 'dowelltime': dowellclock}, '74329000')
        para = para + p["paragraph_text"] + '\n'
    # print all cited sources
    for src_url in research_result["result"]["cited_sources"]:
        print("Source:", src_url)
        src = src + src_url + '\n'

    save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title":title, "target_industry":target_industry, "paragraph": para,"source": src, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")

    # generating article through wikipedia
    wiki_language = wikipediaapi.Wikipedia(language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
    page = wiki_language.page(title)
    page_exists = page.exists()
    if page_exists == False:
        print("For Title: "+title+" Page does not exist.")
        print("Using subject: "+ subject +" and verb: "+ verb +" to create an article.")
        title_sub_verb = subject+" "+verb
        page = wiki_language.page(title_sub_verb)
        print("Page - Exists: %s" % page.exists())
        source_verb = ''
        if page.exists() == True:
            article_sub_verb = page.text
            article_sub_verb = article_sub_verb.split("See also")
            save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": title_sub_verb, "target_industry":target_industry, "paragraph": article_sub_verb[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
            para_list = article_sub_verb[0].split("\n\n")
            source_verb = page.fullurl
            for i in range(len(para_list)):
                if para_list[i] != '':
                    save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
        print("Using subject: "+ subject +" to create an article.")
        page = wiki_language.page(subject)
        if page.exists() == False:
            print("Page - Exists: %s" % page.exists())
            message = "Article for Title "+ title_sub_verb +" and Title "+subject+" does not exist."
            return render(request, 'article/article.html',{'message': message, 'title':title})
        else:
            article_subject = page.text
            print(article_subject)
            article_subject = article_subject.split("See also")
            save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": subject, "target_industry":target_industry, "paragraph": article_subject[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
            para_list = article_subject[0].split("\n\n")
            for i in range(len(para_list)):
                if para_list[i] != '':
                    print(para_list[i])
                    save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
                    print("\n")
            if 'article_sub_verb' in locals():
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article_verb': article_sub_verb[0], 'source_verb': source_verb,
                                                        # 'article_subject': article_subject[0], 'source_subject': page.fullurl, 'article_AI': para, 'AI_src': src})
                return HttpResponseRedirect(reverse("generate_article:main-view"))
            else:
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article_subject': article_subject[0], 'source_subject': page.fullurl
                                                                # , 'article_AI': para, 'AI_src': src})
                return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        print("For Title: "+title+" Page exists.")
        article = page.text
        article = article.split("See also")
        save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": article[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
        para_list = article[0].split("\n\n")
        for i in range(len(para_list)):
            if para_list[i] != '':
                save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
        # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article, 'source': page.fullurl, 'subject': subject, 'article_AI': para, 'AI_src': src})
        return HttpResponseRedirect(reverse("generate_article:main-view"))

@csrf_exempt
@xframe_options_exempt
def generate_article(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
            RESEARCH_QUERY = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            dowellclock = get_dowellclock()

        SERVER = "https://panel.ai-writer.com/"
        API_KEY = "B91ACB505A7392D27356C26747EDD70D"

        # first, we create a new research request for the keyword "marketing"
        research_request_obj = requests.post(SERVER + '/aiw/apiendpoint2/put_research_request/'+requests.utils.quote(RESEARCH_QUERY), params={"api_key":API_KEY, "identifier": "test_identifier"}).json()

        # show output
        pretty_print("NEW REQUEST", research_request_obj)


        # now get the research result, we will wait for a while and keep asking the server about it
        for _ in range(30):

            # request the result of the query
            research_result = requests.get(SERVER + '/aiw/apiendpoint2/get_research_result/'+research_request_obj["id"], params={"api_key":API_KEY}).json()

            # if the result is here, we will break the waiting loop
            if "result" in research_result and research_result["result"] is not None:
                break

            # the sleep makes sure we do not bomb the API endpoints
            time.sleep(30)

        para = ''
        src = ''
        # go through all rewritten paragraphs and print them
        for p in research_result["result"]["article"]:
            print(p["paragraph_text"])
            save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": RESEARCH_QUERY, "target_industry":target_industry, "paragraph": p["paragraph_text"],"citation_and_url": p["paragraph_sources"], 'subject': subject, 'dowelltime': dowellclock}, '74329000')
            para = para + p["paragraph_text"] + '\n'
        # print all cited sources
        for src_url in research_result["result"]["cited_sources"]:
            print("Source:", src_url)
            src = src + src_url + '\n'

        try:
            save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title":RESEARCH_QUERY, "target_industry":target_industry, "paragraph": para,"source": src, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
            # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'title': RESEARCH_QUERY, 'article': para, 'source': src})
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        except:
            return render(request, 'article/article.html',{'message': "Article did not save Successfully.", 'title': RESEARCH_QUERY})
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def generate_article_wiki(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("main-view"))
        else:
            title = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            dowellclock = get_dowellclock()
            wiki_language = wikipediaapi.Wikipedia(language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
            page = wiki_language.page(title)
            page_exists = page.exists()
            if page_exists == False:
                print("For Title: "+title+" Page does not exist.")
                print("Using subject: "+ subject +" and verb: "+ verb +" to create an article.")
                title_sub_verb = subject+" "+verb
                page = wiki_language.page(title_sub_verb)
                print("Page - Exists: %s" % page.exists())
                source_verb = ''
                if page.exists() == True:
                    article_sub_verb = page.text
                    article_sub_verb = article_sub_verb.split("See also")
                    save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": title_sub_verb, "target_industry":target_industry, "paragraph": article_sub_verb[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
                    para_list = article_sub_verb[0].split("\n\n")
                    source_verb = page.fullurl
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
                print("Using subject: "+ subject +" to create an article.")
                page = wiki_language.page(subject)
                if page.exists() == False:
                    print("Page - Exists: %s" % page.exists())
                    message = "Article for Title "+ title_sub_verb +" and Title "+subject+" does not exist."
                    return render(request, 'article/article.html',{'message': message})
                else:
                    article_subject = page.text
                    print(article_subject)
                    article_subject = article_subject.split("See also")
                    save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": subject, "target_industry":target_industry, "paragraph": article_subject[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
                    para_list = article_subject[0].split("\n\n")
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            print(para_list[i])
                            save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
                            print("\n")
                    if 'article_sub_verb' in locals():
                        # return render(request, 'article/article.html',{'message': "Article using verb and subject saved Successfully.", 'article_verb': article_sub_verb[0], 'source_verb': source_verb,
                                                                # 'article': article_subject[0], 'source': page.fullurl,  'title': title})
                        return HttpResponseRedirect(reverse("generate_article:main-view"))

                    else:
                        # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article_subject[0], 'source': page.fullurl,  'title': title})
                        return HttpResponseRedirect(reverse("generate_article:main-view"))
            else:
                print("For Title: "+title+" Page exists.")
                article = page.text
                article = article.split("See also")
                save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": article[0],"source": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
                para_list = article[0].split("\n\n")
                for i in range(len(para_list)):
                    if para_list[i] != '':
                        save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": para_list[i],"citation_and_url": page.fullurl, 'subject': subject, 'dowelltime': dowellclock}, '74329000')
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article, 'source': page.fullurl,  'title': title})
                return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def write_yourself(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("main-view"))
        else:
            title = request.POST.get("title")
            print("title in write view: ", title)
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            print("target_industry in write: ", target_industry)
        return render(request, 'article/write.html',{'title':title, 'subject':subject, 'verb':verb, 'target_industry': target_industry})
    else:
        return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def verify_article(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
            title = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            print("target_industry in verify: ", target_industry)
            dowellclock = get_dowellclock()
            article = request.POST.get("articletextarea")
            source = request.POST.get("url")
            headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
            response = requests.get(source, headers = headers)

            if response.status_code == 403:
                message = "Error code 403 Forbidden: Website does not allow to verify the article."
                return render(request, 'article/article.html',{'message': message, 'article': article, 'source': source, 'title': title})
            else:
                text_from_page_space = text_from_html(response.text)
                text_from_page = text_from_page_space.replace(" ","")
                text_from_page = text_from_page.replace("\xa0","")
                print(article)
                paragraph = article.split("\r\n")
                first_para = paragraph[0].replace(" ","")
                last_para = paragraph[-1].replace(" ","")
                if first_para in text_from_page and last_para in text_from_page:
                    print("Article Verified")
                    message = "Article Verified, "
                    for i in range(len(paragraph)):

                        #check for empty paragraph
                        if paragraph[i] == "":
                            continue
                        #saving paragraphs in article
                        save_data('step2_paragraph','socialmedia', {"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": paragraph[i],"citation_and_url": source, 'subject': subject, 'dowelltime': dowellclock}, '74329000')

                    #saving article
                    save_data('step2_data',"step2_data",{"user_id": request.session['session_id'], "title": title, "target_industry":target_industry, "paragraph": article,"source": source, 'subject': subject, 'dowelltime': dowellclock}, "9992828281")
                    print("Article saved successfully")
                    message = message + "Article saved successfully"
                    return HttpResponseRedirect(reverse("generate_article:main-view"))
                else:
                    print("Article Not Verified")
                    message = "Article not Verified."
                    print(text_from_page_space)
                    return render(request, 'article/article.html',{'message': message, 'article': article, 'source': source, 'title': title})
    else:
        return render(request, 'error.html')


@xframe_options_exempt
def list_article(request):
    if 'session_id' and 'username' in request.session:
        end_time = time.time()
        url = 'http://100032.pythonanywhere.com/api/fetch-fields-from-db'
        request_data={
            'fields':['_id','title', 'paragraph', 'source'],
            'database_name':'mongodb',
            'collection':'step2_data',
            'database':'social-media-auto',
            'start_point':0,
            'end_point':end_time - 1609459200,
        }
        headers = {'content-type': 'application/json'}
        response = requests.post(url, json=request_data,headers=headers)
        print(response)
        posts = response.json()
        return render(request, 'post_list.html',{'posts':posts})
    else:
        return render(request, 'error.html')

@xframe_options_exempt
def filtered_list_article(request, filter):
    # end_time = time.time()
    # url = 'http://100032.pythonanywhere.com/api/fetch-fields-from-db'
    # request_data={
    #     'fields':['_id','title', 'paragraph', 'source'],
    #     'database_name':'mongodb',
    #     'collection':'step2_data',
    #     'database':'social-media-auto',
    #     'target_industry':"Food & Beverages",
    #     'start_point':0,
    #     'end_point':end_time - 1609459200,
    # }
    url = "http://100002.pythonanywhere.com/"

    # adding eddited field in article

    payload = json.dumps({
      "cluster": "socialmedia",
      "database": "socialmedia",
      "collection": 'step2_data',
      "document": 'step2_data',
      "team_member_ID": "9992828281",
      "function_ID": "ABCDE",
      "command": "find",
      "field": {'target_industry':"Food & Beverages"},
      "update_field": {
        "order_nos": 21
      },
      "platform": "bangalore"
    })
    headers = {
      'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    posts = response.json()
    print(posts)
    return render(request, 'post_filter_list.html',{'posts':posts})

@csrf_exempt
@xframe_options_exempt
def article_detail(request):
    if 'session_id' and 'username' in request.session:
        if request.method!="POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
            id = request.POST.get("post_id")
            title = request.POST.get("title")
            paragraph = request.POST.get("paragraph")
            paragraph = paragraph.split('\r\n')
            source = request.POST.get("source")
            if "\r\n" in source:
                source = source.split('\r\n')
            post = {
                "id":id,
                "title":title,
                "paragraph":paragraph,
                "source":source}
            return render(request, 'post_detail.html',{'post':post})
    else:
        return render(request, 'error.html')