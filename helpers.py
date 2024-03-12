import datetime
import json
from datetime import datetime

import jwt
import pandas as pd
import requests
from bs4 import BeautifulSoup
from bs4.element import Comment
from django.utils.timezone import localtime, localdate
from django.views.decorators.csrf import csrf_exempt
from mega import Mega

from config_master import UPLOAD_IMAGE_ENDPOINT
from react_version import settings
from react_version.settings import ARYSHARE_KEY

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
        response.raise_for_status()

        image_content = response.content

        image_name = image_url.split('/')[-1].split('?')[0]
        files = {'image': (image_name, image_content)}
        upload_response = requests.post(UPLOAD_IMAGE_ENDPOINT, files=files)

        return upload_response.json()
    except Exception as e:
        return {'file_url': image_url}


def download_and_upload_users_image(image_url):
    try:
        files = {'image': image_url}
        upload_response = requests.post(UPLOAD_IMAGE_ENDPOINT, files=files)
        return upload_response.json()
    except Exception as e:
        return {'error': str(e)}


def save_data(collection, document, field, team_member_ID):
    url = "http://uxlivinglab.pythonanywhere.com"

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
    return response.json()


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


def get_all_automations():
    """
    This method returns all automations
    """
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
        "field": {'has_automation': True},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }

    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)

    if response.status_code != 200:
        return []
    response = json.loads(response.json())

    automations = []
    user_infor_list = response['data']
    for user_infor in user_infor_list:
        if 'automations' in user_infor.keys():
            automations += user_infor['automations']
    return automations


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
    socials = []
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


def post_comment_to_social_media(platforms: list[str], id: str, comment: str, profile_key: str):
    """
    This method posts a comment to a social media post
    """
    payload = {
        'id': id,
        'platforms': platforms,
        'comment': comment
    }
    headers = {'Content-Type': 'application/json',
               'Profile-Key': profile_key,
               'Authorization': f'Bearer {str(ARYSHARE_KEY)}'}

    response = requests.post('https://app.ayrshare.com/api/comments',
                             json=payload,
                             headers=headers)
    return response.json()


def get_post_comments(post_id: str, profile_key: str):
    """
    This function returns comments for a particular post
    """
    headers = {
        'Content-Type': 'application/json',
        'Profile-Key': profile_key,
        'Authorization': f'Bearer {str(ARYSHARE_KEY)}'
    }
    url = f'https://app.ayrshare.com/api/comments/{str(post_id)}'
    r = requests.get(url, headers=headers)

    return r.json()


def delete_post_comment(comment_id: str, profile_key: str, platform: str):
    """
    This function returns comments for a particular post
    """
    headers = {
        'Content-Type': 'application/json',
        'Profile-Key': profile_key,
        'Authorization': f'Bearer {str(ARYSHARE_KEY)}'
    }

    payload = {
        'platform': platform,
    }

    data = json.dumps(payload)

    url = f'https://app.ayrshare.com/api/comments/{str(comment_id)}/?platform={str(platform)}&searchPlatformId=true'
    r = requests.delete(url, headers=headers, data=data)

    return r.json()


def get_most_recent_posts(org_id):
    """
    This function returns the most recent posts made by a user
    """
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

    status = 'posted'
    user_post = []

    for row in posts['data']:

        if org_id == str(row['org_id']):
            try:
                if status == row['status']:
                    data = {
                        'article_id': row['_id'],
                        'title': row['title'],
                        'paragraph': row['paragraph'],
                        'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date(),
                        'image': row['image'],
                        'source': row['source'],
                        'time': row['time'],
                        'post_response': row.get('post_response'),
                    }
                    user_post.append(data)
            except:
                pass

    user_post = list(reversed(user_post))
    return user_post


def get_scheduled_posts(org_id):
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

    status = 'scheduled'
    post_data = []

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
    return post_data


def get_post_by_id(post_id, user_id):
    """
    This function returns the most recent posts made by a user
    """
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
        "field": {"user_id": user_id},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request(
        "POST", url, headers=headers, data=data)
    posts = json.loads(response.json())

    status = 'posted'

    for row in posts['data']:

        if user_id == str(row['user_id']):
            try:
                if status == row['status'] and row['_id'] == post_id:
                    return {
                        'article_id': row['_id'],
                        'title': row['title'],
                        'paragraph': row['paragraph'],
                        'Date': datetime.strptime(row["date"][:10], '%Y-%m-%d').date(),
                        'image': row['image'],
                        'source': row['source'],
                        'time': row['time'],
                        'profile_key': row.get('profile_key'),
                        'post_response': row.get('post_response'),
                    }

            except:
                pass


def get_aryshare_profile_id(user_id):
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


def save_profile_key_to_post(profile_key, post_id, post_response, org_id):
    url = "http://uxlivinglab.pythonanywhere.com"

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "step4_data",
        "document": "step4_data",
        "team_member_ID": "1163",
        "function_ID": "ABCDE",
        "command": "update",
        "field": {
            "_id": post_id,
        },
        "update_field": {
            "profile_key": profile_key,
            "post_response": post_response,
            "org_id": org_id,
        },
        "platform": "bangalore"
    }

    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=payload)

    return response.json()


def encode_json_data(data):
    """
    This method encodes json data
    @param data: {}
    @return: str
    """
    return jwt.encode(data, "secret", algorithm="HS256")


def decode_json_data(data):
    """
    This method encodes json data
    @param data: {}
    @return: str
    """
    return jwt.encode(data, "secret", algorithm="HS256")


def edit_article(data: dict):
    """
    This function updates a post data
    """
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "step3_data",
        "document": "step3_data",
        "team_member_ID": "34567897799",
        "function_ID": "ABCDE",
        "command": "update",
        "field": {"_id": data.get('post_id')},
        "update_field": {
            "title": data.get('title'),
            "paragraph": data.get('paragraph'),
        },
        "platform": "bangalore"
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)
    return response.json()


def create_step_4_data(data: dict):
    """
    This function creates step 4 data
    """
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
    eventId = create_event()['event_id'],
    url = "http://uxlivinglab.pythonanywhere.com"
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
            "user_id": data['user_id'],
            "session_id": data['session_id'],
            "eventId": eventId,
            'client_admin_id': data['client_admin_id'],
            "title": data['title'],
            "paragraph": data['paragraph'],
            "org_id": data['org_id'],
            "source": data['source'],
            "qualitative_categorization": data.get('qualitative_categorization'),
            "targeted_for": data.get('targeted_for'),
            "designed_for": data.get('designed_for'),
            "targeted_category": data.get('targeted_category'),
            "image": data['image'],
            "date": date,
            "time": str(time),
            "status": "",
            "timezone": data['timezone'],
            "username": data['username']
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
    return response.json()


def create_group_hashtags(data: dict):
    """
    This function returns
    """
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    event_id = create_event()['event_id']

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "hashtags",
        "document": "hashtags",
        "team_member_ID": "1262001",
        "function_ID": "ABCDE",
        "command": "insert",
        "field": {
            "user_id": data['user_id'],
            "session_id": data['session_id'],
            "org_id": data['org_id'],
            "eventId": event_id,
            'client_admin_id': data['client_admin_id'],
            "group_name": data['group_name'],
            "hashtags": data['hashtags'],
        },
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    print(response.json())
    return response.json()


def update_group_hashtags(data: dict):
    """
    This function returns
    """
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}

    event_id = create_event()['event_id']
    update_type = data.get('update_type')
    if update_type == 'append':
        group_hashtag = filter_group_hashtag({
            'org_id': data.get('org_id'),
            'group_hashtag_id': data.get('group_hashtag_id'),
        })
        if group_hashtag:
            group_hashtag = group_hashtag[0]
            current_hashtags = group_hashtag['hashtags']
            data['hashtags'] = data['hashtags'] + current_hashtags

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "hashtags",
        "document": "hashtags",
        "team_member_ID": "1262001",
        "function_ID": "ABCDE",
        "command": "update",
        "field": {
            "_id": data['group_hashtag_id'],
        },
        "update_field": {
            "group_name": data['group_name'],
            "hashtags": data['hashtags'],
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    print(response.json())
    return response.json()


def filter_group_hashtag(data: dict):
    """
    This function returns
    """
    url = "http://uxlivinglab.pythonanywhere.com/"
    headers = {'content-type': 'application/json'}
    org_id = data.get('org_id')
    filter_data = {
        'org_id': data.get('org_id'),
    }
    if data.get('group_hashtag_id'):
        filter_data['_id'] = data.get('group_hashtag_id')
    if data.get('group_name'):
        filter_data['group_name'] = data.get('group_name')

    payload = {
        "cluster": "socialmedia",
        "database": "socialmedia",
        "collection": "hashtags",
        "document": "hashtags",
        "team_member_ID": "1262001",
        "function_ID": "ABCDE",
        "command": "fetch",
        "field": filter_data,
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }
    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    print(response.json())
    response_data = json.loads(response.json())
    group_hastag_pd = pd.DataFrame(response_data.get('data'))
    try:
        filtered_pd = group_hastag_pd[group_hastag_pd['org_id'] == org_id]
    except KeyError:
        return []
    return filtered_pd.to_dict('records')


def check_if_user_is_owner_of_organization(request):
    portfolio_info_list = request.session['portfolio_info']
    username = request.session['username']
    if not portfolio_info_list:
        return False
    for portfolio_info in portfolio_info_list:
        if portfolio_info.get('product') == 'Social Media Automation':
            if portfolio_info.get('member_type') == 'owner':
                return True
            if portfolio_info.get('member_type') == 'team_member' and portfolio_info.get('owner_name') == username:
                return True
    return False


def fetch_user_portfolio_data(request):
    session_id = request.session.get("session_id")
    if not session_id:
        return {"error": "Session ID not found"}

    url = "https://100093.pythonanywhere.com/api/userinfo/"
    response = requests.post(url, data={"session_id": session_id})
    return response.json()


def fetch_organization_user_info(org_id):
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
        "field": {"org_id": org_id},
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
        return None
