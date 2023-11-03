import concurrent.futures
import datetime
import json
import random
import time
import traceback
import urllib
import urllib.parse
from datetime import datetime, date
# image resizing
from io import BytesIO

# from website.views import get_client_approval
import openai
import pytz
import requests
import wikipediaapi
from PIL import Image
from bson import ObjectId
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.timezone import localdate, localtime
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from pexels_api import API
from pymongo import MongoClient
from rest_framework import status
from rest_framework.response import Response
# rest(React endpoints)
from rest_framework.views import APIView

from create_article import settings
from helpers import (download_and_upload_image,
                     save_data, create_event, fetch_user_info, save_comments, check_connected_accounts,
                     check_if_user_has_social_media_profile_in_aryshare, text_from_html,
                     update_aryshare, get_key)
from website.models import Sentences, SentenceResults
from .forms import VerifyArticleForm
from .serializers import (ProfileSerializer, CitySerializer, UnScheduledJsonSerializer,
                          ScheduledJsonSerializer, ListArticleSerializer, RankedTopicListSerializer,
                          MostRecentJsonSerializer)

global PEXELS_API_KEY

PEXELS_API_KEY = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'

# helper functions


def under_maintenance(request):
    context = {
        'message': "Kindly bear with us and check back in a few.",
    }
    return render(request, 'under_maintenance.html', context)


@method_decorator(csrf_exempt, name='dispatch')
def frontend_api_request(request):
    '''Acts as a proxy to the external API.
    Handles communication with frontend '''
    if request.session.get("session_id"):
        api_key = PEXELS_API_KEY
        response_data = {'api_key': api_key, 'status_code': 200}
    else:
        response_data = {'error': 'API KEY not found', 'status_code': 400}

    return JsonResponse(response_data, status=response_data['status_code'])


def handler404(request, exception):
    return render(request, 'errors/404.html', status=404)


def handler500(request):
    return render(request, 'errors/500.html', status=500)


def exit_view(request):
    session_id_from_frontend = request.session.session_key
    print("frontend", session_id_from_frontend)
    session_id_from_backend = request.session.get('session_id')
    print("backend", session_id_from_backend)
    print("Before flushing:", request.session.get('session_id'))
    request.session.flush()
    print("After flushing:", request.session.get('session_id'))
    # Redirect to another page
    return redirect("https://100093.pythonanywhere.com/")


def dowell_login(request):
    try:
        session_id = request.GET.get('session_id', None)
        request.session["session_id"] = session_id
        return redirect("http://127.0.0.1:8000/api/v1/main")
    except:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")


def forget_password(request):
    return render(request, 'main.html')


@csrf_exempt
@xframe_options_exempt
def login(request):
    return render(request, 'login.html')
    # return HttpResponseRedirect(reverse("generate_article:main-view"))


def Logout(request):
    session_id = request.session.get("session_id")
    if session_id:
        try:
            del request.session["session_id"]
            return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=https://www.socialmediaautomation.uxlivinglab.online")
        except:
            return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=https://www.socialmediaautomation.uxlivinglab.online")
    else:
        return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=https://www.socialmediaautomation.uxlivinglab.online")


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


@method_decorator(csrf_exempt, name='dispatch')
class MainAPIView(APIView):
    def get(self, request):
        if request.session.get("session_id"):
            user_map = {}
            redirect_to_living_lab = True
            url_1 = "https://100093.pythonanywhere.com/api/userinfo/"
            session_id = request.session["session_id"]
            response_1 = requests.post(url_1, data={"session_id": session_id})
            if response_1.status_code == 200 and "portfolio_info" in response_1.json():
                profile_details = response_1.json()
                request.session['portfolio_info'] = profile_details['portfolio_info']
                user_map[profile_details['userinfo']['userID']
                         ] = profile_details['userinfo']['username']

            else:
                url_2 = "https://100014.pythonanywhere.com/api/userinfo/"
                response_2 = requests.post(
                    url_2, data={"session_id": session_id})

                if response_2.status_code == 200 and "portfolio_info" in response_2.json():
                    profile_details = response_2.json()
                    request.session['portfolio_info'] = profile_details['portfolio_info']
                    user_map[profile_details['userinfo']['userID']
                             ] = profile_details['userinfo']['username']

                else:
                    profile_details = {}
                    request.session['portfolio_info'] = []

            if "userinfo" in profile_details:
                request.session['userinfo'] = profile_details['userinfo']
                request.session['username'] = profile_details['userinfo']['username']
                request.session['user_id'] = profile_details['userinfo']['userID']
                request.session['timezone'] = profile_details['userinfo']['timezone']

            if request.session['portfolio_info'] == []:
                request.session['operations_right'] = 'member'
                request.session['org_id'] = '0001'
            else:
                for info in request.session['portfolio_info']:
                    if info['product'] == 'Social Media Automation':
                        request.session['operations_right'] = info['operations_right']
                        request.session['org_id'] = info['org_id']
                        break
                else:
                    request.session['operations_right'] = 'member'
                    request.session['org_id'] = info['org_id'] if info else ''

            username = user_map.get(request.session['user_id'], None)

            request.session['session_id'] = session_id

            # if not has_access(request.session['portfolio_info']):
            #     return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            # credit_handler = CreditHandler()
            # credit_handler.login(request)

            # Serialize the response data using ProfileSerializer
            serializer = ProfileSerializer({
                "userinfo": profile_details.get('userinfo', {}),
                "portfolio_info": profile_details.get('portfolio_info', []),
                "username": request.session['username'],
                "user_id": request.session['user_id'],
                "timezone": request.session['timezone'],
                "operations_right": request.session['operations_right'],
                "org_id": request.session['org_id']
            })

            return Response(serializer.data)

        else:
            return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")
            # return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''
step-2 starts here
'''


class ListArticleView(APIView):
    def get(self, request, *args, **kwargs):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step2_data",
                "document": "step2_data",
                "team_member_ID": "9992828281",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"user_id": request.session['user_id']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=data)

            response_data_json = json.loads(response.json())

            user_id = str(request.session['user_id'])
            article_detail_list = response_data_json.get('data', [])

            user_articles = []
            for article in article_detail_list:
                if article.get('user_id') == user_id:
                    articles = {
                        'article_id': article.get('_id'),
                        'title': article.get('title'),
                        'paragraph': article.get('paragraph'),
                        'source': article.get('source'),
                    }
                    user_articles.append(articles)
            user_articles = list(reversed(user_articles))

            number_of_items_per_page = 5
            page = request.GET.get('page', 1)

            paginator = Paginator(user_articles, number_of_items_per_page)
            try:
                page_article = paginator.page(page)
            except PageNotAnInteger:
                page_article = paginator.page(1)
            except EmptyPage:
                page_article = paginator.page(paginator.num_pages)

            # Include pagination metadata in the response
            serialized_data = ListArticleSerializer(page_article, many=True)

            response_data = {
                'Articles': serialized_data.data,
                'page': page_article.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            }

            return Response(response_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class ArticleDetailView(APIView):
    def post(self, request):
        if 'session_id' and 'username' in request.session:
            profile = request.session['operations_right']
            print(profile)
            if request.method != "POST":
                return Response({'error': 'Bad request'}, status=400)
            else:
                data = request.data
                article_id = data.get("article_id")
                title = data.get("title")
                paragraph = data.get("paragraph")
                paragraph = paragraph.split('\r\n')
                source = data.get("source")
                if "\r\n" in source:
                    source = source.split('\r\n')

                post = {
                    "post_id": article_id,
                    "title": title,
                    "paragraph": paragraph,
                    "source": source
                }
            response_data = {'post': post, 'profile': profile}
            return Response(response_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class IndexView(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            # credit_handler = CreditHandler()
            # credit_response = credit_handler.check_if_user_has_enough_credits(
            #     sub_service_id=STEP_2_SUB_SERVICE_ID,
            #     request=request,
            # )

            # if not credit_response.get('success'):
            #     return redirect(reverse('credit_error_view'))

            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "socialmedia",
                "document": "socialmedia",
                "team_member_ID": "345678977",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"username": request.session['username']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }
            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)
            results = json.loads(response.json())
            # getting the operation right of a user
            try:
                profile = str(request.session['operations_right'])
            except:
                profile = 'member'

            # drops the first 10 on the json file

            try:
                # Get the user org ids from the portfolio objects of the user
                user_org_id_list = [portfolio_info.get(
                    'org_id') for portfolio_info in request.session['portfolio_info'] if portfolio_info.get('org_id', None)]

                datas = results['data']

                array = []
                # Loops through all the data rows
                for row in datas:
                    # print('this is the row')
                    # print(row)

                    try:
                        # Get the org_id from the question data
                        org_id = row.get('org_id')
                        # Filter the question data with the org_ids from the user's portfolio
                        if org_id in user_org_id_list and row.get('username'):

                            array.append(row)
                    except Exception as e:
                        traceback.print_exc()

                topics = []

                # Retrieving the page number from the url
                number_of_items_per_page = 10
                page = request.GET.get('page', 1)
                # if isinstance(page,str) and page.isnumeric():
                #     page=int(page)
                # end_number=(number_of_items_per_page*page)
                # start_number=end_number-number_of_items_per_page

                array.reverse()

                for counter, data in enumerate(array):

                    for key in data.keys():
                        if key.startswith("sentence_rank_") and data[key]['sentence_rank'] is not None:
                            topic = {"ranks": data[key]['sentence_rank'], "sentence": data[key]
                                     ['sentence_result'], "key": key, 'created_by': data.get('username', 'NA')}
                            topics.append(topic)

                # Getting the results for a certain page
                paginator = Paginator(topics, number_of_items_per_page)
                try:
                    topics = paginator.page(page)
                except PageNotAnInteger:
                    topics = paginator.page(1)
                except EmptyPage:
                    topics = paginator.page(paginator.num_pages)
                # if len(topics):
                #     total_pages=math.ceil(len(topics)/number_of_items_per_page)
                # total_pages=0
                # topics=topics[start_number:end_number]
            except Exception as e:
                print('this is the error that has occured')
                traceback.print_exc()
                print('================================')
                topics = []

            # Extract the data to be serialized
            topics_data = [{'ranks': topic['ranks'], 'sentence': topic['sentence'],
                           'key': topic['key'], 'created_by': topic.get('created_by', 'NA')} for topic in topics]
            serialized_data = RankedTopicListSerializer(
                topics_data, many=True).data

            return Response({'topics': serialized_data, 'profile': profile, 'page': page})

        else:
            return Response({"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)


class GenerateArticleView(APIView):

    def post(self, request):
        start_datetime = datetime.now()
        session_id = request.GET.get('session_id', None)

        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                RESEARCH_QUERY = request.data.get("title")
                subject = request.data.get("subject")
                verb = request.data.get("verb")
                target_industry = request.data.get("target_industry")
                qualitative_categorization = request.data.get(
                    "qualitative_categorization")
                targeted_for = request.data.get("targeted_for")
                designed_for = request.data.get("designed_for")
                targeted_category = request.data.get("targeted_category")
                image = request.data.get("image")

                user_selected_cities = []
                hashtags = []
                user_tags_mentions = []
                user_data = fetch_user_info(request)

                for item in user_data["data"]:
                    if "target_city" in item:
                        user_selected_cities.extend(item["target_city"])

                    if "hashtag_list" in item:
                        hashtags.extend(item["hashtag_list"])

                    if "mentions_list" in item:
                        user_tags_mentions.extend(item["mentions_list"])

                formatted_hashtags = " ".join(hashtags) if hashtags else ""
                formatted_mentions = " ".join(
                    f"@{mention}" for mention in user_tags_mentions) if user_tags_mentions else ""
                formatted_cities = " ".join(
                    f"#{city}" for city in user_selected_cities) if user_selected_cities else ""

                # Set your OpenAI API key here
                openai.api_key = settings.OPENAI_KEY

                # Build prompt
                prompt_limit = 280

                # Modify the prompt to include the formatted user data
                prompt = (
                    f"Write an article about {RESEARCH_QUERY} that discusses {subject} using {verb} in the {target_industry} industry."
                    f" Generate only 2 paragraphs."
                    f" Include the following at the end of the article {formatted_hashtags}."
                    f" Also, append {formatted_cities} to the end of the article ."
                    [:prompt_limit]
                    + "..."
                )

                # Variables for loop control
                duration = 4   # Total duration in seconds
                interval = 0.9  # Interval between generating articles in seconds
                start_time = time.time()

                def generate_and_save_article():
                    nonlocal start_time

                    # Generate article using OpenAI's GPT-3
                    response = openai.Completion.create(
                        engine="text-davinci-003",
                        prompt=prompt,
                        temperature=0.5,
                        max_tokens=1024,
                        n=1,
                        stop=None,
                        timeout=60,
                    )
                    article = response.choices[0].text
                    paragraphs = article.split("\n\n")
                    article_str = "\n\n".join(paragraphs)

                    sources = urllib.parse.unquote("")

                    try:
                        with transaction.atomic():
                            event_id = create_event()['event_id']
                            user_id = request.session['user_id']
                            client_admin_id = request.session['userinfo']['client_admin_id']

                            # Save data for step 3
                            step3_data = {
                                "user_id": user_id,
                                "session_id": session_id,
                                "eventId": event_id,
                                'client_admin_id': client_admin_id,
                                "title": RESEARCH_QUERY,
                                "target_industry": target_industry,
                                "qualitative_categorization": qualitative_categorization,
                                "targeted_for": targeted_for,
                                "designed_for": designed_for,
                                "targeted_category": targeted_category,
                                "source": sources,
                                "image": image,
                                "paragraph": article_str,
                                "citation_and_url": sources,
                                "subject": subject,

                            }
                            save_data('step3_data', 'step3_data',
                                      step3_data, '34567897799')
                            # Save data for step 2
                            step2_data = {
                                "user_id": user_id,
                                "session_id": session_id,
                                "eventId": event_id,
                                'client_admin_id': client_admin_id,
                                "title": RESEARCH_QUERY,
                                "target_industry": target_industry,
                                "paragraph": article_str,
                                "source": sources,
                                "subject": subject,
                                "citation_and_url": sources,
                            }
                            save_data('step2_data', 'step2_data',
                                      step2_data, '9992828281')

                    except:
                        return Response({"message": "Article did not save successfully"}, status=status.HTTP_400_BAD_REQUEST)

                    # Update start_time for the next iteration
                    start_time = time.time()

                # Create ThreadPoolExecutor
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    while True:
                        if time.time() - start_time >= duration:
                            break

                        executor.submit(generate_and_save_article)

                        # Wait before generating the next article
                        time.sleep(interval)

                end_datetime = datetime.now()
                time_taken = end_datetime - start_datetime
                print(f"Task started at: {start_datetime}")
                print(f"Task completed at: {end_datetime}")
                print(f"Total time taken: {time_taken}")

                return Response({"message": "Article saved successfully"}, status=status.HTTP_200_OK)

        else:
            return Response({"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)


class GenerateArticleWikiView(APIView):
    def post(self, request):
        session_id = request.GET.get('session_id', None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                title = request.data.get("title")
                subject = request.data.get("subject")
                verb = request.data.get("verb")
                target_industry = request.data.get("target_industry")
                qualitative_categorization = request.data.get(
                    "qualitative_categorization")
                targeted_for = request.data.get("targeted_for")
                designed_for = request.data.get("designed_for")
                targeted_category = request.data.get("targeted_category")
                image = request.data.get("image")

                wiki_language = wikipediaapi.Wikipedia(
                    language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
                page = wiki_language.page(title)
                page_exists = page.exists()

                if page_exists is False:
                    title_sub_verb = subject + " " + verb
                    page = wiki_language.page(title_sub_verb)
                    source_verb = ''
                    if page.exists() == True:
                        article_sub_verb = page.text
                        article_sub_verb = article_sub_verb.split("See also")
                        save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                               "title": title_sub_verb,
                                                               "target_industry": target_industry,
                                                               "paragraph": article_sub_verb[0],
                                                               "source": page.fullurl,
                                                               'subject': subject,
                                                               # 'dowelltime': dowellclock
                                                               }, "9992828281")
                        para_list = article_sub_verb[0].split("\n\n")
                        source_verb = page.fullurl
                        for i in range(len(para_list)):
                            if para_list[i] != '':
                                save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                       "session_id": session_id,
                                                                       "eventId": create_event()['event_id'],
                                                                       'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                                       "title": title,
                                                                       "target_industry": target_industry,
                                                                       "qualitative_categorization": qualitative_categorization,
                                                                       "targeted_for": targeted_for,
                                                                       "designed_for": designed_for,
                                                                       "targeted_category": targeted_category,
                                                                       "image": image,
                                                                       "paragraph": para_list[i],
                                                                       "citation_and_url": page.fullurl,
                                                                       'subject': subject,
                                                                       # 'dowelltime': dowellclock
                                                                       }, '34567897799')
                    print("Using subject: " + subject +
                          " to create an article.")
                    page = wiki_language.page(title_sub_verb)
                    if page.exists() == False:
                        return Response({'message': f"There were no results matching the query as the page '{title}' does not exist in Wikipedia"}, status=status.HTTP_404_NOT_FOUND)
                    else:
                        article_subject = page.text
                        print(article_subject)
                        article_subject = article_subject.split("See also")
                        save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                               "title": subject,
                                                               "target_industry": target_industry,
                                                               "paragraph": article_subject[0],
                                                               "source": page.fullurl,
                                                               'subject': subject,
                                                               # 'dowelltime': dowellclock
                                                               }, "9992828281")
                        para_list = article_subject[0].split("\n\n")
                        for i in range(len(para_list)):
                            if para_list[i] != '':
                                print(para_list[i])
                                save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                       "session_id": session_id,
                                                                       "eventId": create_event()['event_id'],
                                                                       'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                                       "title": title,
                                                                       "target_industry": target_industry,
                                                                       "qualitative_categorization": qualitative_categorization,
                                                                       "targeted_for": targeted_for,
                                                                       "designed_for": designed_for,
                                                                       "targeted_category": targeted_category,
                                                                       "image": image,
                                                                       "paragraph": para_list[i],
                                                                       "citation_and_url": page.fullurl,
                                                                       'subject': subject,
                                                                       # 'dowelltime': dowellclock
                                                                       }, '34567897799')
                                print("\n")

                        # credit_handler = CreditHandler()
                        # credit_handler.consume_step_2_credit(request)
                        if 'article_sub_verb' in locals():
                            return Response({'message': 'Article using verb and subject saved Successfully'}, status=status.HTTP_201_CREATED)
                        else:
                            return Response({'message': 'Article saved Successfully'}, status=status.HTTP_201_CREATED)

                else:
                    print("For Title: "+title+" Page exists.")
                    article = page.text
                    article = article.split("See also")
                    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "eventId": create_event()['event_id'],
                                                           'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                           "title": title,
                                                           "target_industry": target_industry,
                                                           "paragraph": article[0],
                                                           "source": page.fullurl,
                                                           'subject': subject,
                                                           # 'dowelltime': dowellclock
                                                           }, "9992828281")
                    para_list = article[0].split("\n\n")
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                   "session_id": session_id,
                                                                   "eventId": create_event()['event_id'],
                                                                   'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                                   "title": title,
                                                                   "target_industry": target_industry,
                                                                   "qualitative_categorization": qualitative_categorization,
                                                                   "targeted_for": targeted_for,
                                                                   "designed_for": designed_for,
                                                                   "targeted_category": targeted_category,
                                                                   "image": image,
                                                                   "paragraph": para_list[i],
                                                                   "citation_and_url": page.fullurl,
                                                                   'subject': subject,
                                                                   # 'dowelltime': dowellclock
                                                                   }, '34567897799')
                    # credit_handler = CreditHandler()
                    # credit_handler.consume_step_2_credit(request)
                    return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class WriteYourselfView(APIView):
    def post(self, request):
        if 'session_id' and 'username' in request.session:
            if request.method != "POST":
                return Response({'error': 'You have to choose a sentence first to write its article.'}, status=400)
            form = VerifyArticleForm()
            title = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")

            response_data = {
                'title': title,
                'subject': subject,
                'verb': verb,
                'target_industry': target_industry,
                'form': form
            }

            return Response({'message': 'Article saved successfully', 'data': response_data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class VerifyArticle(APIView):
    def pot(self, request):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                title = request.data.get("title")
                subject = request.data.get("subject")
                verb = request.data.get("verb")
                target_industry = request.data.get("target_industry")
                qualitative_categorization = request.data.get(
                    "qualitative_categorization")
                targeted_for = request.data.get("targeted_for")
                designed_for = request.data.get("designed_for")
                targeted_category = request.data.get("targeted_category")
                image = request.data.get("image")
                # dowellclock = get_dowellclock()
                article = request.data.get("articletextarea")
                source = request.data.get("url")
                form = VerifyArticleForm(request.data)

                if not form.is_valid():
                    response_data = {
                        'title': title,
                        'subject': subject,
                        'verb': verb,
                        'target_industry': target_industry,
                        'form': form
                    }
                    return Response({'error': 'Please fix the errors below', 'data': response_data}, status=status.HTTP_400_BAD_REQUEST)
                headers = {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
                try:
                    response = requests.get(source, headers=headers)
                except Exception as e:
                    print(str(e))
                    response_data = {
                        'title': title,
                        'subject': subject,
                        'verb': verb,
                        'target_industry': target_industry,
                        'form': form
                    }
                    return Response({'error': 'The url of the article has not been authorized!', 'data': response_data}, status=status.HTTP_400_BAD_REQUEST)

                if response.status_code == 403:
                    message = "Error code 403 Forbidden: Website does not allow to verify the article."
                    response_data = {
                        'title': title,
                        'source': source,
                        'article': article,
                    }
                    return Response({'error': 'Error code 403 Forbidden: Website does not allow to verify the article.', 'data': response_data}, status=status.HTTP_403_FORBIDDEN)

                else:
                    text_from_page_space = text_from_html(response.text)
                    text_from_page = text_from_page_space.replace(" ", "")
                    text_from_page = text_from_page.replace("\xa0", "")
                    print(article)
                    paragraph = article.split("\r\n")

                    message = "Article Verified, "
                    for i in range(len(paragraph)):
                        if paragraph[i] == "":
                            continue
                        save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo'][
                            'client_admin_id'],
                            "title": title,
                            "target_industry": target_industry,
                            "qualitative_categorization": qualitative_categorization,
                            "targeted_for": targeted_for,
                            "designed_for": designed_for,
                            "targeted_category": targeted_category,
                            "image": image,
                            "paragraph": paragraph[i],
                            "source": source,
                            'subject': subject,
                            # 'dowelltime': dowellclock
                        }, '34567897799')
                        save_data('step4_data', 'step4_data', {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo'][
                            'client_admin_id'],
                            "title": title,
                            "qualitative_categorization": qualitative_categorization,
                            "targeted_for": targeted_for,
                            "designed_for": designed_for,
                            "targeted_category": targeted_category,
                            "image": image,
                            "paragraph": paragraph,
                            "source": source,
                            "date": str(date),
                            "time": str(time),
                        }, '34567897799')

                    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "eventId": create_event()['event_id'],
                                                           'client_admin_id': request.session['userinfo'][
                        'client_admin_id'],
                        "title": title,
                        "target_industry": target_industry,
                        "paragraph": article,
                        "source": source,
                        'subject': subject,
                        # 'dowelltime': dowellclock
                    }, "9992828281")

                    # credit_handler = CreditHandler()
                    # credit_handler.consume_step_2_credit(request)
                    return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)

        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''
step-2 Ends here
'''

'''
step-3 starts here
'''


class PostListView(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step3_data",
                "document": "step3_data",
                "team_member_ID": "34567897799",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"user_id": request.session['user_id']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)

            user = str(request.session['user_id'])
            response_data_json = json.loads(response.json())
            user_id = str(request.session['user_id'])
            article_detail_list = response_data_json.get('data', [])

            datas = article_detail_list

            posts = []

            for article in article_detail_list:

                if article.get('user_id') == user_id:
                    articles = {
                        'post_id': article.get('_id'),
                        'title': article.get('title'),
                        'paragraph': article.get('paragraph'),
                        'source': article.get('source'),
                    }
                    posts.append(articles)
            posts = list(reversed(posts))

            # Pagination
            number_of_items_per_page = 5
            page = request.GET.get('page', 1)

            paginator = Paginator(posts, number_of_items_per_page)
            try:
                page_post = paginator.page(page)
            except PageNotAnInteger:
                page_post = paginator.page(1)
            except EmptyPage:
                page_post = paginator.page(paginator.num_pages)

            # Serialize page_post to JSON-serializable format
            page_post_data = list(page_post)
            serialized_page_post = [
                {
                    'post_id': post['post_id'],
                    'title': post['title'],
                    'paragraph': post['paragraph'],
                    'source': post['source']
                }
                for post in page_post_data
            ]

            response_data = {
                'posts': serialized_page_post,
                'page': page_post.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            }

            return Response(response_data)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class PostDetailView(APIView):
    def post(self, request):
        if 'session_id' and 'username' in request.session:
            # credit_handler = CreditHandler()
            # credit_response = credit_handler.check_if_user_has_enough_credits(
            #     sub_service_id=STEP_3_SUB_SERVICE_ID,
            #     request=request,
            # )

            # if not credit_response.get('success'):
            #     return redirect(reverse('credit_error_view'))
            url = "http://uxlivinglab.pythonanywhere.com"
            payload = json.dumps({
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "qual_cat",
                "document": "qual_cat",
                "team_member_ID": "1145",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {'target_industry': "Food & Beverages"},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }
            response = requests.request(
                "POST", url, headers=headers, data=payload)

            profile = request.session['operations_right']

            categ = json.loads(response.json())['data']
            print(categ)
            categories = []
            for row in categ:
                for data in row:
                    for key, value in data.items():
                        if key == 'category':
                            categories.append(value)

            if request.method != "POST":
                return Response({'error': 'Bad request'}, status=400)
            else:
                data = request.data
                post_id = data.get('post_id')
                title = data.get("title")
                paragraph = data.get("paragraph")
                paragraph = paragraph.split('\r\n')
                source = data.get("source")
                if "\r\n" in source:
                    source = source.split('\r\n')

                post = {
                    "_id": post_id,
                    "title": title,
                    "paragraph": paragraph,
                    "source": source
                }
            a = random.randint(1, 9)
            query = title
            output = []
            api = API(PEXELS_API_KEY)
            # api.popular(results_per_page=10, page=5)
            pic = api.search(query, page=a, results_per_page=10)
            width = 350
            for photo in pic['photos']:
                pictures = photo['src']['medium']
                img_data = requests.get(pictures).content
                im = Image.open(BytesIO(img_data))
                wit = im.size
                if wit[0] >= width:
                    output.append(pictures)
            if len(output) == 0:
                messages.error(request, 'No images found!')
                return redirect(reverse('generate_article:article-list'))
            images = output[1]
            print(profile)
            messages.info(
                request, 'You are limited to use only images from Samanta AI due to security and privacy policy')
            response_data = {'post': post, 'categories': categories,
                             'images': images, 'profile': profile}
            return Response(response_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class SavePostView(APIView):
    def post(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            eventId = create_event()['event_id'],
            if request.method != "POST":
                return Response({'error': 'Bad request'}, status=400)
            else:
                data = request.data
                title = data.get("title")
                paragraphs = data.get("paragraphs")
                source = data.get("source")
                qualitative_categorization = data.get(
                    "qualitative_categorization")
                targeted_for = data.get("targeted_for")
                designed_for = data.get("designed_for")
                targeted_category = data.get("targeted_category")
                image = data.get("image")
                # title = request.POST.get("title")
                # paragraphs_list = request.POST.getlist("paragraphs[]")
                # print('paragraphs_list:', paragraphs_list)
                # source = request.POST.get("source")
                # # target_industry = request.POST.get("p-content")
                # qualitative_categorization = request.POST.get(
                #     "qualitative_categorization")
                # targeted_for = request.POST.get("targeted_for")
                # designed_for = request.POST.get("designed_for")
                # targeted_category = request.POST.get("targeted_category")
                # image = request.POST.get("images")
                # # dowellclock = get_dowellclock(),
                # combined_article = "\n\n".join(paragraphs_list)
                # print('combined_article', combined_article[0:230])
                # paragraph_without_commas = combined_article.replace(
                #     '.', '. ').replace(',.', '.')
                # print('paragraph_without_commas:', paragraph_without_commas)

                url = "http://uxlivinglab.pythonanywhere.com"

                uploaded_image = download_and_upload_image(image_url=image)

                image = uploaded_image.get('file_url')

                payload = json.dumps({
                    "cluster": "socialmedia",
                    "database": "socialmedia",
                    "collection": "step4_data",
                    "document": "step4_data",
                    "team_member_ID": "1163",
                    "function_ID": "ABCDE",
                    "command": "insert",
                    "eventId": eventId,
                    # 'dowelltime': dowellclock,
                    "field": {
                        "user_id": request.session['user_id'],
                        "session_id": session_id,
                        "eventId": eventId,
                        'client_admin_id': request.session['userinfo']['client_admin_id'],
                        "title": title,
                        "paragraph": paragraphs,
                        "source": source,
                        "qualitative_categorization": qualitative_categorization,
                        "targeted_for": targeted_for,
                        "designed_for": designed_for,
                        "targeted_category": targeted_category,
                        "image": image,
                        "date": date,
                        "time": str(time),
                        "status": "",
                        "timezone": request.session['timezone'],
                        "username": request.session['username']
                    },
                    "update_field": {
                        "order_nos": 21
                    },
                    "platform": "bangalore"
                })
                headers = {
                    'Content-Type': 'application/json'
                }
                print("This is payload", payload)
                response = requests.request(
                    "POST", url, headers=headers, data=payload)
                print("data:", response.json())
                # make sure to alert the user that the article has been saved sucesfully. (frontend)
                # credit_handler = CreditHandler()
                # credit_handler.consume_step_3_credit(request)
                response_data = {
                    "message": "Post saved successfully",
                    # Redirect to step-4
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


'''step-3 Ends here'''

'''step-4 starts here'''


def api_call(postes, platforms, key, image, request, post_id):

    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

    r1 = requests.post('https://app.ayrshare.com/api/post',
                       json=payload,
                       headers=headers)
    print(r1.json())
    if r1.json()['status'] == 'error':
        messages.error(request, 'error in posting')
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update = update_most_recent(post_id)

    else:
        for warnings in r1.json()['warnings']:
            messages.error(request, warnings['message'])


def api_call_schedule(postes, platforms, key, image, request, post_id, formart):

    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               'scheduleDate': str(formart),
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

    r1 = requests.post('https://app.ayrshare.com/api/post',
                       json=payload,
                       headers=headers)
    print(r1.json())
    if r1.json()['status'] == 'error':
        for error in r1.json()['posts']:
            for message in error['errors']:
                messages.error(request, message['message'][:62])
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update = update_most_recent(post_id)

    else:
        for warnings in r1.json()['warnings']:
            messages.error(request, warnings['message'])


@csrf_exempt
@xframe_options_exempt
def aryshare_profile(request):
    event_id = create_event()['event_id']
    user = request.session['username']
    payload = {'title': user}
    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G"}

    r = requests.post('https://app.ayrshare.com/api/profiles/profile',
                      json=payload,
                      headers=headers)
    data = r.json()
    print(data)
    if data['status'] == 'error':
        messages.error(request, data['message'])
    else:

        url = "http://uxlivinglab.pythonanywhere.com"
        test_date = str(localdate())

        payload = json.dumps({
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "ayrshare_info",
            "document": "ayrshare_info",
            "team_member_ID": "100007001",
            "function_ID": "ABCDE",
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
                "session_id": request.session['session_id'],
                'title': data['title'],
                'refId': data['refId'],
                'profileKey': data['profileKey'],
                "eventId": event_id,

            },
            "update_field": {
                "aryshare_details": {



                }


            },
            "platform": "bangalore"
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        print(data)
        messages.success(request, "Social media profile created...")
    return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def link_media_channels(request):
    session_id = request.GET.get("session_id", None)
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "ayrshare_info",
        "document": "ayrshare_info",
        "team_member_ID": "100007001",
        "function_ID": "ABCDE",
        "command": "fetch",
        "field": {"user_id": request.session['user_id']},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    print(response.json())
    # profile = request.session['operations_right']

    post = json.loads(response.json())

    for posts in post['data']:
        if posts['user_id'] == request.session['user_id']:
            key = posts['profileKey']
            print(key)
    with open(r'/home/100007/dowellresearch.key') as f:
        privateKey = f.read()

    payload = {'domain': 'dowellresearch',
               'privateKey': privateKey,
               'profileKey': key,
               'redirect': 'https://profile.ayrshare.com/social-accounts?domain=dowellresearch'
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

    r = requests.post('https://app.ayrshare.com/api/profiles/generateJWT',
                      json=payload,
                      headers=headers)
    link = r.json()
    print(link)
    return redirect(link['url'])


@csrf_exempt
@xframe_options_exempt
def social_media_channels(request):

    username = request.session['username']
    session = request.session['session_id']
    print(session)
    user_has_social_media_profile = check_if_user_has_social_media_profile_in_aryshare(
        username)
    linked_accounts = check_connected_accounts(username)
    context_data = {'user_has_social_media_profile': user_has_social_media_profile,
                    'linked_accounts': linked_accounts}
    return render(request, 'social_media_channels.html', context_data)


def can_post_on_social_media(request):
    """
    This function check of a user can post an article on social media sites
    """
    portfolio_info = request.session.get('portfolio_info')
    if not portfolio_info:
        return False
    if not isinstance(portfolio_info, list):
        return False
    portfolio_info = portfolio_info[0]
    if portfolio_info.get('member_type') == 'owner' and portfolio_info.get('username') == 'socialmedia':
        return True
    elif portfolio_info.get('member_type') == 'member_type' and portfolio_info.get('username') == 'socialmedia':
        return True
    return False


def linked_account_json(request):
    username = request.session['username']
    linked_accounts = check_connected_accounts(username)

    return JsonResponse({'response': linked_accounts})


@csrf_exempt
@xframe_options_exempt
def most_recent(request):
    if 'session_id' and 'username' in request.session:

        return render(request, 'most_recent.html')
    else:
        return render(request, 'error.html')


@method_decorator(csrf_exempt, name='dispatch')
class MostRecentJSON(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"user_id": request.session['user_id']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }
            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)
            posts = json.loads(response.json())
            user_id = str(request.session['user_id'])
            status = 'posted'
            post = []

            response_data = {  # Initialize the response_data here
                'Most Recent Posts': [],
                'page': 1,
                'total_pages': 1,
                'total_items': 0,
            }

            try:
                for row in posts['data']:
                    if user_id == str(row['user_id']):
                        try:
                            if status == row['status']:
                                data = {
                                    'title': row['title'],
                                    'paragraph': row['paragraph'],
                                    'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date(),
                                    'image': row['image'],
                                    'source': row['source'],
                                    'time': row['time']
                                }
                                post.append(data)
                        except:
                            pass

                post = list(reversed(post))
                number_of_items_per_page = 5
                page = request.GET.get('page', 1)
                paginator = Paginator(post, number_of_items_per_page)
                try:
                    page_article = paginator.page(page)
                except PageNotAnInteger:
                    page_article = paginator.page(1)
                except EmptyPage:
                    page_article = paginator.page(paginator.num_page)
                serializer = MostRecentJsonSerializer(
                    {'response': page_article})

                response_data = {
                    'Most Recent Posts': serializer.data,
                    'page': page_article.number,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                }
            except:
                print('no post')

            return Response(response_data)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


def update_most_recent(pk):
    url = "http://uxlivinglab.pythonanywhere.com"
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')

    # adding eddited field in article
    payload = json.dumps(
        {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "step4_data",
            "document": "step4_data",
            "team_member_ID": "1163",
            "function_ID": "ABCDE",
            "command": "update",
            "field":
            {
                '_id': pk
            },
            "update_field":
            {
                "status": 'posted',
                "date": date,
                "time": str(time),
            },

            "platform": "bangalore"
        })
    headers = {'Content-Type': 'application/json'}
    response = requests.request(
        "POST", url, headers=headers, data=payload)
    return ('most_recent')


def update_schedule(pk):
    url = "http://uxlivinglab.pythonanywhere.com"
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')

    # adding eddited field in article
    payload = json.dumps(
        {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "step4_data",
            "document": "step4_data",
            "team_member_ID": "1163",
            "function_ID": "ABCDE",
            "command": "update",
            "field":
            {
                '_id': pk
            },
            "update_field":
            {
                "status": 'scheduled',
                "date": date,
                "time": str(time),
            },
            "platform": "bangalore"
        })
    headers = {'Content-Type': 'application/json'}
    response = requests.request(
        "POST", url, headers=headers, data=payload)
    return ('scheduled')


def get_key(user_id):
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "ayrshare_info",
        "document": "ayrshare_info",
        "team_member_ID": "100007001",
        "function_ID": "ABCDE",
        "command": "fetch",
        "field": {"user_id": user_id},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    post = json.loads(response.json())
    for article in post['data']:
        key = article['profileKey']
    return key


def api_call(postes, platforms, key, image, request, post_id):

    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

    r1 = requests.post('https://app.ayrshare.com/api/post',
                       json=payload,
                       headers=headers)
    print(r1.json())
    if r1.json()['status'] == 'error':
        messages.error(request, 'error in posting')
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update = update_most_recent(post_id)

    else:
        for warnings in r1.json()['warnings']:
            messages.error(request, warnings['message'])


def api_call_schedule(postes, platforms, key, image, request, post_id, formart):

    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               'scheduleDate': str(formart),
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

    r1 = requests.post('https://app.ayrshare.com/api/post',
                       json=payload,
                       headers=headers)
    print(r1.json())
    if r1.json()['status'] == 'error':
        for error in r1.json()['posts']:
            for message in error['errors']:
                messages.error(request, message['message'][:62])
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update = update_schedule(post_id)

    else:
        for warnings in r1.json()['warnings']:
            messages.error(request, warnings['message'])


@csrf_exempt
def Media_Post(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        # credit_handler = CreditHandler()
        # credit_response = credit_handler.check_if_user_has_enough_credits(
        #     sub_service_id=STEP_4_SUB_SERVICE_ID,
        #     request=request,
        # )

        # if not credit_response.get('success'):
        #     return JsonResponse('credit_error', safe=False)
        start_datetime = datetime.now()
        data = json.loads(request.body.decode("utf-8"))
        title = data['title']
        paragraph = data['paragraph']
        paragraph2 = paragraph[0:230]
        image = data['image']

        # Logo in its own paragraph
        logo = "Created and posted by #samanta #uxlivinglab"

        post_id = data['PK']

        # Splitting the content and logo into separate paragraphs
        postes_paragraph1 = f"{paragraph[0:2000]}."
        postes_paragraph2 = logo

        # Combining the paragraphs with a newline character
        postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"

        twitter_post_paragraph1 = paragraph2
        twitter_post_paragraph2 = logo

        twitter_post = f"{twitter_post_paragraph1}\n\n{twitter_post_paragraph2}."

        print(twitter_post)
        try:
            platforms = data['social']
            splited = data['special']
            print(platforms)
        except:
            pass
        user_id = request.session['user_id']
        key = get_key(user_id)
        if len(splited) == 0:
            arguments = (
                (postes, platforms, key, image, request, post_id),
            )
        if len(platforms) == 0:
            arguments = (
                (twitter_post, splited, key, image, request, post_id),
            )
            print(splited, twitter_post)
        else:
            arguments = (
                (postes, platforms, key, image, request, post_id),
                (twitter_post, splited, key, image, request, post_id)
            )
        "posting to Various social media"
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Using lambda, unpacks the tuple (*f) into api_call(*args)
            executor.map(lambda f: api_call(*f), arguments)
            end_datetime = datetime.now()
            time_taken = end_datetime - start_datetime
            print(f"Total time taken: {time_taken}")
        return JsonResponse('most_recent', safe=False)
    else:
        return JsonResponse('social_media_channels', safe=False)


@csrf_exempt
def Media_schedule(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        # credit_handler = CreditHandler()
        # credit_response = credit_handler.check_if_user_has_enough_credits(
        #     sub_service_id=STEP_4_SUB_SERVICE_ID,
        #     request=request,
        # )

        # if not credit_response.get('success'):
        #     return redirect(reverse('credit_error_view'))
        start_datetime = datetime.now()
        data = json.loads(request.body.decode("utf-8"))
        timezone = request.session['timezone']
        title = data['title']
        paragraph = data['paragraph']
        paragraph2 = paragraph[0:230]
        image = data['image']
        logo = "Created and posted by #samanta #uxlivinglab"
        post_id = data['PK']
        schedule = data['schedule']

        # Adding a period to the end of the content before "Created and posted by"
        postes_paragraph1 = f"{paragraph[0:2000]}."
        postes_paragraph2 = logo

        # Combining the paragraphs with a newline character
        postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"

        # Adding a period to the end of the content before "Created and posted by"
        twitter_post_paragraph1 = f"{paragraph2[0:235]}."
        twitter_post_paragraph2 = logo

        # Combining the paragraphs with a newline character
        twitter_post = f"{twitter_post_paragraph1}\n\n{twitter_post_paragraph2}"

        try:
            platforms = data['social']
            splited = data['special']
        except:
            pass
        print(splited)
        # Formatting time for utc
        formart = datetime.strptime(schedule, '%m/%d/%Y %H:%M:%S')
        current_time = pytz.timezone(timezone)
        localize = current_time.localize(formart)
        utc = pytz.timezone('UTC')
        shedulded = localize.astimezone(utc)
        string = str(shedulded)[:-6]
        formart = datetime.strptime(
            string, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"

        user_id = request.session['user_id']
        key = get_key(user_id)
        if len(splited) == 0:
            arguments = (
                (postes, platforms, key, image, request, post_id, formart),
            )
        if len(platforms) == 0:

            arguments = (
                (twitter_post, splited, key, image, request, post_id, formart),
            )
            print(arguments)
        else:
            arguments = (
                (postes, platforms, key, image, request, post_id, formart),
                (twitter_post, splited, key, image, request, post_id, formart)
            )
        "posting to Various social media"
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Using lambda, unpacks the tuple (*f) into api_call_schedule(*args)
            executor.map(lambda f: api_call_schedule(*f), arguments)
            end_datetime = datetime.now()
            time_taken = end_datetime - start_datetime
            print(f"Total time taken: {time_taken}")
        return JsonResponse('scheduled', safe=False)
    else:
        return JsonResponse('social_media_channels', safe=False)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class UnScheduledView(APIView):
    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            profile = request.session['operations_right']
            username = request.session['username']
            userid = request.session['user_id']
            update_aryshare(username, userid)
            return Response({'profile': profile})
        else:
            return Response({'detail': 'Unauthorized'}, status=401)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class UnScheduledJsonView(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"user_id": request.session['user_id']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }
            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)

            profile = request.session['operations_right']

            post = json.loads(response.json())
            # takes in user_id
            user = str(request.session['user_id'])

            # takes in the JSON data
            datas = post

            posts = post['data']

            post_data = []
            try:
                for row in posts:
                    if row['status'] == '':
                        data = {
                            'title': row['title'],
                            'paragraph': row['paragraph'],
                            'Date': row["date"],
                            'image': row['image'],
                            'source': row['source'],
                            'PK': row['_id'],
                            'time': row['time']
                        }
                        post_data.append(data)

                # Reverse the order of the posts list
                post_data = list(reversed(post_data))
                number_of_items_per_page = 5
                page = request.GET.get('page', 1)
                paginator = Paginator(post_data, number_of_items_per_page)
                try:
                    page_article = paginator.page(page)
                except PageNotAnInteger:
                    page_article = paginator.page(1)
                except EmptyPage:
                    page_article = paginator.page(paginator.num_pages)
            except:
                pass
            serializer = UnScheduledJsonSerializer({'response': page_article})

            response_data = {
                'Unscheduled_Posts': serializer.data,
                'page': page_article.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            }
            return Response(response_data)
        else:
            return Response({'response': []})


@csrf_exempt
@xframe_options_exempt
def post_scheduler(request):

    # url = "http://uxlivinglab.pythonanywhere.com"

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


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class ScheduledJsonView(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"user_id": request.session['user_id']},
                "update_field": {
                    "order_nos": 21
                },
                "platform": "bangalore"
            }
            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)
            posts = json.loads(response.json())
            user_id = str(request.session['user_id'])
            status = 'scheduled'
            post_data = []
            try:
                for row in posts['data']:
                    if user_id == str(row['user_id']):
                        try:
                            if status == row['status']:
                                data = {
                                    'title': row['title'],
                                    'paragraph': row['paragraph'],
                                    'image': row['image'],
                                    'pk': row['_id'],
                                    'source': row['source'],
                                    'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date(),
                                    'time': row['time']
                                }
                                post_data.append(data)

                        except:
                            pass
                post_data = list(reversed(post_data))
                number_of_items_per_page = 5
                page = request.GET.get('page', 1)
                paginator = Paginator(post_data, number_of_items_per_page)
                try:
                    page_article = paginator.page(page)
                except PageNotAnInteger:
                    page_article = paginator.page(1)
                except EmptyPage:
                    page_article = paginator.page(paginator.num_pages)
            except:
                pass
            serializer = ScheduledJsonSerializer({'response': page_article})

            response_data = {
                'Scheduled Posts': serializer.data,
                'page': page_article.number,
                'total_page': paginator.num_pages,
                'total_items': paginator.count,
            }
            return Response(response_data)
        else:
            return Response({'response': []})


'''step-4 Ends here'''

'''Comments section'''


@csrf_exempt
@xframe_options_exempt
def comments(request):
    if 'session_id' and 'username' in request.session:

        # fetching topics according to the user logged in
        url = "http://uxlivinglab.pythonanywhere.com"

        data = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "socialmedia",
            "document": "socialmedia",
            "team_member_ID": "345678977",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"user_id": request.session['user_id']},

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
        url = "http://uxlivinglab.pythonanywhere.com"

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

        response = requests.post(url, headers=headers, json=payload)
        # print(response.text)
        response = json.loads(response.text)
        hashtags = []
        for hashtag in response["data"]:
            if 'hashtag' in hashtag:
                hashtags.append(
                    {'hashtag': hashtag['hashtag'], 'group_no': hashtag['group_no']})
        print(hashtags)
        return render(request, 'comments.html', {'topics': topics['data'], 'hashtags': hashtags})
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def generate_comments(request):

    print("-------------------------generate comments function------------------------------")
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("main-view"))
        else:
            Dowellhandler = request.POST.get("Dowellhandler")
            Product = request.POST.get("Product")
            Hashtag = request.POST.get("Hashtag")
            Topic = request.POST.get("Topic")

            print(
                f" Dowellhandler : {Dowellhandler} Product : {Product} Hashtag :{Hashtag}  Topic : {Topic} ")

            Hashtag = Hashtag.replace('#', '')
            hashtag_split = Hashtag.split()

            Hashtag = hashtag_split[0]
            Hashtag_group = hashtag_split[1]

            url = "http://uxlivinglab.pythonanywhere.com"

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

            # print(Dowellhandler, topics['data']['target_product'], Hashtag, Topic)
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
                print(requests.request("GET", url,
                      headers=headers, params=querystring))
                return [requests.request("GET", url, headers=headers, params=querystring).json()['sentence'],
                        type_of_sentence]

            data_dictionary = {}
            data_dictionary['Topic_id'] = request.POST.get("Product")
            data_dictionary['Dowellhandler'] = Dowellhandler
            data_dictionary['Product'] = topics['data']['target_product']
            data_dictionary['Hashtag'] = Hashtag
            data_dictionary['Topic'] = Topic
            data_dictionary["session_id"] = request.session['session_id']
            data_dictionary["Hashtag_group"] = Hashtag_group
            # data_dictionary.pop('csrfmiddlewaretoken')
            request.session['data_dictionary'] = data_dictionary
            sentence_grammar = Sentences.objects.create(object=Dowellhandler,
                                                        subject=topics['data']['target_product'],
                                                        verb=Hashtag,
                                                        subject_determinant=Topic,
                                                        )
            tenses = ['past', 'present', 'future']
            other_grammar = ['passive', 'progressive', 'perfect', 'negated']
            results = []
            result_ids = []
            counter = 0
            for tense in tenses:
                for grammar in other_grammar:
                    counter += 1
                    sentence_results = SentenceResults(
                        sentence_grammar=sentence_grammar)
                    arguments = {'tense': tense, grammar: grammar}
                    api_result = api_call(arguments)
                    sentence_results.sentence = api_result[0]
                    sentence_results.sentence_type = api_result[1]
                    sentence_results.save()
                    results.append(sentence_results)
                    result_ids.append(sentence_results.pk)
                    request.session['data_dictionary'] = {
                        **request.session['data_dictionary'], **{"api_sentence_{}".format(counter): {

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

            # using dummy text
            text = "Why%20robots%20may%20soon%20steal%20all%20manufacturing%20jobs%20%E2%80%93%20but%20it%E2%80%99s%20not%20all%20bad%20news"
            final_url = f'{emoji_url}{text}&client_id=a3740ebc104bf4fea425f64b8fca12babb5358d761b4'
            payload = {}
            headers = {}

            emoji_response = requests.request(
                "GET", final_url, headers=headers, data=payload)
            emojis = json.loads(emoji_response.text)
            emojis = emojis["emojis"]

            counter = 1
            print("*************************************")
            for sentence_id in sentence_ids:
                sentence_result = SentenceResults.objects.get(pk=sentence_id)
                if sentence_result.sentence == selected_comment:
                    request.session['data_dictionary']['api_sentence_{}'.format(
                        counter)]['selected'] = True
                    # print(True)
                else:
                    request.session['data_dictionary']['api_sentence_{}'.format(
                        counter)]['selected'] = False
                    # print(False)
                counter += 1

            print(f"----------------{counter}----------------------------")
            data_dictionary = request.POST.dict()
            data_dictionary.pop('csrfmiddlewaretoken')
            request.session['data_dictionary'] = {
                **request.session['data_dictionary'], **data_dictionary}
            print("--------------------------------------------")
            save_comments(request.session['data_dictionary'])
            print(request.session['data_dictionary'])
            del request.session['data_dictionary']
            return render(request, 'comments_emojis.html', {'comment': selected_comment, 'emojis': emojis})
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


'''Comments section ends here'''

'''user settings starts here'''


class FacebookFormAPI(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")
        event_id = create_event()['event_id']

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "update",
            "field": {
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "facebook": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                    "event_id": event_id,
                },
            },
            "platform": "bangalore"
        }

        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            return Response({'message': 'Facebook details updated successfully'})
        else:
            return Response({'error': 'Failed to update Facebook details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")
        event_id = create_event()['event_id']

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "facebook": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                    "event_id": event_id,
                },
            },
            "platform": "bangalore"
        }

        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            return Response({'message': 'Facebook details updated successfully'})
        else:
            return Response({'error': 'Failed to update Facebook details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InstaFormAPI(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = json.dumps({
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "instagram": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Instagram details updated successfully.")
        print(page_id, page_link, page_password, posts_no)
        if response.status_code == 200:
            return Response({'message': 'Instagram details updated successfully'})
        else:
            return Response({'error': 'Failed to update Instagram details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")

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
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "instagram": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Instagram details updated successfully.")
        print(page_id, page_link, page_password, posts_no)
        if response.status_code == 200:
            return Response({'message': 'Instagram details updated successfully'})
        else:
            return Response({'error': 'Failed to update Instagram details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class XFormAPI(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = json.dumps({
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "twitter": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "X details updated successfully.")
        print('page_id:', page_id, 'page_link:', page_link,
              'page_password:', page_password, 'post_no:', posts_no)
        if response.status_code == 200:
            return Response({'message': 'X details updated successfully'})
        else:
            return Response({'error': 'Failed to update X details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")

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
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "twitter": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "X details updated successfully.")
        print('page_id:', page_id, 'page_link:', page_link,
              'page_password:', page_password, 'post_no:', posts_no)
        if response.status_code == 200:
            return Response({'message': 'X details updated successfully'})
        else:
            return Response({'error': 'Failed to update X details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LinkedInFormAPI(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")

        url = "http://uxlivinglab.pythonanywhere.com"

        payload = json.dumps({
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "linkedin": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "LinkedIn details updated successfully.")
        print(page_id, page_link, page_password, posts_no)
        if response.status_code == 200:
            return Response({'message': 'LinkedIn details updated successfully'})
        else:
            return Response({'error': 'Failed to update LinkedIn details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        page_id = request.data.get("page_id")
        page_link = request.data.get("page_link")
        page_password = request.data.get("page_password")
        posts_no = request.data.get("posts_no")

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
                "user_id": request.session['user_id'],
            },
            "update_field": {
                "linkedin": {
                    "page_id": page_id,
                    "page_link": page_link,
                    "password": page_password,
                    "posts_per_day": posts_no,
                },
            },
            "platform": "bangalore"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.post(url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "LinkedIn details updated successfully.")
        print(page_id, page_link, page_password, posts_no)
        if response.status_code == 200:
            return Response({'message': 'LinkedIn details updated successfully'})
        else:
            return Response({'error': 'Failed to update LinkedIn details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class YoutubeFormView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            page_id = request.data.get("page_id")
            page_link = request.data.get("page_link")
            page_password = request.data.get("page_password")
            posts_no = request.data.get("posts_no")

            url = "http://uxlivinglab.pythonanywhere.com"

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "insert",
                "field": {
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "youtube": {
                        "page_id": page_id,
                        "page_link": page_link,
                        "password": page_password,
                        "posts_per_day": posts_no,
                    },
                },
                "platform": "bangalore"
            }

            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.post(url, headers=headers, json=payload)
            print(response.text)
            messages.success(request, "Youtube details updated successfully.")
            print(page_id, page_link, page_password, posts_no)
            if response.status_code == 200:
                return Response({'message': 'Youtube details updated successfully'})
            else:
                return Response({'error': 'Failed to update Youtube details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            page_id = request.data.get("page_id")
            page_link = request.data.get("page_link")
            page_password = request.data.get("page_password")
            posts_no = request.data.get("posts_no")

            url = "http://uxlivinglab.pythonanywhere.com"

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "update",
                "field": {
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "youtube": {
                        "page_id": page_id,
                        "page_link": page_link,
                        "password": page_password,
                        "posts_per_day": posts_no,
                    },
                },
                "platform": "bangalore"
            }

            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.post(url, headers=headers, json=payload)
            print(response.text)
            messages.success(request, "Youtube details updated successfully.")
            print(page_id, page_link, page_password, posts_no)
            if response.status_code == 200:
                return Response({'message': 'Youtube details updated successfully'})
            else:
                return Response({'error': 'Failed to update Youtube details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PinterestFormView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            page_id = request.data.get("page_id")
            page_link = request.data.get("page_link")
            page_password = request.data.get("page_password")
            posts_no = request.data.get("posts_no")

            url = "http://uxlivinglab.pythonanywhere.com"

            payload = json.dumps({
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "insert",
                "field": {
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "pinterest": {
                        "page_id": page_id,
                        "page_link": page_link,
                        "password": page_password,
                        "posts_per_day": posts_no,
                    },
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request(
                "POST", url, headers=headers, data=payload)
            print(response.text)
            messages.success(
                request, "Pinterest details updated successfully.")
            print(page_id, page_link, page_password, posts_no)
            if response.status_code == 200:
                return Response({'message': 'Pinterest details updated successfully'})
            else:
                return Response({'error': 'Failed to update Pinterest details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            page_id = request.data.get("page_id")
            page_link = request.data.get("page_link")
            page_password = request.data.get("page_password")
            posts_no = request.data.get("posts_no")

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
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "pinterest": {
                        "page_id": page_id,
                        "page_link": page_link,
                        "password": page_password,
                        "posts_per_day": posts_no,
                    },
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request(
                "POST", url, headers=headers, data=payload)
            print(response.text)
            messages.success(
                request, "Pinterest details updated successfully.")
            print(page_id, page_link, page_password, posts_no)
            if response.status_code == 200:
                return Response({'message': 'Pinterest details updated successfully'})
            else:
                return Response({'error': 'Failed to update Pinterest details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClientProfileFormView(APIView):
    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            context_dict = {'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data
            address = data.get("address")
            business = data.get("business")
            product = data.get("product")
            logo = data.get("logo")
            url = "http://uxlivinglab.pythonanywhere.com"

            payload = json.dumps({
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "insert",
                "field": {
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "profile": {
                        "address": address,
                        "business": business,
                        "products": product,
                        "logo": logo
                    },
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request(
                "POST", url, headers=headers, data=payload)
            print(address, business, product)
            if response.status_code == 200:
                return Response({'message': 'Client details updated successfully'})
            else:
                return Response({'error': 'Failed to update Client details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "PUT":
            return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data
            address = data.get("address")
            business = data.get("business")
            product = data.get("product")
            logo = data.get("logo")
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
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "profile": {
                        "address": address,
                        "business": business,
                        "products": product,
                        "logo": logo
                    },
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request(
                "POST", url, headers=headers, data=payload)
            print(address, business, product)
            if response.status_code == 200:
                return Response({'message': 'Client details updated successfully'})
            else:
                return Response({'error': 'Failed to update Client details'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TargetedCitiesListView(APIView):
    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            url = 'http://100074.pythonanywhere.com/regions/johnDoe123/haikalsb1234/100074/'

            cities = []
            try:
                response = requests.get(url=url)
                cities = response.json()
                serialized_cities = CitySerializer(cities, many=True).data
            except Exception as e:
                print('An error occurred:', str(e))
                return Response('An error occurred:', str(e))

            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'

            context_dict = {'cities': serialized_cities, 'status': status}
            return Response(context_dict)
        else:
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class TargetedCitiesCreateView(APIView):
    def post(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "POST":
            return Response({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Receive selected cities from the form
            target_cities = request.data.getlist('target_cities[]')

            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            url = "http://uxlivinglab.pythonanywhere.com"

            payload = json.dumps({
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "insert",
                "field": {
                    "user_id": request.session['user_id'],
                    "session_id": session_id,
                    "eventId": event_id,
                    'client_admin_id': request.session['userinfo']['client_admin_id'],
                    "date": date,
                    "time": str(time),
                    "target_city": target_cities,
                },
                "update_field": {
                    "target_city": target_cities,
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.post(url, headers=headers, data=payload)

            user_data = fetch_user_info(request)
            messages.success(
                request, "target_cities details inserted successfully.")
            return Response({'detail': 'Targeted cities created successfully'}, status=status.HTTP_201_CREATED)


class TargetedCitiesUpdateView(APIView):
    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "PUT":
            return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Receive selected cities from the form
            target_cities = request.data.getlist('target_cities[]')
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
                    "user_id": request.session['user_id'],
                },
                "update_field": {
                    "target_city": target_cities,
                },
                "platform": "bangalore"
            })
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.put(url, headers=headers, data=payload)

            user_data = fetch_user_info(request)
            messages.success(
                request, "target_cities details updated successfully.")
            return Response({'detail': 'Targeted cities updated successfully'}, status=status.HTTP_200_OK)


class HashMentionView(APIView):
    def get(self, request):
        session_id = request.GET.get("session_id", None)
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
            print(user_data)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            return Response({'status': status})

    def post(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "POST":
            return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            hashtag_list = request.data.get('hashtags_list').split(',')
            mentions_list = request.data.get('mentions_list').split(',')

            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "insert",
                "field": {
                    "user_id": request.session['user_id'],
                    "session_id": session_id,
                    "eventId": event_id,
                    'client_admin_id': request.session['userinfo']['client_admin_id'],
                    "date": date,
                    "time": str(time),
                    "mentions_list": mentions_list,
                    "hashtag_list": hashtag_list,
                },
                "update_field": {
                    "mentions_list": mentions_list,
                    "hashtag_list": hashtag_list,
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=data)

            return Response({'detail': 'Hashtags and Mentions created successfully'}, status=status.HTTP_201_CREATED)


class HashMentionUpdateView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "PUT":
                return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                hashtag_list = request.data.get('hashtags_list')
                print("Here we have", hashtag_list)
                mentions_list = request.data.get('mentions_list')
                print("Here we have", mentions_list)
                url = "http://uxlivinglab.pythonanywhere.com/"
                headers = {'content-type': 'application/json'}

                payload = {
                    "cluster": "socialmedia",
                    "database": "socialmedia",
                    "collection": "user_info",
                    "document": "user_info",
                    "team_member_ID": "1071",
                    "function_ID": "ABCDE",
                    "command": "update",
                    "field": {
                        "user_id": request.session['user_id'],
                    },
                    "update_field": {
                        "mentions_list": mentions_list,
                        "hashtag_list": hashtag_list,
                    },
                    "platform": "bangalore"
                }

                data = json.dumps(payload)
                response = requests.post(url, headers=headers, data=data)
                print(response)
                user_data = fetch_user_info(request)
                print(user_data)
                return Response({'detail': 'Hashtags and Mentions updated successfully'}, status=status.HTTP_200_OK)


class UserApprovalView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def get(self, request):
        session_id = request.GET.get("session_id", None)
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
            "field": {"user_id": request.session['user_id']},
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }

        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)

        print(response)
        response_data_json = json.loads(response.json())
        print("Here we have data from this page", response_data_json)
        user_id = str(request.session['user_id'])
        if len(response_data_json['data']) == 0:
            status = 'insert'
        else:
            status = 'update'

        return Response({'status': status})

    def post(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data  # Use request.data to access JSON data
            topic = data.get("topic")
            article = data.get("article")
            post = data.get("post")
            schedule = data.get("schedule")
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']

            url = "http://uxlivinglab.pythonanywhere.com"

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "eventId": event_id,
                "command": "insert",

                "field": {
                    "user_id": request.session['user_id'],
                    "topic": topic,
                    "post": post,
                    "article": article,
                    "schedule": schedule,
                    "session_id": session_id,
                    "eventId": event_id,
                    'client_admin_id': request.session['userinfo']['client_admin_id'],
                    "date": date,
                    "time": str(time),
                },
                "update_field": {
                    "approvals": {
                        "topic": topic,
                        "post": post,
                        "article": article,
                        "schedule": schedule,
                    },
                },
                "platform": "bangalore"
            }
            headers = {
                'Content-Type': 'application/json'
            }

            # Use the json parameter to send JSON data
            response = requests.post(url, headers=headers, json=payload)
            print(response.text)
            messages.success(request, "Details updated successfully.")

            return Response({
                'topic': topic,
                'article': article,
                'post': post,
                'schedule': schedule
            }, status=status.HTTP_200_OK)

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data  # Use request.data to access JSON data
            topic = data.get("topic")
            print("I got", topic)
            article = data.get("article")
            post = data.get("post")
            schedule = data.get("schedule")
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            user_id = '62e7aea0eda55a0cd5e839fc'

            url = "http://uxlivinglab.pythonanywhere.com"

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "user_info",
                "document": "user_info",
                "team_member_ID": "1071",
                "function_ID": "ABCDE",
                "command": "update",
                "field": {
                    'user_id': request.session['user_id']
                },
                "update_field": {
                    "topic": topic,
                    "post": post,
                    "article": article,
                    "schedule": schedule,
                },
                "platform": "bangalore"
            }
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.put(url, headers=headers, data=payload)
            print(response.text)
            messages.success(request, "Approvals updated successfully.")
            return Response({
                'topic': topic,
                'article': article,
                'post': post,
                'schedule': schedule
            }, status=status.HTTP_200_OK)


'''user settings ends here'''


@csrf_exempt
@xframe_options_exempt
def topics(request):
    return render(request, 'topics.html')

# Added view function for address page


def address(request):
    return render(request, 'address.html')


@login_required(login_url='/admin/login/')
@user_passes_test(lambda u: u.is_superuser)
def User_Info_ListView(request):
    print("User Info")
    string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
    connection = MongoClient(string)
    db = connection['social-media-auto']
    collection = db['user_info']
    print(collection.find())
    user = []
    for doc in collection.find():
        print("Document")
        print(doc)
        user.append(doc)
    user.reverse()
    paginator = Paginator(user, 100)  # Show 100 files per page.
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'step2/user_info_list.html', {'page_obj': page_obj})


@login_required(login_url='/admin/login/')
@user_passes_test(lambda u: u.is_superuser)
def User_DetailView(request, id):
    string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
    connection = MongoClient(string)
    db = connection['social-media-auto']
    collection = db['user_info']
    user = collection.find_one({'_id': ObjectId(id)})
    return render(request, 'step2/user_info_detail.html', {'user': user})
