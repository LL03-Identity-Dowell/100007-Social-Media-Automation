import concurrent.futures
import datetime
import json
import random
import traceback
import urllib
import urllib.parse
from datetime import datetime
# image resizing
from io import BytesIO
from itertools import chain

import jwt
# from website.views import get_client_approval
import openai
import pandas as pd
import pytz
import requests
import wikipediaapi
from PIL import Image
from django.contrib import messages
from django.core import cache
from django.core.cache import cache
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.utils.timezone import localdate, localtime
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from pexels_api import API
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_401_UNAUTHORIZED
# rest(React endpoints)
from rest_framework.views import APIView

from config_master import SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME
from credits.constants import COMMENTS_SUB_SERVICE_ID, STEP_2_SUB_SERVICE_ID, STEP_3_SUB_SERVICE_ID, \
    STEP_4_SUB_SERVICE_ID
from credits.credit_handler import CreditHandler
from helpers import (check_if_user_can_view_org_channels, check_if_user_is_owner_of_organization, decode_json_data, download_and_upload_image,
                     download_and_upload_users_image,
                     fetch_organization_user_info,
                     fetch_user_portfolio_data,
                     save_data, create_event, fetch_user_info, check_connected_accounts,
                     check_if_user_has_social_media_profile_in_aryshare, update_aryshare, get_key,
                     get_most_recent_posts, get_post_comments, save_profile_key_to_post,
                     get_post_by_id, post_comment_to_social_media, get_scheduled_posts, delete_post_comment,
                     encode_json_data, create_group_hashtags, filter_group_hashtag, update_group_hashtags)
from react_version import settings
from react_version.views import AuthenticatedBaseView
from .models import Step2Manager
from .serializers import (ChannelAccessSerializer, DataSerializer, PortfolioChannelsSerializer, ProfileSerializer, CitySerializer,
                          UnScheduledJsonSerializer,
                          ScheduledJsonSerializer, ListArticleSerializer, RankedTopicListSerializer,
                          EditPostSerializer,
                          MostRecentJsonSerializer, PostCommentSerializer, DeletePostCommentSerializer,
                          GroupHashtagSerializer, SocialMediaRequestSerializer, ImageUploadSerializer)

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


def dowell_login(request):
    session_id = request.GET.get("session_id", None)
    if session_id:
        request.session["session_id"] = session_id
        return redirect("https://100007.pythonanywhere.com/api/v2/main/")
    else:
        return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100007.pythonanywhere.com/")


class LogoutUser(APIView):
    def get(self, request):
        session_id = request.session.get("session_id")
        if session_id:
            try:
                del request.session["session_id"]
                return redirect(
                    "https://100014.pythonanywhere.com/sign-out?returnurl=https://100007.pythonanywhere.com")
            except:
                return redirect(
                    "https://100014.pythonanywhere.com/sign-out?returnurl=https://100007.pythonanywhere.com")
        else:
            return redirect("https://100014.pythonanywhere.com/sign-out?returnurl=https://100007.pythonanywhere.com")


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
            credit_handler = CreditHandler()
            credit_handler.login(request)

            serializer = ProfileSerializer({
                "userinfo": profile_details.get('userinfo', {}),
                "portfolio_info": profile_details.get('portfolio_info', []),
                "username": request.session['username'],
                "user_id": request.session['user_id'],
                "timezone": request.session['timezone'],
                "operations_right": request.session['operations_right'],
                "org_id": request.session['org_id'],
                "product_service_status": credit_handler.login(request)
            })

            return Response(serializer.data)

        else:
            return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100007.pythonanywhere.com")


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
                # source = data.get("source", '')
                # if "\r\n" in source:
                #     source = source.split('\r\n')

                post = {
                    "post_id": article_id,
                    "title": title,
                    "paragraph": paragraph,
                    # "source": source
                }
            response_data = {'post': post, 'profile': profile}
            return Response(response_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class IndexView(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            credit_handler = CreditHandler()
            credit_response = credit_handler.check_if_user_has_enough_credits(
                sub_service_id=STEP_2_SUB_SERVICE_ID,
                request=request,
            )
            if not credit_response.get('success'):
                return Response(credit_response, status=HTTP_400_BAD_REQUEST)

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
            try:
                profile = str(request.session['operations_right'])
            except:
                profile = 'member'
            try:
                user_org_id_list = [portfolio_info.get(
                    'org_id') for portfolio_info in request.session['portfolio_info'] if
                    portfolio_info.get('org_id', None)]

                datas = results['data']

                array = []
                for row in datas:
                    try:
                        org_id = row.get('org_id')
                        if org_id in user_org_id_list:
                            array.append(row)
                    except Exception as e:
                        traceback.print_exc()

                topics = []
                number_of_items_per_page = 10
                page = request.GET.get('page', 1)
                array.reverse()
                for counter, data in enumerate(array):
                    for key in data.keys():
                        if key.startswith("sentence_rank_") and data[key]['sentence_rank'] is not None:
                            topic = {
                                "ranks": data[key]['sentence_rank'],
                                "sentence": data[key]['sentence_result'],
                                "key": key,
                                'created_by': data.get('username', 'NA'),
                                'subject': data.get('subject'),
                                'verb': data.get('verb'),
                            }
                            topics.append(topic)
                paginator = Paginator(topics, number_of_items_per_page)
                try:
                    topics = paginator.page(page)
                except PageNotAnInteger:
                    topics = paginator.page(1)
                except EmptyPage:
                    topics = paginator.page(paginator.num_pages)
            except Exception as e:
                traceback.print_exc()
                topics = []
            topics_data = [{'ranks': topic['ranks'],
                            'sentence': topic['sentence'],
                            'key': topic['key'],
                            'created_by': topic.get('created_by', 'NA'),
                            'subject': topic.get('subject'),
                            'verb': topic.get('verb'),
                            } for topic in topics]

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
        credit_handler = CreditHandler()
        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_2_SUB_SERVICE_ID,
            request=request,
        )
        if not credit_response.get('success'):
            return Response(credit_response, status=HTTP_400_BAD_REQUEST)
        start_datetime = datetime.now()
        session_id = request.GET.get('session_id', None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "POST":
                return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                org_id = request.session.get('org_id')
                RESEARCH_QUERY = request.data.get("title")
                user_data = fetch_user_info(request)
                openai.api_key = settings.OPENAI_KEY

                # Build prompt
                prompt_limit = 3000
                min_characters = 500
                prompt = (
                    f"Write an article about {RESEARCH_QUERY}"
                    f" Ensure that the generated content is a minimum of {min_characters} characters in length."
                    [:prompt_limit]
                    + "..."
                )
                # Generate article using OpenAI's GPT-3
                response = openai.Completion.create(
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
                hashtags_in_last_paragraph = set(
                    word.lower() for word in paragraphs[-1].split() if word.startswith('#'))
                for i in range(len(paragraphs) - 1):
                    paragraphs[i] += " " + " ".join(hashtags_in_last_paragraph)

                paragraphs = paragraphs[::-1]

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
                credit_handler = CreditHandler()
                credit_response = credit_handler.check_if_user_has_enough_credits(
                    sub_service_id=STEP_2_SUB_SERVICE_ID,
                    request=request,
                )
                if not credit_response.get('success'):
                    return Response(credit_response, status=HTTP_400_BAD_REQUEST)

                title = request.data.get("sentence")
                org_id = request.session.get('org_id')
                wiki_language = wikipediaapi.Wikipedia(
                    language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)
                page = wiki_language.page(title)
                subject = request.data.get('subject', '')
                verb = request.data.get('verb')

                if page == False:
                    print("For Title: " + title + " Page does not exist.")
                    print("Using subject: " + subject + " and verb: " +
                          verb + " to create an article.")
                    title_sub_verb = subject + " " + verb
                    page = wiki_language.page(title_sub_verb)
                    print("Page - Exists: %s" % page.exists())
                    if page.exists() == True:
                        article_sub_verb = page.text
                        article_sub_verb = article_sub_verb.split("See also")
                        save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "org_id": org_id,
                                                               "eventId": create_event()['event_id'],
                                                               'client_admin_id': request.session['userinfo'][
                                                                   'client_admin_id'],
                                                               "title": title_sub_verb,
                                                               "paragraph": article_sub_verb[0],
                                                               "source": page.fullurl,
                                                               'subject': subject,
                                                               # 'dowelltime': dowellclock
                                                               }, "9992828281")
                        para_list = article_sub_verb[0].split("\n\n")
                        para_list = para_list[::-1]
                        source_verb = page.fullurl
                        for i in range(len(para_list)):
                            if para_list[i] != '':
                                save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                       "session_id": session_id,
                                                                       "org_id": org_id,
                                                                       "eventId": create_event()['event_id'],
                                                                       'client_admin_id': request.session['userinfo'][
                                                                           'client_admin_id'],
                                                                       "title": title,
                                                                       "source": source_verb,
                                                                       "paragraph": para_list[i],
                                                                       "citation_and_url": page.fullurl,
                                                                       'subject': subject,
                                                                       # 'dowelltime': dowellclock
                                                                       }, '34567897799')
                    print("Using subject: " + subject +
                          " to create an article.")
                    page = wiki_language.page(title_sub_verb)
                    if page.exists() == False:
                        print("Page - Exists: %s" % page.exists())
                        return Response({
                            'message': f"There were no results matching the query as the page '{title}' does not exist in Wikipedia"})

                    credit_handler = CreditHandler()
                    credit_handler.consume_step_2_credit(request)
                    return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)

                if page.exists():
                    print("For Title: " + title + " Page exists.")
                    article = page.text
                    article = article.split("See also")
                    para_list = article[0].split("\n\n")
                    para_list = para_list[::-1]
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                                   "session_id": session_id,
                                                                   "eventId": create_event()['event_id'],
                                                                   'client_admin_id': request.session['userinfo'][
                                                                       'client_admin_id'],
                                                                   "title": title,
                                                                   "org_id": org_id,
                                                                   "paragraph": article[0],
                                                                   "source": page.fullurl,
                                                                   # 'dowelltime': dowellclock
                                                                   }, "9992828281")
                        break

                    para_list = article[0].split("\n\n")
                    for i in range(len(para_list)):
                        if para_list[i] != '':
                            save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                                   "session_id": session_id,
                                                                   "eventId": create_event()['event_id'],
                                                                   'client_admin_id': request.session['userinfo'][
                                                                       'client_admin_id'],
                                                                   "title": title,
                                                                   "org_id": org_id,
                                                                   "paragraph": para_list[i],
                                                                   "citation_and_url": page.fullurl,
                                                                   # 'dowelltime': dowellclock
                                                                   }, '34567897799')
                        break
                    credit_handler = CreditHandler()
                    credit_handler.consume_step_2_credit(request)
                    return Response({'message': 'Article saved successfully'}, status=status.HTTP_201_CREATED)
                elif page.exists() == False:
                    return Response({
                        'message': f"There were no results matching the query as the page '{title}' does not exist in Wikipedia"})
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class WriteYourselfView(AuthenticatedBaseView):
    def post(self, request):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            if request.method != "POST":
                return Response({'error': 'You have to choose a sentence first to write its article.'}, status=400)
            else:
                credit_handler = CreditHandler()
                credit_response = credit_handler.check_if_user_has_enough_credits(
                    sub_service_id=STEP_2_SUB_SERVICE_ID,
                    request=request,
                )
                if not credit_response.get('success'):
                    return Response(credit_response, status=HTTP_400_BAD_REQUEST)

                title = request.data.get("title")
                org_id = request.session.get('org_id')
                article_text_area = request.data.get("articletextarea")
                # source = request.data.get("url")
                source = ""
                response_data = {
                    'title': title,
                    'articletextarea': article_text_area,
                    'url': source,
                }
                # headers = {
                #     'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
                # try:
                #     response = requests.get(source, headers=headers)
                # except Exception as e:
                #     print(str(e))
                #     return Response({'error': 'The url of the article has not been authorized!', 'data': response_data},
                #                     status=status.HTTP_400_BAD_REQUEST)
                # if response.status_code == 403:
                #     return Response(
                #         {'error': 'Error code 403 Forbidden: Website does not allow verification of the article!',
                #          'data': response_data}, status=status.HTTP_403_FORBIDDEN)
                # else:

                # text_from_page_space = text_from_html(response.text)
                # text_from_page = text_from_page_space.replace(" ", "")
                # text_from_page = text_from_page.replace("\xa0", "")
                print(article_text_area)
                paragraph = article_text_area.split("\r\n")
                double_line_paragraphs = article_text_area.split("\n\n")
                if len(double_line_paragraphs) > len(paragraph):
                    paragraph = double_line_paragraphs

                message = "Article Verified, "
                paragraph = paragraph[::-1]
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
                    save_data('step4_data', 'step4_data', {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "org_id": org_id,
                                                           "eventId": create_event()['event_id'],
                                                           'client_admin_id': request.session['userinfo'][
                        'client_admin_id'],
                        "title": title,
                        "paragraph": paragraph[i],
                        "source": source,

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

                credit_handler = CreditHandler()
                credit_handler.consume_step_2_credit(request)
                return Response({'message': 'Article saved successfully', 'data': response_data},
                                status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''
step-2 Ends here
'''

'''
step-3 starts here
'''


class NewPostGeneration(AuthenticatedBaseView):
    def post(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        data = "data from api"  # new dev working on this
        email = request.session['userinfo']['email']
        url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
        email = request.session['userinfo'].get('email')
        object = data['object'].lower()
        subject = data['topic']
        verb = data['verb']
        adjective = data['adjective']

        def api_call(grammar_arguments=None):
            if grammar_arguments is None:
                grammar_arguments = {}

            querystring = {
                "object": object,
                "subject": subject,
                "verb": verb,
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
        tenses = ['past', 'present', 'future']
        other_grammar = ['passive', 'progressive', 'perfect', 'negated']
        api_results = []

        for tense in tenses:
            for grammar in other_grammar:
                arguments = {'tense': tense, grammar: grammar}
                api_result = api_call(arguments)
                api_results.append(api_result)
        else:
            pass

        # correct this once we have the data
        RESEARCH_QUERY = data.get("topic/title")
        prompt_limit = 3000
        min_characters = 500
        prompt = (
            f"Write an article about {RESEARCH_QUERY}"
            f" Ensure that the generated content is a minimum of {min_characters} characters in length."
            [:prompt_limit]
            + "..."
        )
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=prompt,
            temperature=0.5,
            max_tokens=1024,
            n=1,
            stop=None,
            timeout=60,
        )
        article = response.choices[0].text
        # save the data to collection and use it for automation
        return Response({"message": "Post saved successfully"}, status=status.HTTP_200_OK)


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
            number_of_items_per_page = 5
            page = request.GET.get('page', 1)

            paginator = Paginator(posts, number_of_items_per_page)
            try:
                page_post = paginator.page(page)
            except PageNotAnInteger:
                page_post = paginator.page(1)
            except EmptyPage:
                page_post = paginator.page(paginator.num_pages)
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
            credit_handler = CreditHandler()
            credit_response = credit_handler.check_if_user_has_enough_credits(
                sub_service_id=STEP_3_SUB_SERVICE_ID,
                request=request,
            )

            if not credit_response.get('success'):
                return Response(credit_response, status=HTTP_400_BAD_REQUEST)
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
                    }
                elif 'article' in data:
                    article = data.get("article")

                    post = {
                        "_id": post_id,
                        "title": title,
                        "article": article,
                    }
                else:
                    return Response({'error': 'Invalid data format'}, status=400)
            a = random.randint(1, 9)

            max_characters = 200
            if 'paragraph' in data:
                paragraph = data.get('paragraph')
                truncated_paragraph = paragraph[:max_characters]
                query = truncated_paragraph
            elif 'article' in data:
                article = data.get("article")
                truncated_article = article[:max_characters]
                query = truncated_article
            else:
                return Response({'error': 'No query was used'}, status=400)
            output = []
            api = API(PEXELS_API_KEY)
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
            username = request.session['portfolio_info'][0]['portfolio_name']
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
                             }
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
                credit_handler = CreditHandler()
                credit_handler.consume_step_3_credit(request)
                response_data = {
                    "message": "Post saved successfully",
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class EditPostView(AuthenticatedBaseView):
    def get(self, request, post_id, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        image_url = request.GET.get('image', None)
        if 'session_id' and 'username' in request.session:
            post_data = {
                "product_name": "Social Media Automation",
                "details": {
                    "_id": post_id,
                    "field": {"_id": post_id},
                    "image": image_url,
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
            print(token)
            response_data = {
                'redirect_url': f'https://ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token={str(token)}'
            }
            cache_key = f'post_id{str(post_id)}'
            if cache.get(cache_key):
                response_data['updated_post_details'] = cache.get(cache_key)
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, post_id, *args, **kwargs):
        """ 
        This point saves a post
        """
        token = request.data.get('token', None)
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = decode_json_data(token)

            serializer = EditPostSerializer(data=decoded_token)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            validated_data = serializer.validated_data

            updated_data = {
                'post_id': post_id,
                'title': validated_data['title'],
                'paragraph': validated_data['paragraph'],
                'image': validated_data['image'],
            }

            cache_key = f'post_id{str(post_id)}'
            cache.set(cache_key, updated_data, timeout=3600)

            # Return the response
            response_data = {'message': 'Post has been updated'}
            return Response(response_data, status=status.HTTP_201_CREATED)

        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.DecodeError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


'''step-3 Ends here'''

'''step-4 starts here'''


@method_decorator(csrf_exempt, name='dispatch')
class AryshareProfileView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        event_id = create_event()['event_id']
        user = request.session['portfolio_info'][0]['portfolio_name']
        payload = {'title': user}
        headers = {'Content-Type': 'application/json',
                   'Authorization': "Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G"}

        r = requests.post('https://app.ayrshare.com/api/profiles/profile',
                          json=payload,
                          headers=headers)
        data = r.json()
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
            return Response("Social media profile created")


@method_decorator(csrf_exempt, name='dispatch')
class LinkMediaChannelsView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        if not check_if_user_is_owner_of_organization(request):
            return Response({'message': 'Only the owner of the organization can connect/add social media channels'})
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
        return redirect(link['url'])


class ChannelViewAccess(generics.CreateAPIView):
    serializer_class = ChannelAccessSerializer

    def post(self, request, *args, **kwargs):
        portfolio_info_list = request.session['portfolio_info']
        username = request.session['username']

        if not portfolio_info_list or not username:
            return Response({'error': 'Invalid request'}, status=400)

        is_owner = False
        is_team_member = False

        is_owner = False
        is_team_member = False

        for portfolio_info in portfolio_info_list:
            if 'member_type' in portfolio_info and 'username' in portfolio_info:
                if portfolio_info['member_type'] == 'owner' and username in portfolio_info['username']:
                    is_owner = True
                elif portfolio_info['member_type'] == 'team_member' and portfolio_info['username'] == username:
                    is_team_member = True

        access = {
            'is_owner': is_owner,
            'is_team_member': is_team_member
        }

        return Response(access)


@method_decorator(csrf_exempt, name='dispatch')
class SocialMediaChannelsView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        if not check_if_user_is_owner_of_organization(request):
            return Response({'message': 'Only the owner of the organization can connect and view channels of an organization'})
        step_2_manager = Step2Manager()

        try:
            title = request.session['portfolio_info'][0]['owner_name']
        except KeyError:
            title = request.session['portfolio_info'][0]['portfolio_name']

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

        return Response(context_data)

    def post(self, request, *args, **kwargs):
        step_2_manager = Step2Manager()
        username = request.session['username']
        is_current_user_owner = False
        if request.session['portfolio_info'][0]['member_type'] == 'owner':
            is_current_user_owner = True

        if not is_current_user_owner:
            messages.error(
                request, 'You are permitted to perform this action!')
            messages.error(
                request, 'Only the owner of the organization can connect to social media channels')
            return Response({'message': 'Only the owner of the organization can connect to social media channels'})
        email = request.session['userinfo']['email']
        name = f"{str(request.session['userinfo']['first_name'])} {str(request.session['userinfo']['last_name'])}"
        org_id = request.session['org_id']
        data = {
            'username': username,
            'email': email,
            'name': name,
            'org_id': org_id,
        }
        print("Here I have", data)
        step_2_manager.create_social_media_request(data)
        return Response(
            {'message': 'Social media request was saved successfully. Wait for the admin to accept the request'})


@method_decorator(csrf_exempt, name='dispatch')
class AdminApproveSocialMediaRequestView(AuthenticatedBaseView):
    def get(self, request, *args, **kwargs):
        username = request.session.get('username')
        if username != SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME:
            return Response({'message': 'You are not authorized to access this page'}, status=HTTP_401_UNAUTHORIZED)

        step_2_manager = Step2Manager()
        social_media_requests = step_2_manager.get_all_unapproved_social_media_request(
            {
                'org_id': request.session.get('org_id'),
            }
        )
        context_data = {
            'social_media_requests': list(
                social_media_requests.values('id', 'username', 'email', 'name', 'org_id', 'is_approved'))
        }

        return Response(context_data)

    def post(self, request, *args, **kwargs):
        username = request.session.get('username')

        if username != SOCIAL_MEDIA_ADMIN_APPROVE_USERNAME:
            return Response({'message': 'You are not authorized to access this page'}, status=HTTP_401_UNAUTHORIZED)
        step_2_manager = Step2Manager()
        serializer = SocialMediaRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        data = {
            'social_media_request_id': serializer.validated_data['social_media_request_id']
        }
        approve = False
        if serializer.validated_data.get('approve') == 'Approve Selected':
            approve = True
        elif serializer.validated_data.get('approve') == 'Reject Selected':
            approve = False
        elif serializer.validated_data.get('approve') == 'Approve All':
            approve = True
            social_media_requests = step_2_manager.get_all_unapproved_social_media_request(
                {'org_id': request.session.get('org_id'), }
            )
            data['social_media_request_id'] = social_media_requests.values_list(
                'id', flat=True)
        data['is_approved'] = approve
        step_2_manager.update_social_media_request_status(data)
        return Response(
            {'message': 'Status of social media has been updated successfully'})


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
        username = request.session['portfolio_info'][0]['portfolio_name']
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
                pass
            return Response(response_data)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


def update_most_recent(pk):
    url = "http://uxlivinglab.pythonanywhere.com"
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
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
    try:
        r1 = requests.post('https://app.ayrshare.com/api/post',
                           json=payload,
                           headers=headers)
        print(r1.json())
        response_data = r1.json()
        org_id = request.session.get('org_id')
        save_profile_key_to_post(
            profile_key=key,
            post_id=post_id,
            post_response=response_data,
            org_id=org_id,
        )
        if response_data['status'] == 'error':
            return {'success': False, 'error_message': 'Error in posting'}
        elif response_data['status'] == 'success' and 'warnings' not in response_data:
            update_most_recent(post_id)
            credit_handler = CreditHandler()
            credit_handler.consume_step_4_credit(request)
            update = update_most_recent(post_id)
            return {'success': True, 'message': 'Successfully Posted'}
        else:
            warnings = [warning['message']
                        for warning in response_data['warnings']]
            return {'success': False, 'error_message': warnings}
    except Exception as e:
        return {'success': False, 'error_message': str(e)}


def api_call_schedule(postes, platforms, key, image, request, post_id, formart):
    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               'scheduleDate': str(formart),
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}
    try:
        r1 = requests.post('https://app.ayrshare.com/api/post',
                           json=payload,
                           headers=headers)
        print(r1.json())
        response_data = r1.json()
        org_id = request.session.get('org_id')
        save_profile_key_to_post(
            profile_key=key,
            post_id=post_id,
            post_response=response_data,
            org_id=org_id,
        )
        if response_data['status'] == 'error':
            return {'success': False, 'error_message': 'Error in posting'}
        elif response_data['status'] == 'success' and 'warning' not in response_data:
            credit_handler = CreditHandler()
            credit_handler.consume_step_4_credit(request)
            update_schedule(post_id)
            return {'success': True, 'message': 'Successfully Scheduled'}
        else:
            warnings = [warning['message']
                        for warning in response_data['warnings']]
            return {'success': False, 'error_message': warnings}
    except Exception as e:
        return {'success': False, 'error_message': str(e)}


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class MediaPostView(AuthenticatedBaseView):
    def post(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            credit_handler = CreditHandler()
            credit_response = credit_handler.check_if_user_has_enough_credits(
                sub_service_id=STEP_4_SUB_SERVICE_ID,
                request=request,
            )

            if not credit_response.get('success'):
                return Response(credit_response, status=HTTP_400_BAD_REQUEST)

            start_datetime = datetime.now()
            data = json.loads(request.body.decode("utf-8"))
            title = data['title']
            paragraph = data['paragraph']
            paragraph2 = paragraph[0:230]
            image = data['image']
            logo = "Created and posted by #samanta #uxlivinglab"
            post_id = data['PK']
            postes_paragraph1 = f"{paragraph[0:2000]}."
            postes_paragraph2 = logo
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
            combined_social_channels = platforms + splited
            is_owner = check_if_user_is_owner_of_organization(request)
            if not is_owner:
                org_id = request.session['org_id']
                user_info = fetch_organization_user_info(org_id)

                if not user_info['data']:
                    data = {
                        'not_approved_channels': combined_social_channels
                    }
                    return Response(data)

                portfolio_code = request.session['portfolio_info'][0].get(
                    'portfolio_code')
                portfolio_code_channel_mapping = user_info['data'][0].get(
                    'portfolio_code_channel_mapping', {})
                approved_social_accounts = portfolio_code_channel_mapping.get(
                    portfolio_code, [])

                if not (set(combined_social_channels).issubset(set(approved_social_accounts))):
                    not_approved_channels = [
                        x for x in combined_social_channels if x not in approved_social_accounts]
                    data = {
                        'not_approved_channels': not_approved_channels
                    }
                    return Response(data)
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
            return Response('Successfully Posted')
        else:
            return Response('social_media_channels')


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class MediaScheduleView(AuthenticatedBaseView):
    def post(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id', None)
        if 'session_id' and 'username' in request.session:
            credit_handler = CreditHandler()
            credit_response = credit_handler.check_if_user_has_enough_credits(
                sub_service_id=STEP_4_SUB_SERVICE_ID,
                request=request,
            )
            if not credit_response.get('success'):
                return Response(credit_response, status=HTTP_400_BAD_REQUEST)
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
            postes_paragraph1 = f"{paragraph[0:2000]}."
            postes_paragraph2 = logo
            postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"
            twitter_post_paragraph1 = f"{paragraph2[0:235]}."
            twitter_post_paragraph2 = logo
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
            combined_social_channels = platforms + splited
            is_owner = check_if_user_is_owner_of_organization(request)
            if not is_owner:
                org_id = request.session['org_id']
                user_info = fetch_organization_user_info(org_id)

                if not user_info['data']:
                    data = {
                        'not_approved_channels': combined_social_channels
                    }
                    return Response(data, )

                portfolio_code = request.session['portfolio_info'][0].get(
                    'portfolio_code')
                portfolio_code_channel_mapping = user_info['data'][0].get(
                    'portfolio_code_channel_mapping', {})
                approved_social_accounts = portfolio_code_channel_mapping.get(
                    portfolio_code, [])

                if not (set(combined_social_channels).issubset(set(approved_social_accounts))):
                    not_approved_channels = [
                        x for x in combined_social_channels if x not in approved_social_accounts]
                    data = {
                        'not_approved_channels': not_approved_channels
                    }
                    return Response(data, )

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
                executor.map(lambda f: api_call_schedule(*f), arguments)
                end_datetime = datetime.now()
                time_taken = end_datetime - start_datetime
                print(f"Total time taken: {time_taken}")
            return Response('Successfully Scheduled')


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class UnScheduledView(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' in request.session and 'username' in request.session:
            profile = request.session['operations_right']
            username = request.session['portfolio_info'][0]['portfolio_name']
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
            user = str(request.session['user_id'])
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
            return Response({'detail': 'Unauthorized'}, status=401)


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
            credit_handler = CreditHandler()
            credit_handler.consume_step_5_credit(request)
            return Response(response)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class Comments(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            credit_handler = CreditHandler()
            credit_response = credit_handler.check_if_user_has_enough_credits(
                sub_service_id=COMMENTS_SUB_SERVICE_ID,
                request=request,
            )
            if not credit_response.get('success'):
                return Response(credit_response, status=HTTP_400_BAD_REQUEST)
            user_id = request.session['user_id']
            org_id = request.session.get('org_id')
            recent_posts = get_most_recent_posts(org_id=org_id)
            scheduled_post = get_scheduled_posts(org_id=org_id)
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
            credit_handler = CreditHandler()
            credit_handler.consume_step_5_credit(request)
            return Response(response)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''Comments section ends here'''

'''user settings starts here'''


class FacebookFormAPI(AuthenticatedBaseView):

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
            return Response({'error': 'Failed to update Facebook details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            return Response({'error': 'Failed to update Facebook details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            return Response({'error': 'Failed to update Instagram details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            return Response({'error': 'Failed to update Instagram details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        messages.success(request, "X details updated successfully.")
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
        messages.success(request, "LinkedIn details updated successfully.")
        if response.status_code == 200:
            return Response({'message': 'LinkedIn details updated successfully'})
        else:
            return Response({'error': 'Failed to update LinkedIn details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        messages.success(request, "LinkedIn details updated successfully.")
        if response.status_code == 200:
            return Response({'message': 'LinkedIn details updated successfully'})
        else:
            return Response({'error': 'Failed to update LinkedIn details'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            messages.success(request, "Youtube details updated successfully.")
            if response.status_code == 200:
                return Response({'message': 'Youtube details updated successfully'})
            else:
                return Response({'error': 'Failed to update Youtube details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            messages.success(request, "Youtube details updated successfully.")
            if response.status_code == 200:
                return Response({'message': 'Youtube details updated successfully'})
            else:
                return Response({'error': 'Failed to update Youtube details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            messages.success(
                request, "Pinterest details updated successfully.")
            if response.status_code == 200:
                return Response({'message': 'Pinterest details updated successfully'})
            else:
                return Response({'error': 'Failed to update Pinterest details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            messages.success(
                request, "Pinterest details updated successfully.")
            if response.status_code == 200:
                return Response({'message': 'Pinterest details updated successfully'})
            else:
                return Response({'error': 'Failed to update Pinterest details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            if response.status_code == 200:
                return Response({'message': 'Client details updated successfully'})
            else:
                return Response({'error': 'Failed to update Client details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            if response.status_code == 200:
                return Response({'message': 'Client details updated successfully'})
            else:
                return Response({'error': 'Failed to update Client details'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            messages.success(
                request, "target_cities details updated successfully.")
            return Response({'detail': 'Targeted cities updated successfully'}, status=status.HTTP_200_OK)


class MentionView(AuthenticatedBaseView):
    def get(self, request):
        session_id = request.GET.get("session_id", None)
        if 'session_id' in request.session and 'username' in request.session:
            user_data = fetch_user_info(request)
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
                },
                "update_field": {
                    "mentions_list": mentions_list,
                },
                "platform": "bangalore"
            }

            data = json.dumps(payload)
            response = requests.post(url, headers=headers, data=data)

            return Response({'detail': 'Hashtags and Mentions created successfully'}, status=status.HTTP_201_CREATED)


class GroupHashtagView(AuthenticatedBaseView):
    def get(self, request):
        org_id = request.session['org_id']
        data = {
            'org_id': org_id,
        }
        group_hastag_list = filter_group_hashtag(data)
        return Response({'group_hastag_list': group_hastag_list})

    def post(self, request):
        serializer_data = GroupHashtagSerializer(data=request.data)
        if not serializer_data.is_valid():
            return Response(serializer_data.errors, status=HTTP_400_BAD_REQUEST)
        org_id = request.session['org_id']
        session_id = request.GET.get("session_id", None)
        group_name = serializer_data.validated_data['group_name']
        hashtags = serializer_data.validated_data['hashtags']
        client_admin_id = request.session['userinfo']['client_admin_id']

        create_hashtag_data = {
            'user_id': request.session.get('user_id'),
            'session_id': session_id,
            'org_id': org_id,
            'client_admin_id': client_admin_id,
            'group_name': group_name,
            'hashtags': hashtags,
        }
        response = create_group_hashtags(create_hashtag_data)
        return Response({'detail': 'Hashtags and Mentions created successfully'}, status=status.HTTP_201_CREATED)


class GroupHashtagDetailView(AuthenticatedBaseView):
    def get(self, request, group_hashtag_id):
        org_id = request.session['org_id']
        data = {
            'org_id': org_id,
            'group_hashtag_id': group_hashtag_id,
        }
        group_hashtag_list = filter_group_hashtag(data)
        if not group_hashtag_list:
            return Response({'message': 'Item not found'}, status=HTTP_404_NOT_FOUND)
        return Response(group_hashtag_list[0])

    def post(self, request, group_hashtag_id):

        serializer_data = GroupHashtagSerializer(data=request.data)
        if not serializer_data.is_valid():
            return Response(serializer_data.errors, status=HTTP_400_BAD_REQUEST)

        group_name = serializer_data.validated_data['group_name']
        hashtags = serializer_data.validated_data['hashtags']
        update_type = request.GET.get('update_type', 'append')
        org_id = request.session['org_id']

        update_data = {
            'group_hashtag_id': group_hashtag_id,
            'group_name': group_name,
            'hashtags': hashtags,
            'update_type': update_type,
            'org_id': org_id,
        }

        response = update_group_hashtags(update_data)
        return Response({'detail': 'Group hashtag has been updated successfully'}, status=status.HTTP_201_CREATED)


class MentionUpdateView(AuthenticatedBaseView):
    def put(self, request):
        session_id = request.GET.get("session_id", None)
        if 'session_id' in request.session and 'username' in request.session:
            if request.method != "PUT":
                return JsonResponse({'detail': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                mentions_list = request.data.get('mentions_list')
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
                    },
                    "platform": "bangalore"
                }

                data = json.dumps(payload)
                response = requests.post(url, headers=headers, data=data)
                user_data = fetch_user_info(request)
                return Response({'detail': 'Hashtags and Mentions updated successfully'}, status=status.HTTP_200_OK)


class UserApprovalView(AuthenticatedBaseView):

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
        response_data_json = json.loads(response.json())
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
            data = request.data
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
        response_data_json = json.loads(response.json())
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
            response = requests.post(url, headers=headers, json=payload)
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
            return Response({
                'message': 'Details updated successfully',
                "qualitative_categorization": qualitative_categorization,
                "targeted_for": targeted_for,
                "targeted_category": targeted_category,
            }, status=status.HTTP_200_OK)


class SocialMediaPortfolioView(AuthenticatedBaseView):
    def get(self, request):
        if not check_if_user_is_owner_of_organization(request):
            response_data = {
                'message': 'Only the owner of the organization can access this page',
            }
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
        user_portfolio = fetch_user_portfolio_data(request)
        if 'error' in user_portfolio.keys():
            return Response(user_portfolio, status=status.HTTP_401_UNAUTHORIZED)
        org_portfolios = user_portfolio['selected_product']['userportfolio']
        org_id = request.session['org_id']
        user_portfolio_pd = pd.DataFrame(org_portfolios)
        portfolio_pd = pd.DataFrame(
            [user_portfolio_pd['portfolio_name'], user_portfolio_pd['portfolio_code'], ]).transpose()
        user_info = fetch_organization_user_info(org_id)
        portfolio_code_channel_mapping = user_info['data'][0].get(
            'portfolio_code_channel_mapping', {})
        portfolio_info_list = portfolio_pd.to_dict('records')

        portfolio_info_channel_list = []
        print(user_info)

        for portfolio_info in portfolio_info_list:
            portfolio_info['channels'] = portfolio_code_channel_mapping.get(portfolio_info.get('portfolio_code'),
                                                                            [])
            portfolio_info_channel_list.append(portfolio_info)
        context_dict = {
            'portfolio_info_list': portfolio_info_channel_list,
        }
        return Response(context_dict)

    def post(self, request):
        if not check_if_user_is_owner_of_organization(request):
            response_data = {
                'message': 'Only the owner of the organization can access this page',
            }
            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)
        serializer = PortfolioChannelsSerializer(data=request.data, many=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        channel_portfolio_list = serializer.validated_data
        portfolio_code_channel_mapping = {}
        org_id = request.session['org_id']

        for channel_portfolio in channel_portfolio_list:
            channels = list(channel_portfolio['channels'])
            portfolio_code = channel_portfolio['portfolio_code']

            if portfolio_code in portfolio_code_channel_mapping.keys():
                channel_list = portfolio_code_channel_mapping[portfolio_code]
                channel_list = channel_list + channels
                portfolio_code_channel_mapping[portfolio_code] = channel_list
            else:
                portfolio_code_channel_mapping[portfolio_code] = channels

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
                "portfolio_code_channel_mapping": portfolio_code_channel_mapping,
                "org_id": org_id,
            },
            "platform": "bangalore"
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.json())
        return Response({'message': 'Portfolio channels saved successfully'})


class FetchUserInfo(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            profile_details = request.session['portfolio_info'][0]['portfolio_name']
            print("Here I have", profile_details)
            user_data = fetch_user_info(request)
            return Response(user_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class ImageLibrary(generics.CreateAPIView):
    serializer_class = ImageUploadSerializer

    def post(self, request):
        session_id = request.GET.get("session_id", None)
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            time = localtime()
            test_date = str(localdate())
            date_obj = datetime.strptime(test_date, '%Y-%m-%d')
            date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
            event_id = create_event()['event_id']
            image = data.get("image")
            if not image:
                return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

            url = "http://uxlivinglab.pythonanywhere.com"

            uploaded_image = download_and_upload_users_image(image_url=image)

            if not uploaded_image:
                return Response({"error": "Failed to process the image"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            image = uploaded_image.get('file_url')

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
                    "user_id": request.session.get('user_id'),
                    "session_id": session_id,
                    "eventId": event_id,
                    "org_id": request.session.get('org_id'),
                    'client_admin_id': request.session.get('userinfo', {}).get('client_admin_id'),
                    "date": date,
                    "time": str(time),
                    "image_library": image,
                },
                "update_field": {
                    "image_library": image,
                },
                "platform": "bangalore"
            }
            headers = {'Content-Type': 'application/json'}
            payload = json.dumps(payload)
            try:
                response = requests.post(url, headers=headers, data=payload)
                if response.status_code == 200:
                    return Response({"message": "Success", "status_code": response.status_code})
                else:
                    return Response({"message": "Failed", "status_code": response.status_code})
            except requests.RequestException as e:
                print({"error": str(e)})
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FetchImages(AuthenticatedBaseView):
    def get(self, request):
        if 'session_id' and 'username' in request.session:
            user_data = fetch_user_info(request)
            image_libraries = [item.get('image_library') for item in user_data.get(
                'data', []) if 'image_library' in item]
            return Response(image_libraries)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class Analytics(generics.CreateAPIView):
    serializer_class = DataSerializer

    def post(self, request):
        if 'session_id' and 'username' in request.session:
            user_id = request.session['user_id']
            key = get_key(user_id)
            data = request.data
            if data:
                second_id = data['id']
                platform = data['platform']
                payload = {
                    'id': second_id,
                    'platforms': platform,
                    'profileKey': key,
                }
                print("payload", payload)
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization':  F"Bearer {str(settings.ARYSHARE_KEY)}"
                }
                r = requests.post('https://app.ayrshare.com/api/analytics/post',
                                  json=payload,
                                  headers=headers)
                r.json()
                analytics_data = r.json()
                print("Analytics Data:", analytics_data)

                response_data = {
                    'platform': platform,
                    'analytics_data': analytics_data
                }

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No post data was provided'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


'''user settings ends here'''
