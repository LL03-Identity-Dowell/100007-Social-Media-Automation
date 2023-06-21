from django.contrib.sessions.models import Session
from create_article.custom_session_backend import CustomSessionStore
from django.shortcuts import render, redirect, HttpResponse
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
import requests
import json
import time
from datetime import datetime
import datetime
from bs4 import BeautifulSoup
from bs4.element import Comment
import wikipediaapi
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta, date
from mega import Mega
from create_article import settings
from pymongo import MongoClient
from django.core.paginator import Paginator
from bson import ObjectId
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.timezone import localdate, localtime
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage, Page
from website.models import Sentences, SentenceResults, SentenceRank, MTopic
import urllib
from urllib.request import urlopen
from django.contrib import messages
from pexels_api import API
import random
from .models import stepFour
from .forms import StepFourForm, VerifyArticleForm
from ayrshare import SocialPost
from django.utils import timezone
# image resizing
import base64
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from pytz import timezone
import pytz
import openai
import re
import os
from create_article.settings import STATIC_ROOT, BASE_DIR
import shutil
import math
import traceback
import urllib.parse


from django.db import transaction

# helper functions

global PEXELS_API_KEY

PEXELS_API_KEY = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'

PRODUCT_NAME = 'Social Media Automation'


def get_image(urls):
    url = 'http://100045.pythonanywhere.com/dowellmega'
    headers = {'content-type': 'application/json'}
    response = requests.post(url=url, headers=headers)
    responses = json.loads(response.text)
    mega = Mega()
    m = mega.login(responses["username"], responses["password"])
    file = m.download_url(urls, '/home/100007/create_article/static/photos')
    return file


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


def save_data(collection, document, field, team_member_ID):
    url = "http://100002.pythonanywhere.com/"

    # adding eddited field in article
    field['edited'] = 0
    field['eventId'] = get_event_id()
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


def save_comments(field):
    print("-------------start save comments function------------")
    print(field)
    with open("save_comments.txt", 'w') as f:
        f.write(str(field))

    url = "http://100002.pythonanywhere.com/"

    payload = json.dumps({
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "comments",
        "document": "comments",
        "team_member_ID": "12345",
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
    print("-------------------end save comments function-----------------")


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
    response_dowell = requests.get(
        'https://100009.pythonanywhere.com/dowellclock')
    data = response_dowell.json()
    return data['t1']


def create_event(request=None):
    """
    This method accepts a django request object as an argument. The argument is optional
    """
    try:
        if request:
            user_info = request.session.get('userinfo')
            ip_address = user_info.get('userIP', '192.168.0.4')
    except:
        ip_address = '192.168.0.4'

    url = "https://uxlivinglab.pythonanywhere.com/create_event"
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": ip_address,  # get from dowell track my ip function
        "login_id": "lav",  # get from login function
        "session_id": "session",  # get from login function
        "processcode": "1",
        "location": "22446576",  # get from dowell track my ip function
        "regional_time": time,
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
        "bookmarks": "a book marks"
    }

    r = requests.post(url, json=data)
    if r.status_code == 201:
        return json.loads(r.text)
    else:
        return json.loads(r.text)['error']


def maintenance(request):
    return render(request, 'maintenance.html')


def has_access(portfolio_info):
    if not portfolio_info:
        return False
    if portfolio_info[0].get('product') != PRODUCT_NAME:
        return True  # Update to return True when the product name doesn't match
    return True


@csrf_exempt
@xframe_options_exempt
def main(request):
    try:
        session_id = request.GET.get("session_id", None)
        # saving the session_id in the custom session store
        # session = CustomSessionStore()
        # session.create()
        # session_id = session.session_key
        user_map = {}
        redirect_to_living_lab = True
        if session_id is not None:
            request.session["session_id"] = session_id
            # First API
            url_1 = "https://100093.pythonanywhere.com/api/userinfo/"
            # headers = {"Authorization": f"Bearer {session_id}"}
            response_1 = requests.post(url_1, data={"session_id": session_id})
            if response_1.status_code == 200 and "portfolio_info" in response_1.json():
                # First API response contains portfolio_info data
                print("You connected from the client admin: ", response_1.text)
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
                # Second API
                url_2 = "https://100014.pythonanywhere.com/api/userinfo/"
                response_2 = requests.post(
                    url_2, data={"session_id": session_id})
                if response_2.status_code == 200 and "portfolio_info" in response_2.json():
                    # Second API response contains portfolio_info data
                    print("You connected from 100014 ", response_2.json())
                    profile_details = response_2.json()
                    request.session['portfolio_info'] = profile_details['portfolio_info']
                    print('This is the portfolio info  is empty for you: ',
                          profile_details['portfolio_info'])
                    print('This is the user the userID: ',
                          profile_details['userinfo']['userID'])
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
            print(user_map)

            # Adding session id to the session
            request.session['session_id'] = session_id
            if username:
                username_with_userID = request.session['username'] = username
                print("Use this to filter out the data for: ",
                      username_with_userID)

            if not has_access(request.session['portfolio_info']):
                return render(request, 'portofolio-logib.html')
            return render(request, 'main.html')
        else:
            # return redirect("https://100014.pythonanywhere.com/?redirect_url=https://100007.pythonanywhere.com")
            return redirect("https://100014.pythonanywhere.com/?redirect_url=http://127.0.0.1:8000/")
    except Exception as e:
        print(str(e))
        return render(request, 'error.html')


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
    session_id = request.GET.get("session_id", None)
    url = 'http://100032.pythonanywhere.com/api/targeted_population/'

    database_details = {
        'database_name': 'mongodb',
        'collection': 'user_info',
        'database': 'social-media-auto',
        'fields': ['_id']
    }

    # number of variables for sampling rule
    number_of_variables = -1

    """
        period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
        if custom is given then need to specify start_point and end_point
        for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
        the the value of that selection in 'm_or_A_value'
        error is the error allowed in percentage
    """

    time_input = {
        'column_name': 'Date',
        'split': 'week',
        'period': 'life_time',
        'start_point': '2021/01/08',
        'end_point': '2023/06/25',
    }

    stage_input_list = [
    ]

    # distribution input
    distribution_input = {
        'normal': 1,
        'poisson': 0,
        'binomial': 0,
        'bernoulli': 0

    }

    request_data = {
        'database_details': database_details,
        'distribution_input': distribution_input,
        'number_of_variable': number_of_variables,
        'stages': stage_input_list,
        'time_input': time_input,
    }

    headers = {'content-type': 'application/json'}

    response = requests.post(url, json=request_data, headers=headers)
    print(response.json())

    # get user_id of user
    user_id = str(request.session['user_id'])
    print(user_id, 'chidi')
    try:
        # get the data in file
        posts = response.json()['normal']['data']
        for values in posts:
            for names in values:
                if names['user_id'] == user_id:
                    status = 'update'
                    print(status)
                    break
                else:
                    status = 'insert'
                    print(status)
    except:
        print('no data')

    return render(request, 'user_approval.html', {'status': status})
    # return HttpResponseRedirect(reverse("generate_article:main-view"))


@csrf_exempt
@xframe_options_exempt
def user_approval_form(request):
    session_id = request.GET.get("session_id", None)
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:client"))
    else:
        topic = request.POST.get("topic")
        article = request.POST.get("article")
        post = request.POST.get("post")
        schedule = request.POST.get("schedule")
        time = localtime()
        test_date = str(localdate())
        date_obj = datetime.strptime(test_date, '%Y-%m-%d')
        date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        event_id = create_event(request)['event_id']

        url = "http://100002.pythonanywhere.com/"

        payload = json.dumps({
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
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        print(event_id)

        return HttpResponseRedirect(reverse("generate_article:client"))


@csrf_exempt
@xframe_options_exempt
def user_approval_form_update(request):
    session_id = request.GET.get("session_id", None)
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:client"))
    else:
        topic = request.POST.get("topic")
        article = request.POST.get("article")
        post = request.POST.get("post")
        schedule = request.POST.get("schedule")
        time = localtime()
        test_date = str(localdate())
        date_obj = datetime.strptime(test_date, '%Y-%m-%d')
        date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        event_id = create_event(request)['event_id']

        url = "http://100002.pythonanywhere.com/"

        payload = json.dumps({
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
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)

    return HttpResponseRedirect(reverse("generate_article:client"))


@csrf_exempt
@xframe_options_exempt
def social_media_channels(request):
    return render(request, 'social_media_channels.html')


@csrf_exempt
@xframe_options_exempt
def facebook(request):
    social = SocialPost('8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G')
    # Post to Platforms Twitter, Facebook, and LinkedIn
    postResult = social.post(
        {'post': 'Nice Posting 2', 'platforms': ['facebook']})
    context = {
        'postResult': postResult
    }
    return render(request, 'facebook.html', context)


@csrf_exempt
@xframe_options_exempt
def facebook_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        url = "http://100002.pythonanywhere.com/"

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
                "facebook": {
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
        print('page_id:', page_id, 'page_link:', page_link,
              'page_password:', page_password, 'post_no:', posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def insta(request):
    return render(request, 'insta.html')


@csrf_exempt
@xframe_options_exempt
def insta_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        url = "http://100002.pythonanywhere.com/"

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

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        print(page_id, page_link, page_password, posts_no)

        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))


@csrf_exempt
@xframe_options_exempt
def twitter(request):
    return render(request, 'twitter.html')


@csrf_exempt
@xframe_options_exempt
def twitter_form(request):
    if request.method != "POST":
        return HttpResponseRedirect(reverse("generate_article:social_media_channels"))
    else:
        page_id = request.POST.get("page_id")
        page_link = request.POST.get("page_link")
        page_password = request.POST.get("page_password")
        posts_no = request.POST.get("posts_no")

        url = "http://100002.pythonanywhere.com/"

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

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
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

        url = "http://100002.pythonanywhere.com/"

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

        url = "http://100002.pythonanywhere.com/"

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

        url = "http://100002.pythonanywhere.com/"

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


@csrf_exempt
@xframe_options_exempt
def topics(request):
    return render(request, 'topics.html')


# @csrf_exempt
# @xframe_options_exempt
# def unscheduled(request):
#     if 'session_id' and 'username' in request.session:
#         return render(request, 'unscheduled.html')
#     else:
#         return render(request, 'error.html')

@csrf_exempt
@xframe_options_exempt
def unscheduled(request):
    if 'session_id' and 'username' in request.session:
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'step4_data',
            'database': 'social-media-auto',
                        'fields': ['eventId']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        """
			period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
			if custom is given then need to specify start_point and end_point
			for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
			the the value of that selection in 'm_or_A_value'
			error is the error allowed in percentage
		"""

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }

        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }

        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)
        profile = request.session['operations_right']

        post = response.json()['normal']['data']
        # takes in user_id
        user = str(request.session['user_id'])

        # takes in the json data
        datas = post

        posts = response.json()['normal']['data']

        user_id = str(request.session['user_id'])
        post = []
        try:
            for column in posts:
                for row in column:
                    if user_id == str(row['user_id']):
                        data = {'title': row['title'], 'paragraph': row['paragraph'], 'Date': row["date"],
                                'image': row['image'], 'source': row['source'], 'PK': row['_id']}
                        post.append(data)
                        print(profile)

        except:
            pass
        messages.info(
            request, 'Click on post now to choose where to post the articles.')
        return render(request, 'unscheduled.html', {'post': post, 'profile': profile})
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
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'step4_data',
            'database': 'social-media-auto',
            'fields': ['eventId']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        """
            period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
            if custom is given then need to specify start_point and end_point
            for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
            the the value of that selection in 'm_or_A_value'
            error is the error allowed in percentage
        """

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }

        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }

        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)
        posts = response.json()['normal']['data']
        print(posts)
        user_id = str(request.session['user_id'])
        status = 'scheduled'
        post = []
        try:
            for column in posts:
                for row in column:
                    if user_id == str(row['user_id']):
                        try:
                            if status == row['status']:
                                data = {'title': row['title'], 'paragraph': row['paragraph'], 'image': row['image'], 'pk': row['_id'],
                                        'source': row['source'], 'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date()}
                                post.append(data)

                        except:
                            pass
        except:
            pass
        return render(request, 'scheduled.html', {'post': post})
    else:
        return render(request, 'error.html')


@xframe_options_exempt
def index(request):
    if 'session_id' and 'username' in request.session:
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'socialmedia',
            'database': 'social-media-auto',
            'fields': ['email', 'subject']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        """
            period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
            if custom is given then need to specify start_point and end_point
            for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
            the the value of that selection in 'm_or_A_value'
            error is the error allowed in percentage
        """

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }

        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }

        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)
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

            datas = response.json()['normal']['data'][0]

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
        messages.info(
            request, 'Step 3: Generate articles for the sentences you created.')
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
                                               "eventId": create_event(request)['event_id'],
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
                                           "eventId": create_event(request)['event_id'],
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
                                                   "eventId": create_event(request)['event_id'],
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
                                                           "eventId": create_event(request)['event_id'],
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
                                                   "eventId": create_event(request)['event_id'],
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
                                                           "eventId": create_event(request)['event_id'],
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
                return HttpResponseRedirect(reverse("generate_article:main-view"))
            else:
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article_subject': article_subject[0], 'source_subject': page.fullurl
                # , 'article_AI': para, 'AI_src': src})
                return HttpResponseRedirect(reverse("generate_article:main-view"))
    else:
        print("For Title: "+title+" Page exists.")
        article = page.text
        article = article.split("See also")
        save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                               "session_id": session_id,
                                               "eventId": create_event(request)['event_id'],
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
                                                       "eventId": create_event(request)['event_id'],
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
        return HttpResponseRedirect(reverse("generate_article:main-view"))


@csrf_exempt
@xframe_options_exempt
def generate_article(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' in request.session and 'username' in request.session:
        if request.method != "POST":
            return HttpResponseRedirect(reverse("generate_article:main-view"))
        else:
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

            # Set your OpenAI API key here
            openai.api_key = "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"

            # Build prompt
            prompt_limit = 280
            prompt = f"Write an article about {RESEARCH_QUERY} that discusses {subject} using {verb} in the {target_industry} industry."[
                :prompt_limit] + "..."

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

            sources = urllib.parse.unquote("https://openai.com")
            matches = re.findall(r'(https?://[^\s]+)', article)
            for match in matches:
                sources += match.strip() + '\n'

            try:
                with transaction.atomic():
                    event_id = create_event(request)['event_id']
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
                        "paragraph": '',
                        "source": sources,
                        "subject": subject,
                        "citation_and_url": sources,
                    }
                    save_data('step2_data', 'step2_data',
                              step2_data, '9992828281')

                messages.success(
                    request, 'Article has been generated successfully. Click on step 3 to post the article')
                return HttpResponseRedirect(reverse("generate_article:main-view"))
            except:
                return render(request, 'article/article.html', {'message': "Article did not save successfully.", 'title': RESEARCH_QUERY})
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
                                                           "eventId": create_event(request)['event_id'],
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
                                                                   "eventId": create_event(request)['event_id'],
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
                print("Using subject: " + subject + " to create an article.")
                page = wiki_language.page(title_sub_verb)
                if page.exists() == False:
                    print("Page - Exists: %s" % page.exists())
                    message = "Article for Title " + title_sub_verb + \
                        " and Title "+subject+" does not exist."
                    return render(request, 'article/article.html', {'message': message})
                else:
                    article_subject = page.text
                    print(article_subject)
                    article_subject = article_subject.split("See also")
                    save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                           "session_id": session_id,
                                                           "eventId": create_event(request)['event_id'],
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
                                                                   "eventId": create_event(request)['event_id'],
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
                        # return render(request, 'article/article.html',{'message': "Article using verb and subject saved Successfully.", 'article_verb': article_sub_verb[0], 'source_verb': source_verb,
                        # 'article': article_subject[0], 'source': page.fullurl,  'title': title})
                        return HttpResponseRedirect(reverse("generate_article:main-view"))

                    else:
                        # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article_subject[0], 'source': page.fullurl,  'title': title})
                        messages.success(
                            request, 'Article has been generated successfully. Click step 3 to post the article')
                        return HttpResponseRedirect(reverse("generate_article:main-view"))
            else:
                print("For Title: "+title+" Page exists.")
                article = page.text
                article = article.split("See also")
                save_data('step2_data', "step2_data", {"user_id": request.session['user_id'],
                                                       "session_id": session_id,
                                                       "eventId": create_event(request)['event_id'],
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
                                                               "eventId": create_event(request)['event_id'],
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
                # return render(request, 'article/article.html',{'message': "Article saved Successfully.", 'article': article, 'source': page.fullurl,  'title': title})
                messages.success(
                    request, 'Article has been generated successfully. Click step 3 to post the article')
                return HttpResponseRedirect(reverse("generate_article:main-view"))
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
                first_para = paragraph[0].replace(" ", "")
                last_para = paragraph[-1].replace(" ", "")
                if first_para in text_from_page and last_para in text_from_page:
                    print("Article Verified")
                    message = "Article Verified, "
                    for i in range(len(paragraph)):

                        # check for empty paragraph
                        if paragraph[i] == "":
                            continue
                        # saving paragraphs in article
                        save_data('step3_data', 'step3_data', {"user_id": request.session['user_id'],
                                                               "session_id": session_id,
                                                               "eventId": create_event(request)['event_id'],
                                                               'client_admin_id': request.session['userinfo']['client_admin_id'],
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
                                                               "eventId":  create_event(request)['event_id'],
                                                               'client_admin_id': request.session['userinfo']['client_admin_id'],
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
                                                           "eventId": create_event(request)['event_id'],
                                                           'client_admin_id': request.session['userinfo']['client_admin_id'],
                                                           "title": title,
                                                           "target_industry": target_industry,
                                                           "paragraph": article,
                                                           "source": source,
                                                           'subject': subject,
                                                           # 'dowelltime': dowellclock
                                                           }, "9992828281")
                    print("Article saved successfully")
                    message = message + "Article saved successfully"
                    return HttpResponseRedirect(reverse("generate_article:main-view"))
                else:
                    print("Article Not Verified")
                    message = "Article not Verified."
                    print(text_from_page_space)
                    return render(request, 'article/article.html', {'message': message, 'article': article, 'source': source, 'title': title})
    else:
        return render(request, 'error.html')


@xframe_options_exempt
def list_article(request):
    # return HttpResponse(request.session.get('user_name'))
    if 'session_id' and 'username' in request.session:
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'step3_data',
            'database': 'social-media-auto',
            'fields': ['_id']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        """
            period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
            if custom is given then need to specify start_point and end_point
            for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
            the the value of that selection in 'm_or_A_value'
            error is the error allowed in percentage
        """

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }

        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }

        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)

        print(response)

        post = response.json()['normal']['data']
        # takes in user_id
        user = str(request.session['user_id'])
        print(user)
        # takes in the json data
        datas = post

        posts = []
        # iterates through the json file

        for row in datas:
            for data in row:
                idd = str(data['user_id'])
                if user in idd:
                    # picks out the data
                    articles = {'title': data.get('title'), 'paragraph': data.get(
                        'paragraph'), 'source': data.get('source')}
                    # appends articles to posts
                    posts.append(articles)
                else:
                    pass

        messages.info(
            request, 'Almost there. Click view artcle to finilize the article before posting')

        return render(request, 'post_list.html', {'posts': posts})
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
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'qual_cat',
            'database': 'social-media-auto',
            'fields': ['category']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }

        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }
        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)
        print(response)
        profile = request.session['operations_right']
        categ = response.json()['normal']['data']
        print(categ)
        categories = []
        for row in categ:
            for data in row:
                for key, value in data.items():
                    if key == 'category':
                        categories.append(value)
        if request.method != "POST":
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
        images = output[1]
        print(profile)

        return render(request, 'post_detail.html', {'post': post, 'categories': categories, 'images': images, 'profile': profile})
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
        test_date = str(localdate())
        date_obj = datetime.strptime(test_date, '%Y-%m-%d')
        date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        eventId = create_event(request)['event_id'],
        if request.method == "POST":
            title = request.POST.get("title")
            paragraph = request.POST.get("text")
            source = request.POST.get("source")
            # target_industry = request.POST.get("p-content")
            qualitative_categorization = request.POST.get(
                "qualitative_categorization")
            targeted_for = request.POST.get("targeted_for")
            designed_for = request.POST.get("designed_for")
            targeted_category = request.POST.get("targeted_category")
            image = request.POST.get("images")
            # dowellclock = get_dowellclock(),

            url = "http://100002.pythonanywhere.com/"

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
                    "paragraph": paragraph,
                    "source": source,
                    "qualitative_categorization": qualitative_categorization,
                    "targeted_for": targeted_for,
                    "designed_for": designed_for,
                    "targeted_category": targeted_category,
                    "image": image,
                    "date": date,
                    "time": str(time),
                    "status": ""
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
        return redirect('/schedule')
    else:
        return render(request, 'error.html')


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

# Added view function for address page


def address(request):
    return render(request, 'address.html')


@csrf_exempt
@xframe_options_exempt
def most_recent(request):
    if 'session_id' and 'username' in request.session:
        url = 'http://100032.pythonanywhere.com/api/targeted_population/'

        database_details = {
            'database_name': 'mongodb',
            'collection': 'step4_data',
            'database': 'social-media-auto',
            'fields': ['eventId']
        }

        # number of variables for sampling rule
        number_of_variables = -1

        """
            period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
            if custom is given then need to specify start_point and end_point
            for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
            the the value of that selection in 'm_or_A_value'
            error is the error allowed in percentage
        """

        time_input = {
            'column_name': 'Date',
            'split': 'week',
            'period': 'life_time',
            'start_point': '2021/01/08',
            'end_point': '2022/06/25',
        }

        stage_input_list = [
        ]

        # distribution input
        distribution_input = {
            'normal': 1,
            'poisson': 0,
            'binomial': 0,
            'bernoulli': 0

        }
        request_data = {
            'database_details': database_details,
            'distribution_input': distribution_input,
            'number_of_variable': number_of_variables,
            'stages': stage_input_list,
            'time_input': time_input,
        }

        headers = {'content-type': 'application/json'}

        response = requests.post(url, json=request_data, headers=headers)
        posts = response.json()['normal']['data']
        print(posts)
        user_id = str(request.session['user_id'])
        status = 'posted'
        post = []
        try:
            for column in posts:
                for row in column:
                    if user_id == str(row['user_id']):
                        try:
                            if status == row['status']:
                                data = {'title': row['title'], 'paragraph': row['paragraph'], 'Date': datetime.strptime(
                                    row["date"][:10], '%Y-%m-%d').date(), 'image': row['image'], 'source': row['source']}
                                post.append(data)
                        except:
                            pass
        except:
            print('no post')
        context = {
            'post': post
        }
        return render(request, 'most_recent.html', context)
    else:
        return render(request, 'error.html')


@csrf_exempt
def Media_Post(request):
    session_id = request.GET.get('session_id', None)
    if 'session_id' and 'username' in request.session:

        if request.method == "POST":
            facebook = request.POST.get("facebook")
            paragraph = request.POST.get("paragraph")
            twitter = request.POST.get("twitter")
            linkedin = request.POST.get("linkedin")
            instagram = request.POST.get("instagram")
            youtube = request.POST.get("youtube")
            image = request.POST.get("image")
            title = request.POST.get("title")
            datetime2 = request.POST.get("datetime")
            Post_id = request.POST.get("post_id")
            posts = title + ":" + paragraph
            timezone = request.session['timezone']
            "formarting time for scheduling"
            if datetime2 != "" or None:
                strDatetime = str(datetime2)
                myDatetime = strDatetime + ":00Z"
                formart = datetime.strptime(myDatetime, "%Y-%m-%dT%H:%M:%SZ")
                current_time = pytz.timezone(timezone)
                localize = current_time.localize(formart)
                utc = pytz.timezone('UTC')
                scheduled = localize.astimezone(utc)
                string = str(scheduled)[:-6]
                Isoformart = datetime.strptime(
                    string, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
                schedule = str(Isoformart)
                "posting to Various social media"
                social = SocialPost('8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G')
                postitems = social.post({'post': posts, 'platforms': [
                                        linkedin, facebook, instagram], 'mediaUrls': [image], 'scheduleDate': schedule})
                postitems1 = social.post({'post': posts[:280], 'platforms': [
                                         twitter], 'mediaUrls': [image], 'scheduleDate': schedule})

                print(postitems)
                print(postitems1)
                url = "http://100002.pythonanywhere.com/"

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
                            '_id': Post_id
                        },
                        "update_field":
                        {
                            "status": 'scheduled'
                        },
                        "platform": "bangalore"
                    })
                headers = {'Content-Type': 'application/json'}
                response = requests.request(
                    "POST", url, headers=headers, data=payload)
                return redirect('/scheduled')
            else:
                social = SocialPost('8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G')
                postitems = social.post(
                    {'post': posts, 'platforms': [linkedin, facebook], 'mediaUrls': [image]})
                postitems1 = social.post({'post': posts[:280], 'platforms': [
                                         twitter, instagram], 'mediaUrls': [image]})
                print(postitems)
                print(postitems1)
                url = "http://100002.pythonanywhere.com/"

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
                            '_id': Post_id
                        },
                        "update_field":
                        {
                            "status": "posted"
                        },
                        "platform": "bangalore"
                    })
                headers = {'Content-Type': 'application/json'}
                response = requests.request(
                    "POST", url, headers=headers, data=payload)
                print(response.text)
                return redirect('/recent')
    else:
        return render(request, 'error.html')


# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def files_ListSearchView(request):
#     if request.method=="POST":
#         search_text = request.POST.get("search_text")
#         # Saving the search parameters on the session
#         request.session['search_text'] = search_text

#     string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
#     connection = MongoClient(string)
#     db = connection['exhibitor_details']
#     collection = db['fs.files']
#     file = []
#     {'$regex' : request.session['search_text'] + '.*'}
#     # for doc in collection.find({"email": request.session['email']}):
#     for doc in collection.find(
#         {"$or":[
#             {"email": request.session['search_text']},
#             # {"name": {'$regex' : request.session['search_text'] + '.*'}},
#             {"name": request.session['search_text']},
#             {"name": request.session['search_text']+' '},
#             {"brand_name": request.session['search_text']},
#             {"brand_name": request.session['search_text']+' '},
#         ]}
#     ):
#         file.append(doc)
#     # print(file)
#     file.reverse()
#     db = connection['events_details']
#     collection = db['event_details']
#     paginator = Paginator(file, 100) # Show 100 files per page.
#     page_number = request.GET.get('page')
#     page_obj = paginator.get_page(page_number)
#     for i in range(len(page_obj)):
#         if "BDEventID" in page_obj[i]:
#             event_name = collection.find_one( {"BDEventID" : int(page_obj[i]['BDEventID'])}, {"_id" : 0, "name" :1 } )
#             if event_name is None:
#                 continue
#             page_obj[i]['event_name']=event_name['name']
#     return render(request, 'exhibitors/file_search.html', {'page_obj': page_obj})

# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def files_DetailView(request, id):
#     string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
#     connection = MongoClient(string)
#     db = connection['exhibitor_details']
#     collection = db['fs.files']
#     file = collection.find_one({'_id': ObjectId(id) })
#     return render(request, 'exhibitors/file_detail.html', {'file': file})

# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def file_DeleteView(request, id):
#     string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
#     connection = MongoClient(string)
#     db = connection['exhibitor_details']
#     collection_files = db['fs.files']
#     collection_files.delete_one({'_id': ObjectId(id) })
#     collection_chunks = db['fs.chunks']
#     collection_chunks.delete_many({'files_id': ObjectId(id) })
#     message = "File details with ID:"+id+" has been deleted"
#     return render(request, 'exhibitors/file_message.html', {'message': message})

# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def file_UpdateView(request, id):
#     if request.method!="POST":
#         return HttpResponseRedirect(reverse("exhibitors:file-list-view"))
#     else:
#         BDEventID = request.POST.get("BDEventID")
#         email = request.POST.get("email")
#         name = request.POST.get("name")
#         brand_name = request.POST.get("brand_name")
#         name_incharge = request.POST.get("name_incharge")
#         designation_incharge = request.POST.get("designation_incharge")
#         exhibitor_page_link = request.POST.get("exhibitor_page_link")
#         exhibitor_website = request.POST.get("exhibitor_website")
#         exhibitor_email = request.POST.get("exhibitor_email")
#         exhibitor_both_number = request.POST.get("exhibitor_both_number")
#         exhibitor_city = request.POST.get("exhibitor_city")
#         exhibitor_country = request.POST.get("exhibitor_country")
#         exhibitor_address = request.POST.get("exhibitor_address")
#         type = request.POST.get("type")
#         exhibitor_product = request.POST.get("exhibitor_product")
#         linkedin = request.POST.get("linkedin")
#         twitter = request.POST.get("twitter")
#         facebook = request.POST.get("facebook")
#         instagram = request.POST.get("instagram")
#         youtube = request.POST.get("youtube")
#         tiktok = request.POST.get("tiktok")
#         hashtag = request.POST.get("hashtag")
#         mention = request.POST.get("mention")
#         description = request.POST.get("description")
#         comments = request.POST.get("comments")

#     string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
#     connection = MongoClient(string)
#     db = connection['exhibitor_details']
#     collection_files = db['fs.files']
#     collection_files.update_one({'_id': ObjectId(id) }, {"$set" :{"email": email, "name": name, "brand_name": brand_name,
#             "name_incharge": name_incharge,
#             "designation_incharge": designation_incharge,
#             "exhibitor_page_link": exhibitor_page_link,
#             "exhibitor_website": exhibitor_website,
#             "exhibitor_email": exhibitor_email,
#             "exhibitor_both_number": exhibitor_both_number,
#             "exhibitor_city": exhibitor_city,
#             "exhibitor_country": exhibitor_country,
#             "exhibitor_address": exhibitor_address,
#             "type": type,
#             "exhibitor_product": exhibitor_product,
#             "linkedin": linkedin,
#             "twitter": twitter,
#             "facebook": facebook,
#             "instagram": instagram,
#             "youtube": youtube,
#             "tiktok": tiktok,
#             "hashtag": hashtag,
#             "mention": mention,
#             "BDEventID": BDEventID,
#             "description": description,
#             "comments": comments,}})
#     message = "File details with ID:"+id+" has been updated"
#     return render(request, 'exhibitors/file_message.html', {'message': message})

# @login_required(login_url = '/accounts/login/')
# @user_passes_test(lambda u: u.is_superuser)
# def file_exportview(request):
#     # if request.method!="POST":
#     #     return HttpResponseRedirect(reverse("exhibitors:file-list-view"))
#     # else:
#     email = request.POST.get("email")
#     print(email)
#     # return render(request, 'exhibitors/form1.html')
#     response = HttpResponse(content_type='text/csv')
#     response['Content-Disposition'] = 'attachment; filename="files.csv"'

#     # script_directory = os.path.dirname(os.path.abspath(__file__))
#     # data_file = os.path.join(script_directory, image_name)

#     # writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
#     fields= ['_id','email', 'name', 'brand_name', 'name_incharge', 'designation_incharge', 'exhibitor_page_link', 'exhibitor_website', 'exhibitor_email',
#     'exhibitor_both_number','exhibitor_city','exhibitor_country','exhibitor_address','type','exhibitor_product','linkedin','twitter','facebook','instagram',' youtube',
#     'tiktok','hashtag','mention','BDEventID','description','comments','filename','md5','chunkSize', 'length','uploadDate']
#     writer = csv.DictWriter(response,fieldnames=fields )
#     writer.writeheader()
#     string = 'mongodb+srv://qruser:qr_12345@cluster0.n2ih9.mongodb.net/DB_IMAGE?retryWrites=true&w=majority'
#     connection = MongoClient(string)
#     db = connection['exhibitor_details']
#     collection = db['fs.files']
#     files = []
#     # for doc in collection.find({"email": request.session['email']}):
#     for doc in collection.find({"email": email},{'_id':1, 'filename':1,'md5':1,'chunkSize':1, 'length':1,'uploadDate':1, 'email':1, 'name':1, 'brand_name':1, 'name_incharge':1,
#     'designation_incharge':1, 'exhibitor_page_link':1, 'exhibitor_website':1, 'exhibitor_email':1,
#     'exhibitor_both_number':1,'exhibitor_city':1,'exhibitor_country':1,'exhibitor_address':1,'type':1,'exhibitor_product':1,'linkedin':1,'twitter':1,'facebook':1,'instagram':1,' youtube':1,
#     'tiktok':1,'hashtag':1,'mention':1,'BDEventID':1,'description':1, 'comments':1,}):
#         files.append(doc)
#     files.reverse()

#     # writer.writerow(['_id', 'email', 'name', 'brand_name', 'name_incharge', 'designation_incharge', 'exhibitor_page_link', 'exhibitor_website', 'exhibitor_email',
#     # 'exhibitor_both_number','exhibitor_city','exhibitor_country','exhibitor_address','type','exhibitor_product','linkedin','twitter','facebook','instagram',' youtube',
#     # 'tiktok','hashtag','mention','BDEventID','description','filename','Md5','Chunk Size', 'Length','Upload Date'])

#     for file in files:
#         # print(file)
#         writer.writerow(file)

#     print("response",response)
#     return response
