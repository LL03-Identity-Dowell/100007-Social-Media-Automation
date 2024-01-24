import concurrent.futures
import datetime
import json
import random
<<<<<<< HEAD
=======
import re
import time
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
import traceback
import urllib
import urllib.parse
from datetime import datetime
# image resizing
from io import BytesIO
<<<<<<< HEAD
from itertools import chain

# from website.views import get_client_approval
=======

>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
import openai
import pytz
import requests
import wikipediaapi
from PIL import Image
from django.contrib import messages
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.timezone import localdate, localtime
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from pexels_api import API
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
# rest(React endpoints)
from rest_framework.views import APIView

<<<<<<< HEAD
=======
from config_master import UPLOAD_IMAGE_ENDPOINT, SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
from create_article import settings
from create_article.views import AuthenticatedBaseView
from helpers import (download_and_upload_image,
                     save_data, create_event, fetch_user_info, save_comments, check_connected_accounts,
                     check_if_user_has_social_media_profile_in_aryshare, text_from_html,
                     update_aryshare, get_key, get_most_recent_posts, get_post_comments, save_profile_key_to_post,
                     get_post_by_id, post_comment_to_social_media, get_scheduled_posts, delete_post_comment,
                     encode_json_data)
from website.models import Sentences, SentenceResults
<<<<<<< HEAD
from .image_generator.prodia import ImageGenerator
from .serializers import (ProfileSerializer, CitySerializer, UnScheduledJsonSerializer,
                          ScheduledJsonSerializer, ListArticleSerializer, RankedTopicListSerializer,
                          MostRecentJsonSerializer, PostCommentSerializer, DeletePostCommentSerializer)
=======
from .forms import VerifyArticleForm
from .image_generator.prodia import ImageGenerator
from .models import Step2Manager

# helper functions
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

global PEXELS_API_KEY

PEXELS_API_KEY = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'


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


<<<<<<< HEAD
=======
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


def has_access(portfolio_info):

    if not portfolio_info:
        return False
    if portfolio_info[0].get('product') != PRODUCT_NAME:
        return False
    return True


def dowell_login(request):
    session_id = request.GET.get("session_id", None)
    if session_id:
        request.session["session_id"] = session_id
        return redirect("http://127.0.0.1:8000/main")
    else:
        # return redirect("https://100014.pythonanywhere.com/?redirect_url=https://www.socialmediaautomation.uxlivinglab.online")
        return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")


@csrf_exempt
@xframe_options_exempt
def main(request):
    if request.session.get("session_id"):
        user_map = {}
        redirect_to_living_lab = True
        url_1 = "https://100093.pythonanywhere.com/api/userinfo/"
        session_id = request.session["session_id"]
        response_1 = requests.post(url_1, data={"session_id": session_id})
        if response_1.status_code == 200 and "portfolio_info" in response_1.json():
            # First API response contains portfolio_info data
            profile_details = response_1.json()
            request.session['portfolio_info'] = profile_details['portfolio_info']
            print('This is the portfolio info  has data for you: ',
                  profile_details['portfolio_info'])
            print('This is the user the userID: ',
                  profile_details['userinfo']['userID'])
            user_map[profile_details['userinfo']['userID']
                     ] = profile_details['userinfo']['username']

            # if has_access(profile_details['portfolio_info']):

            #     messages.error(request,'You are not allowed to access this page')
            #     return render(request, 'portofolio-logib.html')
        else:
            url_2 = "https://100014.pythonanywhere.com/api/userinfo/"
            response_2 = requests.post(
                url_2, data={"session_id": session_id})
            if response_2.status_code == 200 and "portfolio_info" in response_2.json():
                profile_details = response_2.json()
                request.session['portfolio_info'] = profile_details['portfolio_info']
                print(profile_details['portfolio_info'])
                user_map[profile_details['userinfo']['userID']
                         ] = profile_details['userinfo']['username']
                # if has_access(profile_details['portfolio_info']):
                #     messages.error(request,'You are not allowed to access this page')
                #     return render(request, 'portofolio-logib.html')
            else:
                # Neither API returned portfolio_info data
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

        # Map the username with the userID
        username = user_map.get(request.session['user_id'], None)

        if request.session.get('username') == SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME:
            request.session['can_approve_social_media'] = True

        # Adding session id to the session
        request.session['session_id'] = session_id
        if username:
            username_with_userID = request.session['username'] = username
        if not has_access(request.session['portfolio_info']):
            return render(request, 'portofolio-logib.html')
        # credit_handler = CreditHandler()
        # credit_handler.login(request)

        return render(request, 'main.html')
    else:
        # return redirect("https://100014.pythonanywhere.com/?redirect_url=https://www.socialmediaautomation.uxlivinglab.online")
        return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")

    return render(request, 'error.html')


def forget_password(request):
    return render(request, 'main.html')


>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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


class LogoutUser(APIView):
    def get(self, request):
        session_id = request.session.get("session_id")
        if session_id:
            try:
                del request.session["session_id"]
                return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=http://127.0.0.1:8000/")
            except:
                return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=http://127.0.0.1:8000/")
        else:
            return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=http://127.0.0.1:8000/")


@method_decorator(csrf_exempt, name='dispatch')
class MainAPIView(AuthenticatedBaseView):
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


class ListArticleView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            org_id = request.session['org_id']

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step2_data",
                "document": "step2_data",
                "team_member_ID": "9992828281",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"org_id": org_id},
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
                if org_id == org_id:
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


class ArticleDetailView(AuthenticatedBaseView):
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


class IndexView(AuthenticatedBaseView):
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
                "field": {"org_id": request.session['org_id']},
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
                        if org_id in user_org_id_list:

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

            return Response({
                'topics': serialized_data,
                'profile': profile,
                'page': topics.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            })

        else:
            return Response({"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)


class GenerateArticleView(AuthenticatedBaseView):
    def post(self, request):
        start_datetime = datetime.now()
        session_id = request.GET.get('session_id', None)

        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                org_id = request.session.get('org_id')
                RESEARCH_QUERY = request.data.get("title")
                user_selected_cities = []
                hashtags = []
                user_tags_mentions = []
                user_data = fetch_user_info(request)

                for item in user_data["data"]:
                    if "target_city" in item and item["target_city"] is not None:
                        user_selected_cities.extend(item["target_city"])

                    if "hashtag_list" in item and item["hashtag_list"] is not None:
                        hashtags.extend(item["hashtag_list"])

                    if "mentions_list" in item and item["mentions_list"] is not None:
                        user_tags_mentions.extend(item["mentions_list"])

                formatted_hashtags = " ".join(hashtags) if hashtags else ""
                formatted_mentions = " ".join(
                    f"@{mention}" for mention in user_tags_mentions) if user_tags_mentions else ""
                formatted_cities = " ".join(
                    f"#{city}" for city in user_selected_cities) if user_selected_cities else ""

                # Set your OpenAI API key here
                openai.api_key = settings.OPENAI_KEY

                # Build prompt
                prompt_limit = 2000
                min_characters = 500

                # Modify the prompt to include the formatted user data
                prompt = (
                    f"Write an article about {RESEARCH_QUERY}"
                    f" Include  {formatted_hashtags} at the end of the article."
                    f" Also, append {formatted_cities} to the end of the article."
                    f" Ensure that the generated content is a minimum of {min_characters} characters in length."
                    [:prompt_limit]
                    + "..."
                )
                # Generate article using OpenAI's GPT-3
                response = openai.Completion.create(
                    # engine="text-davinci-003",
                    engine="gpt-3.5-turbo-instruct",
                    prompt=prompt,
                    temperature=0.5,
                    max_tokens=1024,
                    n=1,
                    stop=None,
                    timeout=60,
                )
                article = response.choices[0].text
                paragraphs = [p.strip()
                              for p in article.split("\n\n") if p.strip()]
                article_str = "\n\n".join(paragraphs)

                sources = urllib.parse.unquote("")
                event_id = create_event()['event_id']
                user_id = request.session['user_id']
                client_admin_id = request.session['userinfo']['client_admin_id']
                # approval = get_client_approval(user_id)
                hashtags_in_last_paragraph = set(
                    word.lower() for word in paragraphs[-1].split() if word.startswith('#'))
                for i in range(len(paragraphs) - 1):
                    paragraphs[i] += " " + " ".join(hashtags_in_last_paragraph)

                for i in range(len(paragraphs)):
                    if paragraphs[i] != "":
                        step3_data = {
                            "user_id": user_id,
                            "org_id": org_id,
                            "session_id": session_id,
                            "eventId": event_id,
                            'client_admin_id': client_admin_id,
                            "title": RESEARCH_QUERY,
                            "source": sources,
                            "paragraph": paragraphs[i],
                            "citation_and_url": sources,

                        }
                        save_data('step3_data', 'step3_data',
                                  step3_data, '34567897799')
                step2_data = {
                    "user_id": user_id,
                    "session_id": session_id,
                    "org_id": org_id,
                    "eventId": event_id,
                    'client_admin_id': client_admin_id,
                    "title": RESEARCH_QUERY,
                    "paragraph": article_str,
                    "source": sources,
                    "citation_and_url": sources,
                }
                save_data('step2_data', 'step2_data',
                          step2_data, '9992828281')
                end_datetime = datetime.now()
                time_taken = end_datetime - start_datetime
                print(f"Task started at: {start_datetime}")
                print(f"Task completed at: {end_datetime}")
                print(f"Total time taken: {time_taken}")

                return Response({"message": "Article saved successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)


class GenerateArticleWikiView(AuthenticatedBaseView):
    def post(self, request):
        session_id = request.GET.get('session_id', None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                title = request.data.get("title")
                org_id = request.session.get('org_id')
                wiki_language = wikipediaapi.Wikipedia(
                    language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
                page = wiki_language.page(title)
                if page.exists():
                    print("For Title: "+title+" Page exists.")
                    article = page.text
                    article = article.split("See also")
                    para_list = article[0].split("\n\n")
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                                   "session_id": session_id,
                                                                   "eventId": create_event()['event_id'],
                                                                   'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                                   "title": title,
                                                                   "org_id": org_id,
                                                                   "paragraph": article[0],
                                                                   "source": page.fullurl,
                                                                   # 'dowelltime': dowellclock
                                                                   }, "9992828281")
                            print("step-2 data saved")
                        break

                    para_list = article[0].split("\n\n")
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                   "session_id": session_id,
                                                                   "eventId": create_event()['event_id'],
                                                                   'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                                   "title": title,
                                                                   "org_id": org_id,
                                                                   "paragraph": para_list[i],
                                                                   "citation_and_url": page.fullurl,
                                                                   # 'dowelltime': dowellclock
                                                                   }, '34567897799')
                            print("step-3 data saved")
                        break
                    # credit_handler = CreditHandler()
                    # credit_handler.consume_step_2_credit(request)
                    return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)
                elif page.exists() == False:
                    return Response({'message': f"There were no results matching the query as the page '{title}' does not exist in Wikipedia"})
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class WriteYourselfView(AuthenticatedBaseView):

    def post(self, request):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            if request.method != "POST":
                return Response({'error': 'You have to choose a sentence first to write its article.'}, status=400)
            else:
                title = request.data.get("title")
                org_id = request.session.get('org_id')
                article_text_area = request.data.get("articletextarea")
                source = request.data.get("url")
                response_data = {
                    'title': title,
                    'articletextarea': article_text_area,
                    'url': source,
                }
                headers = {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
                try:
                    response = requests.get(source, headers=headers)
                except Exception as e:
                    print(str(e))
                    return Response({'error': 'The url of the article has not been authorized!', 'data': response_data}, status=status.HTTP_400_BAD_REQUEST)
                if response.status_code == 403:
                    return Response({'error': 'Error code 403 Forbidden: Website does not allow verification of the article!', 'data': response_data}, status=status.HTTP_403_FORBIDDEN)
                else:
                    text_from_page_space = text_from_html(response.text)
                    text_from_page = text_from_page_space.replace(" ", "")
                    text_from_page = text_from_page.replace("\xa0", "")
                    print(article_text_area)
                    paragraph = article_text_area.split("\r\n")
                    message = "Article Verified, "
                    for i in range(len(paragraph)):
                        if paragraph[i] == "":
                            continue
                        save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "org_id": org_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo'][
                            'client_admin_id'],
                            "title": title,
                            "paragraph": paragraph[i],
                            "article": article_text_area,
                            "source": source,
                            # 'dowelltime': dowellclock
                        }, '34567897799')
                        save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "org_id": org_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo'][
                            'client_admin_id'],
                            "title": title,
                            "paragraph": article_text_area,
                            "source": source,
                            # 'dowelltime': dowellclock
                        }, "9992828281")

                        # credit_handler = CreditHandler()
                        # credit_handler.consume_step_2_credit(request)
                        return Response({'message': 'Article saved successfully', 'data': response_data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''
step-2 Ends here
'''

'''
step-3 starts here
'''


class PostListView(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}
            org_id = request.session.get('org_id')

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step3_data",
                "document": "step3_data",
                "team_member_ID": "34567897799",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"org_id": org_id},
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

            posts = []
            unique_articles = set()

            for article in article_detail_list:
                if article.get('org_id') == org_id:
                    title = article.get('title')
                    paragraph = article.get('paragraph')
                    source = article.get('source')
                    article_content = article.get('article', ' ')
                    post_id = article.get('_id')

                    if article_content not in unique_articles:
                        unique_articles.add(article_content)
                        posts.append({
                            'post_id': post_id,
                            'title': title,
                            'paragraph': paragraph,
                            'source': source,
                            'article': article_content,
                        })
                    else:
                        posts.append({
                            'post_id': post_id,
                            'title': title,
                            'paragraph': paragraph,
                            'source': source,
                        })
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
            serialized_page_post = []

            for post in page_post_data:
                paragraph_post = {
                    'post_id': post['post_id'],
                    'title': post['title'],
                    'paragraphs': post['paragraph'],
                    'source': post['source'],
                }
                serialized_page_post.append(paragraph_post)

                if 'article' in post:
                    article_post = {
                        'post_id': post['post_id'],
                        'title': post['title'],
                        'article': post['article'],
                        'source': post['source'],
                    }
                    serialized_page_post.append(article_post)

            response_data = {
                'posts': serialized_page_post,
                'page': page_post.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            }

            return Response(response_data)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class PostDetailView(AuthenticatedBaseView):
    def post(self, request):
        if 'session_id' and 'username' in request.session:
            # credit_handler = CreditHandler()
            # credit_response = credit_handler.check_if_user_has_enough_credits(
            #     sub_service_id=STEP_3_SUB_SERVICE_ID,
            #     request=request,
            # )

            # if not credit_response.get('success'):
            #     return redirect(reverse('credit_error_view'))
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}
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
                source = data.get('source')

                if 'paragraph' in data:
                    paragraph = data.get('paragraph')
                    paragraph = paragraph.split('\r\n')

                    post = {
                        "_id": post_id,
                        "title": title,
                        "paragraph": paragraph,
                        # "source": source
                    }
                elif 'article' in data:
                    article = data.get("article")

                    post = {
                        "_id": post_id,
                        "title": title,
                        "article": article,
                        # "source": source
                    }
                else:
                    return Response({'error': 'Invalid data format'}, status=400)
            a = random.randint(1, 9)
            query = title
            output = []
            image_gen = ImageGenerator()
            image_details = image_gen.process(prompt=title)

            if image_details.get('imageUrl'):
                images = image_details.get('imageUrl')
            else:
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
                    return Response({'message': 'No images found please try again!'}, status=status.HTTP_404_NOT_FOUND)
                images = output[0]

            print(profile)
            username = request.session['username']
            linked_accounts = check_connected_accounts(username)
            targeted_category = []
            qualitative_categorization = []
            targeted_for = []
            user_data = fetch_user_info(request)
            for item in user_data["data"]:
                if "targeted_category" in item and item["targeted_category"] is not None:
                    targeted_category.extend(
                        item["targeted_category"])
                if "qualitative_categorization" in item and item["qualitative_categorization"] is not None:
                    qualitative_categorization.extend(
                        item["qualitative_categorization"])
                if "targeted_for" in item and item["targeted_for"] is not None:
                    targeted_for.extend(item["targeted_for"])
            targeted_category = " ".join(
                targeted_category) if targeted_category else ""
            qualitative_categorization = " ".join(
                qualitative_categorization) if qualitative_categorization else ""
            targeted_for = " ".join(targeted_for) if targeted_for else ""
            response_data = {'post': post, 'categories': categories, 'linked_accounts': linked_accounts,
                             'images': images, 'profile': profile, 'targeted_category': targeted_category,
                             'qualitative_categorization': qualitative_categorization,
                             'targeted_for': targeted_for,
                             "message": "You are limited to use only images from Samanta AI due to security and privacy policy"}
            return Response(response_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class SavePostView(AuthenticatedBaseView):
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

                url = "http://uxlivinglab.pythonanywhere.com"

                uploaded_image = download_and_upload_image(image_url=image)

                image = uploaded_image.get('file_url')

                org_id = request.session.get('org_id')

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
                        "org_id": org_id,
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
                # credit_handler = CreditHandler()
                # credit_handler.consume_step_3_credit(request)
                response_data = {
                    "message": "Post saved successfully",
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class EditPostView(AuthenticatedBaseView):
    def get(self, request, post_id, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            post_data = {
                "product_name": "Social Media Automation",
                "details": {
                    "_id": post_id,
                    "field": {"_id": post_id},
                    "title": "this is another title",
                    "database": "socialmedia",
                    "collection": "step3_data",
                    "team_member_ID": "34567897799",
                    "function_ID": "ABCDE",
                    "cluster": "socialmedia",
                    "document": "step3_data",
                    "command": "update",
                    "flag": "editing",
                    "name": "Edit Post",
                    "update_field": {
                        "order_nos": 21,

                    }
                }
            }
            token = encode_json_data(post_data)
            response_data = {
                'redirect_url': f'https://ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token={str(token)}'
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


'''step-3 Ends here'''

'''step-4 starts here'''


@method_decorator(csrf_exempt, name='dispatch')
class AryshareProfileView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
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
            return Response(data['message'], status=status.HTTP_400_BAD_REQUEST)
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

            response = requests.request(
                "POST", url, headers=headers, data=payload)
            print(response.text)
            print(data)
            return Response("Social media profile created")


@method_decorator(csrf_exempt, name='dispatch')
class LinkMediaChannelsView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        session_id = request.GET.get("session_id", None)
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}

<<<<<<< HEAD
        payload = {
=======
        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.json())
        messages.success(request, "Approvals updated successfully.")
    return HttpResponseRedirect(reverse("generate_article:client"))


def check_if_user_has_social_media_profile_in_aryshare(username):
    """
    This function checks if a user has a profile account in aryshare
    """
    headers = {
        'Content-Type': 'application/json',
        'Authorization': F"Bearer {str(settings.ARYSHARE_KEY)}"
    }
    response = requests.get(
        'https://app.ayrshare.com/api/profiles', headers=headers)
    profiles_data = response.json()
    if not isinstance(profiles_data.get('profiles'), list):
        return False
    for profile_data in profiles_data.get('profiles'):
        if username == profile_data.get('title'):
            return True
    return False


def check_connected_accounts(username):
    headers = {'Authorization': F"Bearer {str(settings.ARYSHARE_KEY)}"}
    r = requests.get('https://app.ayrshare.com/api/profiles', headers=headers)
    socials = ['hello']
    try:
        for name in r.json()['profiles']:
            if name['title'] == username:
                socials = name['activeSocialAccounts']
    except:
        pass
    return (socials)


def linked_account_json(request):
    username = request.session['username']
    linked_accounts = check_connected_accounts(username)

    return JsonResponse({'response': linked_accounts})


@csrf_exempt
@xframe_options_exempt
def social_media_channels(request):
    if request.method == "POST":
        step_2_manager = Step2Manager()
        username = request.session['username']
        email = request.session['userinfo']['email']
        name = f"{str(request.session['userinfo']['first_name'])} {str(request.session['userinfo']['last_name'])}"
        org_id = request.session['org_id']
        data = {
            'username': username,
            'email': email,
            'name': name,
            'org_id': org_id,
        }
        step_2_manager.create_social_media_request(data)
        messages.success(request,
                         'Social media request was saved successfully. Wait for the admin to accept the request')
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        step_2_manager = Step2Manager()
        username = request.session['username']
        session = request.session['session_id']
        print(session)
        user_has_social_media_profile = check_if_user_has_social_media_profile_in_aryshare(
            username)
        linked_accounts = check_connected_accounts(username)
        context_data = {'user_has_social_media_profile': user_has_social_media_profile,
                        'linked_accounts': linked_accounts}
        username = request.session['username']
        org_id = request.session['org_id']

    username = request.session['username']
    session = request.session['session_id']
    print(session)
    user_has_social_media_profile = check_if_user_has_social_media_profile_in_aryshare(
        username)
    linked_accounts = check_connected_accounts(username)
    context_data = {'user_has_social_media_profile': user_has_social_media_profile,
                    'linked_accounts': linked_accounts}
    messages.error(request, 'We will restore the connect button soon')
    return render(request, 'social_media_channels.html', context_data)


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

    org_id = request.session.get('org_id')

    if data['status'] == 'error':
        messages.error(request, data['message'])
    else:

        url = "http://uxlivinglab.pythonanywhere.com"
        test_date = str(localdate())

        payload = json.dumps({
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "ayrshare_info",
            "document": "ayrshare_info",
            "team_member_ID": "100007001",
            "function_ID": "ABCDE",
<<<<<<< HEAD
            "command": "fetch",
            "field": {"user_id": request.session['user_id']},
=======
            "command": "insert",
            "field": {
                "user_id": request.session['user_id'],
                "session_id": request.session['session_id'],
                "org_id": org_id,
                'title': data['title'],
                'refId': data['refId'],
                'profileKey': data['profileKey'],
                "eventId": event_id,

            },
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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
        with open(r'C:\Users\HP 250\Desktop\code\100007-Social-Media-Automation\dowellresearch.key') as f:
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


@method_decorator(csrf_exempt, name='dispatch')
class SocialMediaChannelsView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        username = request.session['username']
        user_has_social_media_profile = check_if_user_has_social_media_profile_in_aryshare(
            username)
        linked_accounts = check_connected_accounts(username)

        response_data = {
            'user_has_social_media_profile': user_has_social_media_profile,
            'linked_accounts': linked_accounts
        }

        return Response(response_data)


@method_decorator(csrf_exempt, name='dispatch')
class CanPostOnSocialMedia(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        """
        This function check of a user can post an article on social media sites
        """
        portfolio_info = request.session.get('portfolio_info')
        if not portfolio_info:
            return Response({'can_post': False})
        if not isinstance(portfolio_info, list):
            return Response({'can_post': False})
        portfolio_info = portfolio_info[0]
        if portfolio_info.get('member_type') == 'owner' and portfolio_info.get('username') == 'socialmedia':
            return Response({'can_post': True})
        elif portfolio_info.get('member_type') == 'member_type' and portfolio_info.get('username') == 'socialmedia':
            return Response({'can_post': True})
        return Response({'can_post': False})


@method_decorator(csrf_exempt, name='dispatch')
class LinkedAccountsJson(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        username = request.session['username']
        linked_accounts = check_connected_accounts(username)

        return Response({'response': linked_accounts})


@method_decorator(csrf_exempt, name='dispatch')
class MostRecentJSON(APIView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            org_id = request.session.get('org_id')

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"org_id": org_id},
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

            response_data = {
                'MostRecentPosts': [],
                'page': 1,
                'total_pages': 1,
                'total_items': 0,
            }

            try:
                for row in posts['data']:

                    if org_id == str(row['org_id']):
                        try:
                            if status == row['status']:
                                data = {
                                    'pk': row['_id'],
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
                    page_article = paginator.page(paginator.num_pages)
                serializer = MostRecentJsonSerializer(
                    {'response': page_article})

                response_data = {
                    'MostRecentPosts': serializer.data,
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

    owner_name = request.session['portfolio_info'][0]['owner_name']
    username = request.session.get('username')
    if owner_name != username:
        messages.error(request, 'You are permitted to perform this action!')
        messages.error(request, 'Only the owner of the organization can connect to social media channels')
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))

    org_id = request.session.get('org_id')

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "ayrshare_info",
        "document": "ayrshare_info",
        "team_member_ID": "100007001",
        "function_ID": "ABCDE",
        "command": "fetch",
<<<<<<< HEAD
        "field": {"user_id": user_id},
=======
        "field": {"org_id": org_id},
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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

<<<<<<< HEAD
=======
    for posts in post['data']:
        if posts['user_id'] == request.session['user_id']:
            key = posts['profileKey']
            print(key)
    with open(r'C:\Users\HP 250\Desktop\code\100007-Social-Media-Automation\dowellresearch.key') as f:
        privateKey = f.read()
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

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
    org_id = request.session.get('org_id')
    save_profile_key_to_post(
        profile_key=key,
        post_id=post_id,
        post_response=r1.json(),
        org_id=org_id,
    )
    if r1.json()['status'] == 'error':
        messages.error(request, 'error in posting')
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update_most_recent(post_id)

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
    org_id = request.session.get('org_id')
    save_profile_key_to_post(
        profile_key=key,
        post_id=post_id,
        post_response=r1.json(),
        org_id=org_id,
    )
    if r1.json()['status'] == 'error':
        for error in r1.json()['posts']:
            for message in error['errors']:
                messages.error(request, message['message'][:62])
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        messages.success(
            request, 'post have been successfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update_schedule(post_id)

    else:
        for warnings in r1.json()['warnings']:
            messages.error(request, warnings['message'])


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class MediaPostView(AuthenticatedBaseView):
    def post(self, request, *args, **kwargs):
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

<<<<<<< HEAD
            print(twitter_post)
=======
        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Twitter details updated successfully.")
        print('page_id:', page_id, 'page_link:', page_link,
              'page_password:', page_password, 'post_no:', posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def linkedin(request):
    return render(request, 'linkedin.html')


@csrf_exempt
@xframe_options_exempt
def linkedin_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
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

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Linkedin details updated successfully.")
        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def youtube(request):
    return render(request, 'youtube.html')


@csrf_exempt
@xframe_options_exempt
def youtube_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
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
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Youtube details updated successfully.")
        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def Pinterest(request):
    return render(request, 'pinterest.html')


@csrf_exempt
@xframe_options_exempt
def pinterest_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
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

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        messages.success(request, "Pinterest details updated successfully.")
        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def client_profile(request):
    return render(request, 'dowell/clients_profile.html')


@csrf_exempt
@xframe_options_exempt
def client_profile_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:client"))
    else:
        address = request.POST.get("address")
        business = request.POST.get("business")
        product = request.POST.get("product")
        logo = request.FILES.get("logo")

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
                    "logo": None
                },
            },
            "platform": "bangalore"
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
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


@csrf_exempt
@xframe_options_exempt
def user_plan(request):
    return render(request, 'user_plan.html')


def targeted_cities(request):
    if 'session_id' in request.session and 'username' in request.session:
        if request.method == "GET":
            url = 'http://100074.pythonanywhere.com/regions/johnDoe123/haikalsb1234/100074/'

            cities = []
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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
<<<<<<< HEAD
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
            return Response('most_recent')
=======
                status = 'update'

            context_dict = {'cities': cities, 'status': status}
            return render(request, 'dowell/target_cities.html', context_dict)
    return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def save_targeted_cities(request):
    session_id = request.GET.get("session_id", None)
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:target_cities"))
    else:
        # Receive selected cities from the form
        # target_city = request.POST.get("target_cities") #for sigle cities
        # print(target_city)
        # for multiple cities, can also work for one
        target_cities = request.POST.getlist('target_cities[]')
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

        response = requests.request("POST", url, headers=headers, data=payload)
        user_data = fetch_user_info(request)
        print(user_data)
        messages.success(
            request, "target_cities details inserted successfully.")

        return HttpResponseRedirect(reverse("generate_article:main-view"))


@csrf_exempt
@xframe_options_exempt
def update_saved_targeted_cities(request):
    session_id = request.GET.get("session_id", None)
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:target_cities"))
    else:
        # Receive selected cities from the form
        # target_city = request.POST.get("target_cities") #for sigle cities
        # print(target_city)
        # for multiple cities, can also work for one
        target_cities = request.POST.getlist('target_cities[]')
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

        response = requests.request("POST", url, headers=headers, data=payload)
        user_data = fetch_user_info(request)
        print(user_data)
        messages.success(
            request, "target_cities details updated successfully.")

        return HttpResponseRedirect(reverse("generate_article:main-view"))


@csrf_exempt
@xframe_options_exempt
def post_detail_dropdowns(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method == "GET":
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            status = 'update'
            return render(request, 'post_detail_dropdowns.html', {'status': status})
        elif request.method == "POST":

            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            qualitative_categorization = request.POST.get(
                'qualitative_categorization_list').split(',')
            targeted = request.POST.get('targeted_list').split(',')
            designed_for = request.POST.get('designed_for_list').split(',')
            targeted_category = request.POST.get(
                'targeted_category_list').split(',')

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
                    "qualitative_categorization": qualitative_categorization,
                    "targeted": targeted,
                    "designed_for": designed_for,
                    "targeted_category": targeted_category,

                },
                "update_field": {
                    "qualitative_categorization": qualitative_categorization,
                    "targeted": targeted,
                    "designed_for": designed_for,
                    "targeted_category": targeted_category,
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)
            print(response)

            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def update_post_detail_dropdowns(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:client"))
        else:
            qualitative_categorization = request.POST.get(
                'qualitative_categorization_list').split(',')
            print(qualitative_categorization)
            targeted = request.POST.get('targeted_list').split(',')
            designed_for = request.POST.get('designed_for_list').split(',')
            targeted_category = request.POST.get(
                'targeted_category_list').split(',')

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
                    "qualitative_categorization": qualitative_categorization,
                    "targeted": targeted,
                    "designed_for": designed_for,
                    "targeted_category": targeted_category,
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.request(
                "POST", url, headers=headers, data=data)
            print(response)
            messages.success(
                request, "Data updated successfully.")
            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def hash_mention(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method == "GET":
            user_data = fetch_user_info(request)
            if len(user_data['data']) == 0:
                status = 'insert'
            else:
                status = 'update'
            return render(request, 'hash_mention.html', {'status': status})
        elif request.method == "POST":

            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            hashtag_list = request.POST.get('hashtags_list').split(',')
            mentions_list = request.POST.get('mentions_list').split(',')

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
            response = requests.request(
                "POST", url, headers=headers, data=data)
            print(response)

            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def update_hash_mention(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:client"))
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
        else:
            return Response('social_media_channels')


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class MediaScheduleView(AuthenticatedBaseView):
    def post(self, request, *args, **kwargs):
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
            return Response('scheduled')
        else:
            return Response('social_media_channels')


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class UnScheduledView(AuthenticatedBaseView):
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
class UnScheduledJsonView(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            org_id = request.session.get('org_id')

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"org_id": org_id},
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


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class ScheduledJsonView(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            url = "http://uxlivinglab.pythonanywhere.com/"
            headers = {'content-type': 'application/json'}

            org_id = request.session.get('org_id')

            payload = {
                "cluster": "socialmedia",
                "database": "socialmedia",
                "collection": "step4_data",
                "document": "step4_data",
                "team_member_ID": "1163",
                "function_ID": "ABCDE",
                "command": "fetch",
                "field": {"org_id": org_id},
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
                    if org_id == str(row['org_id']):
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


@method_decorator(csrf_exempt, name='dispatch')
class CreatePostComments(AuthenticatedBaseView):

    def post(self, request, post_id):
        if 'session_id' and 'username' in request.session:
            serializer_data = PostCommentSerializer(data=request.data)
            if not serializer_data.is_valid():
                return Response(serializer_data.errors, status=HTTP_400_BAD_REQUEST)
            user_id = request.session.get('user_id')
            post_data = get_post_by_id(post_id=post_id, user_id=user_id)
            user_id = request.session['user_id']
            profile_key = get_key(user_id)

            if not post_data or not post_data.get('post_response'):
                return Response({'message': 'The post does not have aryshare ID'}, status=HTTP_400_BAD_REQUEST)
            platforms = list(serializer_data.validated_data.get('platforms'))
            comment = serializer_data.validated_data.get('comment')
            aryshare_post_id = post_data.get(
                'post_response').get('posts')[0].get('id')
            response = post_comment_to_social_media(
                platforms=platforms,
                id=aryshare_post_id,
                comment=comment,
                profile_key=profile_key
            )
            return Response(response)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class Comments(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            user_id = request.session['user_id']
            recent_posts = get_most_recent_posts(user_id=user_id)
            scheduled_post = get_scheduled_posts(user_id=user_id)
            all_posts = list(chain(recent_posts, scheduled_post))
            number_of_items_per_page = 5
            page = request.GET.get('page', 1)
            paginator = Paginator(all_posts, number_of_items_per_page)

            try:
                comments_page = paginator.page(page)
            except PageNotAnInteger:
                comments_page = paginator.page(1)
            except EmptyPage:
                comments_page = paginator.page(paginator.num_pages)

            paginated_posts = comments_page.object_list

            response_data = {
                'paginated_posts': paginated_posts,
                'page': comments_page.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
            }

            return Response(response_data)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class PostComments(AuthenticatedBaseView):
    def get(self, request, post_id):
        if 'session_id' and 'username' in request.session:
            user_id = request.session.get('user_id')
            post_data = get_post_by_id(post_id=post_id, user_id=user_id)
            user_id = request.session['user_id']
            profile_key = get_key(user_id)

            if not post_data or not post_data.get('post_response'):
                return Response({'message': 'The post does not have aryshare ID'}, status=HTTP_400_BAD_REQUEST)
            aryshare_post_id = post_data.get(
                'post_response').get('posts')[0].get('id')
            comments = get_post_comments(
                post_id=aryshare_post_id, profile_key=profile_key)

            return Response(comments)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class DeletePostComment(AuthenticatedBaseView):
    def post(self, request, post_id):
        if 'session_id' and 'username' in request.session:
            serializer_data = DeletePostCommentSerializer(data=request.data)
            if not serializer_data.is_valid():
                return Response(serializer_data.errors, status=HTTP_400_BAD_REQUEST)
            user_id = request.session.get('user_id')
            post_data = get_post_by_id(post_id=post_id, user_id=user_id)
            user_id = request.session['user_id']
            profile_key = get_key(user_id)
            platform = serializer_data.validated_data.get('platform')
            response = delete_post_comment(
                comment_id=serializer_data.validated_data.get('comment_id'),
                profile_key=profile_key,
                platform=platform,
            )

            return Response(response)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


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


<<<<<<< HEAD
class FacebookFormAPI(AuthenticatedBaseView):
=======
def update_aryshare(username, org_id):
    headers = {'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}
    r = requests.get('https://app.ayrshare.com/api/profiles', headers=headers)
    socials = ['No account linked']
    for name in r.json()['profiles']:
        try:
            if name['title'] == username:
                socials = name['activeSocialAccounts']
                url = "http://uxlivinglab.pythonanywhere.com"
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

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


class InstaFormAPI(AuthenticatedBaseView):

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


class XFormAPI(AuthenticatedBaseView):

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


class LinkedInFormAPI(AuthenticatedBaseView):

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


class YoutubeFormView(AuthenticatedBaseView):

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


class PinterestFormView(AuthenticatedBaseView):

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


class ClientProfileFormView(AuthenticatedBaseView):
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


class TargetedCitiesListView(AuthenticatedBaseView):
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


class TargetedCitiesCreateView(AuthenticatedBaseView):
    def post(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "POST":
            return Response({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Receive selected cities from the form
            # target_cities = request.data.getlist('target_cities[]')
            target_cities = request.data
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
            return Response({'detail': 'Targeted cities saved successfully'}, status=status.HTTP_201_CREATED)


class TargetedCitiesUpdateView(AuthenticatedBaseView):

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "PUT":
            return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Receive selected cities from the form
            # target_cities = request.data.getlist('target_cities[]')
            target_cities = request.data
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

            response = requests.post(url, headers=headers, data=payload)
            user_data = fetch_user_info(request)
            print(user_data)
            messages.success(
                request, "target_cities details updated successfully.")
            return Response({'detail': 'Targeted cities updated successfully'}, status=status.HTTP_200_OK)


class HashMentionView(AuthenticatedBaseView):
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


class HashMentionUpdateView(AuthenticatedBaseView):

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "PUT":
                return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                hashtag_list = request.data.get('hashtag_list')
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
<<<<<<< HEAD
                        "user_id": request.session['user_id'],
=======

                        'org_id': org_id
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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


<<<<<<< HEAD
class UserApprovalView(AuthenticatedBaseView):
=======
@csrf_exempt
@xframe_options_exempt
def unscheduled(request):
    if 'session_id' and 'username' in request.session:
        profile = request.session['operations_right']
        username = request.session['portfolio_info'][0]['owner_name']
        userid = request.session['user_id']
        org_id = request.session.get('org_id')

        update_aryshare(username, org_id)

        return render(request, 'unscheduled.html', {'profile': profile})
    else:
        return render(request, 'error.html')
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

    def get(self, request):
        session_id = request.GET.get("session_id", None)
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}
        org_id = request.session.get('org_id')
        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
<<<<<<< HEAD
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
=======
            "collection": "step4_data",
            "document": "step4_data",
            "team_member_ID": "1163",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }
        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)
        profile = request.session['operations_right']

        post = json.loads(response.json())
        # takes in user_id
        user = str(request.session['user_id'])

        # takes in the json data
        datas = post

        posts = post['data']


        post = []
        respond = []
        try:
            for row in posts:
                if row['status'] == '':
                    data = {'title': row['title'], 'paragraph': row['paragraph'], 'Date': row["date"],
                            'image': row['image'], 'source': row['source'], 'PK': row['_id'], 'time': row['time']}
                    post.append(data)
                    post = list(reversed(post))
                    respond = json.dumps(post)

        except Exception as e:
            print(str(e))
            pass
        # post = list(reversed(post))  # Reverse the order of the posts list

        # number_of_items_per_page = 5
        # page = request.GET.get('page', 1)

        # paginator = Paginator(post, number_of_items_per_page)
        # try:
        #     page_post = paginator.page(page)
        # except PageNotAnInteger:
        #     page_post = paginator.page(1)
        # except EmptyPage:
        #     page_post = paginator.page(paginator.num_pages)

        # messages.info(
        #     request, 'post/schedule articles.')
        return JsonResponse({'response': respond})
        # return render(request, 'unscheduled.html', {'post': post, 'profile': profile, 'page_post': page_post})
    else:
        return render(request, 'error.html')


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


@csrf_exempt
@xframe_options_exempt
def scheduled_json(request):
    if 'session_id' and 'username' in request.session:
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}
        org_id = request.session.get('org_id')
        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "step4_data",
            "document": "step4_data",
            "team_member_ID": "1163",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }
        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)
        posts = json.loads(response.json())
        user_id = str(request.session['user_id'])
        status = 'scheduled'
        post = []
        try:
            for row in posts['data']:
                if org_id == str(row['org_id']):
                    try:
                        if status == row['status']:
                            data = {'title': row['title'], 'paragraph': row['paragraph'], 'image': row['image'], 'pk': row['_id'],
                                    'source': row['source'], 'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date(), 'time': row['time']}
                            post.append(data)
                            post = list(reversed(post))

                    except:
                        pass
        except:
            pass
        return JsonResponse({'response': post})
    else:
        return render(request, 'error.html')


@xframe_options_exempt
def index(request):
    if 'session_id' and 'username' in request.session:
        # credit_handler = CreditHandler()
        # credit_response = credit_handler.check_if_user_has_enough_credits(
        #     sub_service_id=STEP_2_SUB_SERVICE_ID,
        #     request=request,
        # )
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}

        org_id = request.session['org_id']

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "socialmedia",
            "document": "socialmedia",
            "team_member_ID": "345678977",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id},
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }
        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)
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
                    if org_id in user_org_id_list:

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
                        topic = {
                            "ranks": data[key]['sentence_rank'],
                            "title": data[key]['sentence_result'],
                            "subject": data.get('subject'),
                            "key": key,
                            'created_by': data.get('username', 'NA'),
                        }
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

        return render(request, 'article/main.html', {'topics': topics, 'profile': profile, 'page': page})
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def generate_article_automatically(request):
    session_id = request.GET.get('session_id', None)
    if request.method != "POST":
        return HttpResponseRedirect(reverse("main-view"))
    else:
        title = request.POST.get("title")
        subject = request.POST.get("subject")
        verb = request.POST.get("verb")
        target_industry = request.POST.get("target_industry")
        qualitative_categorization = request.POST.get(
            "qualitative_categorization")
        targeted_for = request.POST.get("targeted_for")
        designed_for = request.POST.get("designed_for")
        targeted_category = request.POST.get("targeted_category")
        image = request.POST.get("image")
        dowellclock = get_dowellclock()
    SERVER = "https://panel.ai-writer.com/"
    API_KEY = "B91ACB505A7392D27356C26747EDD70D"

    # try to catch the max_entries error
    try:
        # first, we create a new research request for the keyword title
        research_request_obj = requests.post(SERVER + '/aiw/apiendpoint2/put_research_request/'+requests.utils.quote(
            title), params={"api_key": API_KEY, "identifier": "test_identifier"}).json()

        # show output
        pretty_print("NEW REQUEST", research_request_obj)

        # now get the research result, we will wait for a while and keep asking the server about it
        for _ in range(30):

            # request the result of the query
            research_result = requests.get(SERVER + '/aiw/apiendpoint2/get_research_result/' +
                                           research_request_obj["id"], params={"api_key": API_KEY}).json()

            # if the result is here, we will break the waiting loop
            if "result" in research_result and research_result["result"] is not None:
                break

            # the sleep makes sure we do not bomb the API endpoints
            time.sleep(30)
    except requests.exceptions.ConnectionError:
        r.status_code = "Connection refused"

    para = ''
    src = ''
    # go through all rewritten paragraphs and print them
    for p in research_result["result"]["article"]:
        print(p["paragraph_text"])
        save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                               "session_id": session_id,
                                               "eventId": create_event()['event_id'],
                                               # organization id,
                                               'client_admin_id': request.session['userinfo']['client_admin_id'],
                                               "title": title,
                                               "target_industry": target_industry,
                                               "qualitative_categorization": qualitative_categorization,
                                               "targeted_for": targeted_for,
                                               "designed_for": designed_for,
                                               "targeted_category": targeted_category,
                                               "image": image,
                                               "paragraph": p["paragraph_text"],
                                               "citation_and_url": p["paragraph_sources"],
                                               'subject': subject,
                                               'dowelltime': dowellclock
                                               }, '34567897799')
        para = para + p["paragraph_text"] + '\n'
    # print all cited sources
    for src_url in research_result["result"]["cited_sources"]:
        print("Source:", src_url)
        src = src + src_url + '\n'

    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                           "session_id": session_id,
                                           "eventId": create_event()['event_id'],
                                           'client_admin_id': request.session['userinfo']['client_admin_id'],
                                           "title": title, "target_industry": target_industry,
                                           "paragraph": para,
                                           "source": src,
                                           'subject': subject,
                                           'dowelltime': dowellclock
                                           }, "9992828281")

    # generating article through wikipedia
    wiki_language = wikipediaapi.Wikipedia(
        language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
    page = wiki_language.page(title)
    page_exists = page.exists()
    if page_exists == False:
        print("For Title: "+title+" Page does not exist.")
        print("Using subject: " + subject + " and verb: " +
              verb + " to create an article.")
        title_sub_verb = subject+" "+verb
        page = wiki_language.page(title_sub_verb)
        print("Page - Exists: %s" % page.exists())
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
                                                   'dowelltime': dowellclock
                                                   }, "9992828281")
            para_list = article_sub_verb[0].split("\n\n")
            source_verb = page.fullurl
            for i in range(len(para_list)):
                if para_list[i] != '':
                    save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                           "eventId": create_event()['event_id'],
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
                                                           'dowelltime': dowellclock
                                                           }, '34567897799')
        print("Using subject: " + subject + " to create an article.")
        page = wiki_language.page(subject)
        if page.exists() == False:
            print("Page - Exists: %s" % page.exists())
            message = "Article for Title " + title_sub_verb + \
                " and Title "+subject+" does not exist."
            return render(request, 'article/article.html', {'message': message, 'title': title})
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
                                                   'dowelltime': dowellclock
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
                                                           'dowelltime': dowellclock
                                                           }, '34567897799')
                    print("\n")
            if 'article_sub_verb' in locals():
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article_verb': article_sub_verb[0], 'source_verb': source_verb,
                # 'article_subject': article_subject[0], 'source_subject': page.fullurl, 'article_AI': para, 'AI_src': src})
                return HttpResponseRedirect(reverse("generate_article:article-list-articles"))
            else:
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article_subject': article_subject[0], 'source_subject': page.fullurl
                # , 'article_AI': para, 'AI_src': src})
                return HttpResponseRedirect(reverse("generate_article:article-list-articles"))
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
                                               'dowelltime': dowellclock
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
                                                       'dowelltime': dowellclock
                                                       }, '34567897799')
        # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article, 'source': page.fullurl, 'subject': subject, 'article_AI': para, 'AI_src': src})
        return HttpResponseRedirect(reverse("generate_article:article-list-articles"))


@csrf_exempt
@xframe_options_exempt
def generate_article(request):
    start_datetime = datetime.now()
    session_id = request.GET.get('session_id', None)
    if 'session_id' in request.session and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
            org_id = request.session.get('org_id')
            RESEARCH_QUERY = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            qualitative_categorization = request.POST.get(
                "qualitative_categorization")
            targeted_for = request.POST.get("targeted_for")
            designed_for = request.POST.get("designed_for")
            targeted_category = request.POST.get("targeted_category")
            image = request.POST.get("image")

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

            min_characters = 250

            # Build prompt
            prompt_limit = 280

            # Modify the prompt to include the formatted user data
            prompt = (
                f"Write an article about {RESEARCH_QUERY} that discusses {subject} using {verb} in the {target_industry} industry."
                f" Generate only 3 paragraphs."
                f" Include  {formatted_hashtags} at the end of the article."
                f" Also, append {formatted_cities} to the end of the article ."
                f" Ensure that the generated content is a minimum of {min_characters} characters in length."
                [:prompt_limit]
                + "..."
            )

            # Variables for loop control
            duration = 4  # Total duration in seconds
            interval = 0.8  # Interval between generating articles in seconds
            start_time = time.time()
            user_id = request.session['user_id']
            approval = get_client_approval(user_id)

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
                            "org_id": org_id,
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
                            "org_id": org_id,
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
                    return render(request, 'article/article.html', {'message': "Article did not save successfully.", 'title': RESEARCH_QUERY})

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

            # credit_handler = CreditHandler()
            # credit_handler.consume_step_2_credit(request)
            if approval['post'] == 'True':
                user_id = request.session['user_id']
                async_task("automate.services.post_list", user_id,
                           hook='automate.services.hook_now')
            return HttpResponseRedirect(reverse("generate_article:article-list-articles"))

    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def generate_article_wiki(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("main-view"))
        else:
            org_id = request.session.get('org_id')
            user_id = request.session['user_id']
            approval = get_client_approval(user_id)
            title = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            qualitative_categorization = request.POST.get(
                "qualitative_categorization")
            targeted_for = request.POST.get("targeted_for")
            designed_for = request.POST.get("designed_for")
            targeted_category = request.POST.get("targeted_category")
            image = request.POST.get("image")
            # dowellclock = get_dowellclock()
            wiki_language = wikipediaapi.Wikipedia(
                language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
            page = wiki_language.page(title)
            page_exists = page.exists()
            if page_exists == False:
                print("For Title: "+title+" Page does not exist.")
                print("Using subject: " + subject + " and verb: " +
                      verb + " to create an article.")
                title_sub_verb = subject+" "+verb
                page = wiki_language.page(title_sub_verb)
                print("Page - Exists: %s" % page.exists())
                source_verb = ''
                if page.exists() == True:
                    article_sub_verb = page.text
                    article_sub_verb = article_sub_verb.split("See also")
                    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "org_id": org_id,
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
                                                                   "org_id": org_id,
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
                print("Using subject: " + subject + " to create an article.")
                page = wiki_language.page(title_sub_verb)
                if page.exists() == False:
                    print("Page - Exists: %s" % page.exists())
                    # message = "Article for Title " + title_sub_verb + \
                    #     " and Title "+subject+" does not exist."
                    message = f"There were no results matching the query as the page '{title}' does not exist in Wikipedia"
                    return render(request, 'article/article.html', {'message': message})
                else:
                    article_subject = page.text
                    print(article_subject)
                    article_subject = article_subject.split("See also")
                    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "org_id": org_id,
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
                                                                   "org_id": org_id,
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
                    if approval['post'] == 'True':
                        user_id = request.session['user_id']
                        async_task("automate.services.post_list",
                                   user_id, hook='automate.services.hook_now')
                    if 'article_sub_verb' in locals():
                        # return render(request, 'article/article.html',{'message': "Article using verb and subject saved Successfully.", 'article_verb': article_sub_verb[0], 'source_verb': source_verb,
                        # 'article': article_subject[0], 'source': page.fullurl,  'title': title})
                        return HttpResponseRedirect(reverse("generate_article:article-list-articles"))

                    else:
                        # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article_subject[0], 'source': page.fullurl,  'title': title})

                        return HttpResponseRedirect(reverse("generate_article:article-list-articles"))

            else:
                print("For Title: "+title+" Page exists.")
                article = page.text
                article = article.split("See also")
                save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                       "session_id": session_id,
                                                       "org_id": org_id,
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
                                                               "org_id": org_id,
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
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article, 'source': page.fullurl,  'title': title})
                # credit_handler = CreditHandler()
                # credit_handler.consume_step_2_credit(request)
                if approval['post'] == 'True':
                    user_id = request.session['user_id']
                    async_task("automate.services.post_list",
                               user_id, hook='automate.services.hook_now')
                return HttpResponseRedirect(reverse("generate_article:article-list-articles"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def write_yourself(request):
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            messages.error(
                request, 'You have to choose a sentence first to write its article!')
            return HttpResponseRedirect(reverse("generate_article:index-view"))
        else:
            form = VerifyArticleForm()
            title = request.POST.get("title")
            print("title in write view: ", title)
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            print("target_industry in write: ", target_industry)
            user_id = request.session['user_id']
            approval = get_client_approval(user_id)
            if approval['post'] == 'True':
                async_task("automate.services.post_list", user_id,
                           hook='automate.services.hook_now')
        return render(request, 'article/write.html', {'title': title, 'subject': subject, 'verb': verb, 'target_industry': target_industry, 'form': form})
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def verify_article(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
            print('this is running')
            title = request.POST.get("title")
            subject = request.POST.get("subject")
            verb = request.POST.get("verb")
            target_industry = request.POST.get("target_industry")
            print("target_industry in verify: ", target_industry)
            qualitative_categorization = request.POST.get(
                "qualitative_categorization")
            targeted_for = request.POST.get("targeted_for")
            designed_for = request.POST.get("designed_for")
            targeted_category = request.POST.get("targeted_category")
            image = request.POST.get("image")
            # dowellclock = get_dowellclock()
            article = request.POST.get("articletextarea")
            source = request.POST.get("url")
            form = VerifyArticleForm(request.POST)

            if not form.is_valid():
                messages.success(request, 'Please fix the errors below')
                return render(request, 'article/write.html', {'title': title, 'subject': subject, 'verb': verb, 'target_industry': target_industry, 'form': form})
            headers = {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
            try:
                response = requests.get(source, headers=headers)
            except Exception as e:
                print(str(e))
                messages.error(
                    request, 'The url of the article has not been authorized!')
                return render(request, 'article/write.html', {'title': title, 'subject': subject, 'verb': verb, 'target_industry': target_industry, 'form': form})

            if response.status_code == 403:
                message = "Error code 403 Forbidden: Website does not allow to verify the article."
                return render(request, 'article/article.html', {'message': message, 'article': article, 'source': source, 'title': title})
            else:
                text_from_page_space = text_from_html(response.text)
                text_from_page = text_from_page_space.replace(" ", "")
                text_from_page = text_from_page.replace("\xa0", "")
                print(article)
                paragraph = article.split("\r\n")

                message = "Article Verified, "
                for i in range(len(paragraph)):

                    # check for empty paragraph
                    if paragraph[i] == "":
                        continue
                    # saving paragraphs in article
                    save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "org_id": org_id,
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
                                                           "org_id": org_id,
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

                # saving article
                save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                       "session_id": session_id,
                                                       "org_id": org_id,
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
                print("Article saved successfully")
                message = message + "Article saved successfully"

                # credit_handler = CreditHandler()
                # credit_handler.consume_step_2_credit(request)
                return HttpResponseRedirect(reverse("generate_article:article-list-articles"))

    else:
        return render(request, 'error.html')


@xframe_options_exempt
def post_list(request):
    # return HttpResponse(request.session.get('user_name'))
    if 'session_id' and 'username' in request.session:
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}

        org_id = request.session.get('org_id')

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "step3_data",
            "document": "step3_data",
            "team_member_ID": "34567897799",
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }

        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)

        print(response)
        response_data_json = json.loads(response.json())
        user_id = str(request.session['user_id'])
<<<<<<< HEAD
        if len(response_data_json['data']) == 0:
            status = 'insert'
=======
        article_detail_list = response_data_json.get('data', [])

        # takes in the json data
        datas = article_detail_list

        posts = []
        # iterates through the json file

        for article in article_detail_list:

            if article.get('org_id') == org_id:
                articles = {
                    'title': article.get('title'),
                    'paragraph': article.get('paragraph'),
                    'source': article.get('source'),
                }
                # appends articles to posts
                posts.append(articles)
        posts = list(reversed(posts))  # Reverse the order of the posts list

        number_of_items_per_page = 5
        page = request.GET.get('page', 1)

        paginator = Paginator(posts, number_of_items_per_page)
        try:
            page_post = paginator.page(page)
        except PageNotAnInteger:
            page_post = paginator.page(1)
        except EmptyPage:
            page_post = paginator.page(paginator.num_pages)

        context = {
            'posts': posts,
            'page_post': page_post,
        }

        return render(request, 'post_list.html', context)
    else:
        return render(request, 'error.html')


@xframe_options_exempt
def list_article_view(request):
    # return HttpResponse(request.session.get('user_name'))
    if 'session_id' and 'username' in request.session:
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}

        org_id = request.session.get('org_id')

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "step2_data",
            "document": "step2_data",
            "team_member_ID": "9992828281",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }

        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)

        response_data_json = json.loads(response.json())

        # takes in user_id
        user_id = str(request.session['user_id'])
        article_detail_list = response_data_json.get('data', [])

        user_articles = []
        for article in article_detail_list:

            if article.get('org_id') == org_id:
                articles = {
                    'title': article.get('title'),
                    'paragraph': article.get('paragraph'),
                    'source': article.get('source'),
                }
                # appends articles to posts
                user_articles.append(articles)

        # Reverse the order of the posts list
        user_articles = list(reversed(user_articles))

        number_of_items_per_page = 5
        page = request.GET.get('page', 1)

        paginator = Paginator(user_articles, number_of_items_per_page)
        try:
            page_post = paginator.page(page)
        except PageNotAnInteger:
            page_post = paginator.page(1)
        except EmptyPage:
            page_post = paginator.page(paginator.num_pages)

        context = {
            'posts': user_articles,
            'page_post': page_post,
        }

        return render(request, 'article_list.html', context)
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
    url = "http://uxlivinglab.pythonanywhere.com"

    # adding eddited field in article

    payload = json.dumps({
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": 'step2_data',
        "document": 'step2_data',
        "team_member_ID": "9992828281",
        "function_ID": "ABCDE",
        "command": "find",
        "field": {'target_industry': "Food & Beverages"},
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
    return render(request, 'post_filter_list.html', {'posts': posts})


@csrf_exempt
@xframe_options_exempt
def article_detail(request):
    if 'session_id' and 'username' in request.session:

        profile = request.session['operations_right']

        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:article-list-articles"))
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
        else:
            status = 'update'

        return Response({'status': status})

<<<<<<< HEAD
    def post(self, request):
        session_id = request.GET.get("session_id", None)
=======
        print(profile)

        return render(request, 'article_detail.html', {'post': post, 'profile': profile})
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def post_detail(request):
    if 'session_id' and 'username' in request.session:
        # credit_handler = CreditHandler()
        # credit_response = credit_handler.check_if_user_has_enough_credits(
        #     sub_service_id=STEP_3_SUB_SERVICE_ID,
        #     request=request,
        # )
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}

        org_id = request.session.get('org_id')

        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "ayrshare_info",
            "document": "ayrshare_info",
            "team_member_ID": "100007001",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }
        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)
        ayrshare_info = json.loads(response.json())
        print("here we have", ayrshare_info)

        for data in ayrshare_info['data']:
            social_platforms = data['aryshare_details']
            for key, value in social_platforms.items():
                handles = value
                print(handles)
            break

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
        response = requests.request("POST", url, headers=headers, data=payload)

        profile = request.session['operations_right']

        categ = json.loads(response.json())['data']
        categories = []
        for row in categ:
            for data in row:
                for key, value in data.items():
                    if key == 'category':
                        categories.append(value)
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
<<<<<<< HEAD
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
=======
            id = request.POST.get("post_id")
            title = request.POST.get("title")
            paragraph = request.POST.get("paragraph")
            paragraph = paragraph.split('\r\n')
            source = request.POST.get("source")
            if "\r\n" in source:
                source = source.split('\r\n')

            post = {
                "id": id,
                "title": title,
                "paragraph": paragraph,
                "source": source
            }
        a = random.randint(1, 9)
        category = ['ocean', 'sky', 'food', 'football', 'house',
                    'animals', 'cars', 'History', 'Tech', 'People']
        query = title
        output = []
        image_gen=ImageGenerator()
        image_details=image_gen.process(prompt=title)

        if image_details.get('imageUrl'):
            images=image_details.get('imageUrl')
        else:
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
            images = output[0]
        print(profile)
        messages.info(
            request, 'You are limited to use only images from Samanta AI due to security and privacy policy')
        return render(request, 'post_detail.html', {'post': post, 'categories': categories, 'images': images, 'profile': profile, 'handles': handles})
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def Save_Post(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:
        # searchstring="ObjectId"+"("+"'"+"6139bd4969b0c91866e40551"+"'"+")"
        # date = datetime.now()
        # time=dd.strftime("%d:%m:%Y,%H:%M:%S")
        time = localtime()
        org_id = request.session.get('org_id')
        test_date = str(localdate())
        date_obj = datetime.strptime(test_date, '%Y-%m-%d')
        date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        eventId = create_event()['event_id'],
        if request.method == "POST":
            title = request.POST.get("title")
            paragraphs_list = request.POST.getlist("paragraphs[]")
            print('paragraphs_list:', paragraphs_list)
            source = request.POST.get("source")
            qualitative_categorization = request.POST.get(
                "qualitative_categorization")
            targeted_for = request.POST.get("targeted_for")
            designed_for = request.POST.get("designed_for")
            targeted_category = request.POST.get("targeted_category")
            image = request.POST.get("images")
            # dowellclock = get_dowellclock(),
            combined_article = "\n\n".join(paragraphs_list)

            # Define a regular expression pattern to identify URLs
            url_pattern = r'https?://\S+'

            urls = re.findall(url_pattern, combined_article)
            for url in urls:
                combined_article = combined_article.replace(
                    url, f'URL_PLACEHOLDER{urls.index(url)}')
            paragraph_without_commas = combined_article.replace(
                '.', '. ').replace(',', ', ')

            # Restore URLs back to the text
            for index, url in enumerate(urls):
                paragraph_without_commas = paragraph_without_commas.replace(
                    f'URL_PLACEHOLDER{index}', url)

            print(paragraph_without_commas)
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

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
<<<<<<< HEAD
                    "eventId": event_id,
=======
                    "org_id": org_id,
                    "eventId": eventId,
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
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
            messages.success(request, ".")

            return Response({
                'message': 'Details inserted successfully',
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

            data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=data)
            print(response.text)
            return Response({
                'message': 'Approvals updated successfully',
                'topic': topic,
                'article': article,
                'post': post,
                'schedule': schedule
            }, status=status.HTTP_200_OK)


class PostDetailDropdownView(AuthenticatedBaseView):

    def get(self, request):
        session_id = request.GET.get("session_id", None)
        url = "http://uxlivinglab.pythonanywhere.com/"
        headers = {'content-type': 'application/json'}
        org_id = request.session.get('org_id')
        print('this is org _id')
        print(org_id)
        payload = {
            "cluster": "socialmedia",
            "database": "socialmedia",
            "collection": "user_info",
            "document": "user_info",
            "team_member_ID": "1071",
            "function_ID": "ABCDE",
            "command": "fetch",
            "field": {"org_id": org_id, },
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
<<<<<<< HEAD
        if len(response_data_json['data']) == 0:
            status = 'insert'
=======
        status = 'posted'

        post = []
        try:
            for row in posts['data']:
                if org_id == str(row['org_id']):
                    try:
                        if status == row['status']:
                            data = {'title': row['title'], 'paragraph': row['paragraph'], 'Date': datetime.strptime(
                                row["date"][:10], '%Y-%m-%d').date(), 'image': row['image'], 'source': row['source'], 'time': row['time']}
                            post.append(data)
                            post = list(reversed(post))

                    except:
                        pass
        except:
            print('no post')
        # post = list(reversed(post))  # Reverse the order of the posts list

        return JsonResponse({'response': post})
    else:
        return render(request, 'error.html')


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


def get_key(title):
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
        "field": {"title": title},
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


def api_call(poste, platforms, key, image, request, post_id):

    payload = {'post': poste,
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


def api_call2(poste, platforms, key, image, request, post_id, formart):

    payload = {'post': poste,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               "scheduleDate": str(formart),
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
        print('This is the post PK')
        print(post_id)

        # Splitting the content and logo into separate paragraphs
        postes_paragraph1 = f"{paragraph[0:2000]}."
        postes_paragraph2 = logo

        # Combining the paragraphs with a newline character
        postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"

        twitter_post_paragraph1 = paragraph2
        twitter_post_paragraph2 = logo

        twitter_post = f"{twitter_post_paragraph1}\n\n{twitter_post_paragraph2}"

        print(twitter_post)
        try:
            platforms = data['social']
            splited = data['special']
            print(platforms)
        except:
            pass
        user_id = request.session['user_id']
        owner_name = request.session['portfolio_info'][0]['owner_name']
        key = get_key(owner_name)
        if len(splited) == 0:
            arguments = (
                (postes, platforms, key, image, request, post_id),
            )
        if len(platforms) == 0:
            arguments = (
                (twitter_post, splited, key, image, request, post_id),
            )
            print(splited, twitter_post)
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81
        else:
            status = 'update'

        return Response({'status': status})

<<<<<<< HEAD
    def post(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "POST":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data  # Use request.data to access JSON data
            qualitative_categorization = data.get("qualitative_categorization")
            targeted_for = data.get("targeted")
            targeted_category = data.get("targeted_category")
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']

            url = "http://uxlivinglab.pythonanywhere.com"
=======
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
        #     return JsonResponse('credit_error', safe=False)
        start_datetime = datetime.now()
        data = json.loads(request.body.decode("utf-8"))
        timezone = request.session['timezone']
        title = data['title']
        paragraph = data['paragraph']
        paragraph2 = str(paragraph[0:230])
        print('paragraph:', paragraph2)
        image = data['image']
        logo = "Created and posted by #samanta #uxlivinglab"
        post_id = data['PK']
        schedule = data['schedule']
        print('this is :', schedule)

        # Adding a period to the end of the content before "Created and posted by"
        postes_paragraph1 = f"{paragraph[0:2000]}."
        postes_paragraph2 = logo

        # Combining the paragraphs with a newline character
        postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"

        # Adding a period to the end of the content before "Created and posted by"
        twitter_post_paragraph1 = paragraph2
        twitter_post_paragraph2 = logo

        # Combining the paragraphs with a newline character
        twitter_post = f"{twitter_post_paragraph1}\n\n{twitter_post_paragraph2}"
        print('hello_____', len(twitter_post))
        try:
            platforms = data['social']
            splited = data['special']
        except:
            pass
        print(platforms)
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
        owner_name = request.session['portfolio_info'][0]['owner_name']
        key = get_key(owner_name)
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
            executor.map(lambda f: api_call2(*f), arguments)
            end_datetime = datetime.now()
            time_taken = end_datetime - start_datetime
            print(f"Total time taken: {time_taken}")
        return JsonResponse('scheduled', safe=False)
    else:
        return JsonResponse('social_media_channels', safe=False)


@csrf_exempt
@xframe_options_exempt
def social_media_channels(request):
    if request.method == "POST":
        step_2_manager = Step2Manager()
        username = request.session['username']
        is_current_user_owner = False

        if request.session['portfolio_info'][0]['member_type'] == 'owner':
            is_current_user_owner = True

        if not is_current_user_owner:
            messages.error(request, 'You are permitted to perform this action!')
            messages.error(request, 'Only the owner of the organization can connect to social media channels')
            return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
        email = request.session['userinfo']['email']
        name = f"{str(request.session['userinfo']['first_name'])} {str(request.session['userinfo']['last_name'])}"
        org_id = request.session['org_id']
        data = {
            'username': username,
            'email': email,
            'name': name,
            'org_id': org_id,
        }
        step_2_manager.create_social_media_request(data)
        messages.success(request,
                         'Social media request was saved successfully. Wait for the admin to accept the request')
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        step_2_manager = Step2Manager()

        try:
            title = request.session['portfolio_info'][0]['owner_name']
        except KeyError:
            title = request.session['username']

        user_has_social_media_profile = check_if_user_has_social_media_profile_in_aryshare(
            title)
        linked_accounts = check_connected_accounts(title)
        context_data = {'user_has_social_media_profile': user_has_social_media_profile,
                        'linked_accounts': linked_accounts}

        org_id = request.session['org_id']

        data = {
            'username': title,
            'org_id': org_id,
        }
        social_media_request = step_2_manager.get_approved_user_social_media_request(
            data)
        if user_has_social_media_profile:
            context_data['can_connect'] = True
        elif social_media_request:
            context_data['can_connect'] = True
        else:
            context_data['can_connect'] = False

        return render(request, 'social_media_channels.html', context_data)


@csrf_exempt
@xframe_options_exempt
def admin_approve_social_media(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method == "GET":
            step_2_manager = Step2Manager()
            social_media_requests = step_2_manager.get_all_unapproved_social_media_request(
                {
                    'org_id': request.session.get('org_id'),
                }
            )
            context_data = {
                'social_media_requests': social_media_requests
            }
            return render(request, 'admin_approve.html', context_data)
        elif request.method == "POST":
            step_2_manager = Step2Manager()
            data = {
                'social_media_request_id': request.POST.getlist('social_media_request_id')
            }
            approve = False
            if request.POST.get('approve') == 'Approve Selected':
                approve = True
            elif request.POST.get('approve') == 'Reject Selected':
                approve = False
            elif request.POST.get('approve') == 'Approve All':
                approve = True
                social_media_requests = step_2_manager.get_all_unapproved_social_media_request(
                    {'org_id': request.session.get('org_id'), }
                )
                data['social_media_request_id'] = social_media_requests.values_list(
                    'id', flat=True)
            data['is_approved'] = approve
            step_2_manager.update_social_media_request_status(data)
            messages.success(
                request, 'Status of social media has been updated successfully')
            return HttpResponseRedirect(reverse("generate_article:admin_approve_social_media"))
    else:
        return render(request, 'error.html')


@csrf_exempt
@xframe_options_exempt
def create_social_media_request(request):
    session_id = request.GET.get("session_id", None)
    if 'session_id' and 'username' in request.session:
        if request.method == "GET":

            return render(request, 'admin_approve.html', )
        elif request.method == "POST":

            return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        return render(request, 'error.html')


# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def files_ListSearchView(request):
#     if request.method=="POST":
#         search_text = request.POST.get("search_text")
#         # Saving the search parameters on the session
#         request.session['search_text'] = search_text
>>>>>>> 8ce2f4717d8897aa32bf9d4008a68374cb161b81

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
                    "qualitative_categorization": qualitative_categorization,
                    "targeted_for": targeted_for,
                    "targeted_category": targeted_category,
                    "session_id": session_id,
                    "eventId": event_id,
                    'client_admin_id': request.session['userinfo']['client_admin_id'],
                    "date": date,
                    "time": str(time),
                },
                "update_field": {
                    "approvals": {
                        "qualitative_categorization": qualitative_categorization,
                        "targeted_for": targeted_for,
                        "targeted_category": targeted_category,
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
            messages.success(request, ".")

            return Response({
                'message': 'Details inserted successfully',
                "qualitative_categorization": qualitative_categorization,
                "targeted_for": targeted_for,
                "targeted_category": targeted_category,
            }, status=status.HTTP_200_OK)

    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if request.method != "PUT":
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data  # Use request.data to access JSON data
            qualitative_categorization = data.get("qualitative_categorization")
            targeted_for = data.get("targeted")
            targeted_category = data.get("targeted_category")
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
                "command": "update",
                "field": {
                    'user_id': request.session['user_id']
                },
                "update_field": {
                    "qualitative_categorization": qualitative_categorization,
                    "targeted_for": targeted_for,
                    "targeted_category": targeted_category,
                },
                "platform": "bangalore"
            }
            headers = {
                'Content-Type': 'application/json'
            }

            data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=data)
            print(response.text)
            return Response({
                'message': 'Details updated successfully',
                "qualitative_categorization": qualitative_categorization,
                "targeted_for": targeted_for,
                "targeted_category": targeted_category,
            }, status=status.HTTP_200_OK)


class FetchUserInfo(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            user_data = fetch_user_info(request)
            print(user_data)
            return Response(user_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


'''user settings ends here'''
