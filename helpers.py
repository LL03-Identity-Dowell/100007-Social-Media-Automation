import concurrent.futures
import datetime
import json
import requests
from bs4 import BeautifulSoup
from bs4.element import Comment
from django.views.decorators.csrf import csrf_exempt
from mega import Mega
import concurrent.futures
import datetime
import json
from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt

from config_master import UPLOAD_IMAGE_ENDPOINT
from create_article import settings


PRODUCT_NAME = 'Social Media Automation'


def has_access(portfolio_info):

    if not portfolio_info:
        return False
    if portfolio_info[0].get('product') != PRODUCT_NAME:
        return False
    return True


def download_and_upload_image(image_url):
    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()  # Check if the request was successful

        image_content = response.content

        image_name = image_url.split('/')[-1].split('?')[0]

        # Upload the image content to the specified endpoint
        files = {'image': (image_name, image_content)}
        upload_response = requests.post(UPLOAD_IMAGE_ENDPOINT, files=files)

        return upload_response.json()
    except Exception as e:
        print(f"Error: {e}")
        return {'file_url': image_url}


def save_data(collection, document, field, team_member_ID):
    url = "http://uxlivinglab.pythonanywhere.com"

    # adding eddited field in article
    field['edited'] = 0
    field['eventId'] = create_event()['event_id']
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


def get_image(urls):
    url = 'http://100045.pythonanywhere.com/dowellmega'
    headers = {'content-type': 'application/json'}
    response = requests.post(url=url, headers=headers)
    responses = json.loads(response.text)
    mega = Mega()
    m = mega.login(responses["username"], responses["password"])
    file = m.download_url(urls, '/home/100007/create_article/static/photos')
    return file


def save_comments(field):
    print("-------------start save comments function------------")
    print(field)
    with open("save_comments.txt", 'w') as f:
        f.write(str(field))

    url = "http://uxlivinglab.pythonanywhere.com"

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


def create_event():

    url = "https://uxlivinglab.pythonanywhere.com/create_event"
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",  # get from dowell track my ip function
        "login_id": "lav",  # get from login function
        "session_id": "new",  # get from login function
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


@csrf_exempt
def fetch_user_info(request):
    if 'session_id' and 'username' in request.session:
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
        if response.status_code == 200:
            user_data = json.loads(response.json())
            return user_data
        else:
            # where the request to the database fails
            return None
    return "Error Handling your request"


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


def update_aryshare(username, userid):
    headers = {'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}
    r = requests.get('https://app.ayrshare.com/api/profiles', headers=headers)
    socials = ['No account linked']
    for name in r.json()['profiles']:
        try:
            if name['title'] == username:
                socials = name['activeSocialAccounts']
                url = "http://uxlivinglab.pythonanywhere.com"

                payload = json.dumps({
                    "cluster": "socialmedia",
                    "database": "socialmedia",
                    "collection": "ayrshare_info",
                    "document": "ayrshare_info",
                    "team_member_ID": "100007001",
                    "function_ID": "ABCDE",
                    "command": "update",
                    "field": {

                        'user_id': userid
                    },
                    "update_field": {
                        "aryshare_details": {
                            'social_platforms': name['activeSocialAccounts']


                        }


                    },
                    "platform": "bangalore"
                })
                headers = {
                    'Content-Type': 'application/json'
                }

                response = requests.request(
                    "POST", url, headers=headers, data=payload)
                print(name['activeSocialAccounts'])

        except:
            pass

    return (socials)


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
