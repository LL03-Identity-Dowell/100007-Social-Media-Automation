import concurrent.futures
import json
import random
import time
import urllib
import urllib.parse
from datetime import datetime
from io import BytesIO

import openai
import pytz
import requests
from PIL import Image
from django.db import transaction
from django.utils.timezone import localdate, localtime
from pexels_api import API

from create_article import settings
from helpers import fetch_user_info
from step2.views import create_event
from step2.views import save_data, get_key, update_schedule, check_connected_accounts
from website.models import Sentences, SentenceResults, SentenceRank
from website.views import get_client_approval

global PEXELS_API_KEY
PEXELS_API_KEY = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'


def hook_now(task):
    print(task.result)


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


@transaction.atomic
def selected_result(article_id, data_dic):
    try:
        print('ranking___________')
        sentence_ids = article_id
        Rank = ['1', '2', '3', '4', '5', ' 6',
                '7', ' 8', '9', '10', '11', '12', ]
        Rank_dict = {}
        loop_counter = 1
        for sentence_id in sentence_ids:
            selected_rank = random.choice(Rank).format(loop_counter)
            key = 'rank_{}'.format(loop_counter)
            Rank_dict[key] = selected_rank

            loop_counter += 1
            sentence_result = SentenceResults.objects.get(
                pk=sentence_id)
            selected_result_obj = SentenceRank.objects.create(
                sentence_result=sentence_result, sentence_rank=selected_rank
            )

            data_dic = {
                **data_dic,
                **{
                    "sentence_rank_{}".format(loop_counter - 1): {
                        "sentence_rank": selected_rank,
                        'sentence_result': sentence_result.sentence,
                        'sentence_id': sentence_id
                    }
                }
            }
            Rank.remove(selected_rank)
        print('_____done ranking----')
        data_dic = {
            **data_dic,
            **Rank_dict

        }

        # del request.session['data_dictionary']

        # Removing industry form data and sentence forms data from the session
        # request.session.pop('industry_form_data', None)
        # request.session.pop('sentences_form_data', None)
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_1_credit(request)

        # return redirect("https://100014.pythonanywhere.com/?redirect_url=https://www.socialmediaautomation.uxlivinglab.online")
        return (data_dic)

    except Exception as e:
        print(str(e))


def insert_form_data(data_dict):
    print("----------------> insert form data-- start---------")

    url = "http://uxlivinglab.pythonanywhere.com/"
    if not data_dict.get('eventId'):
        print('none')
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
    return (data_dict)


@transaction.atomic
def generate_article(data_dic, user_data):
    print("automation started.........................................................")
    start_datetime = datetime.now()
    Rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ]
    api_no = random.choice(Rank)
    key = f'api_sentence_{api_no}'
    # getting required data
    RESEARCH_QUERY = data_dic[key]['sentence']
    user_ids = data_dic["user_id"]
    session_id = data_dic["session_id"]
    # calling user aproval
    approval = get_client_approval(user_ids)
    org_id = data_dic["org_id"]
    user_selected_cities = []
    user_data = user_data
    for item in user_data["data"]:
        if "target_city" in item and item["target_city"] is not None:
            user_selected_cities.extend(item["target_city"])
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
        f" Include {formatted_cities} to the end of the article."
        f" Ensure that the generated content is a minimum of {min_characters} characters in length."
        [:prompt_limit]
        + "..."
    )
    # Generate article using OpenAI's GPT-3
    response = openai.Completion.create(
        # engine="text-davinci-003",
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        temperature=0,
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
    user_id = data_dic["user_id"]
    client_admin_id = data_dic["client_admin_id"]
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
    print('step_3 starting')
    #    seeking for approval to automate step 3
    if approval['post'] == True:
        step_3 = post_list(user_ids)
        print(step_3)
    print('step_3 not done')
    return ('done')


def hook_now2(task):
    print(task.result)


def post_list(user_id):
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
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
        "field": {"user_id": user_id},
        "update_field": {
            "order_nos": 21
        },
        "platform": "bangalore"
    }

    data = json.dumps(payload)
    response = requests.request("POST", url, headers=headers, data=data)
    # api_no =  random.choice(Rank)
    print(response)
    user_id = str(user_id)
    a = random.randint(-5, -1)
    response_data_json = json.loads(response.json())
    articles = response_data_json['data'][a]

    client_admin_id = articles['client_admin_id']
    title = articles['title']
    source = articles["source"]
    session_id = articles['session_id']
    Targeted_for = ["Apple-Technology", "Google-Technology", "Microsoft-Technology", "Amazon-Technology",
                    "Facebook-Technology", "Coca-Cola-Beverages", "Disney-Leisure", "Samsung-Technology",
                    "Louis Vuitton-Luxury",
                    "McDonald's-Restaurants", "Toyota-Automotive", "Intel-Technology", "NIKE-Apparel", "AT&T-Telecom",
                    "Cisco-Technology", "Oracle-Technology", "Verizon-Telecom", "Visa-Financial Services",
                    "Walmart-Retail",
                    "GE-Diversified", "Budweiser-Alcohol", "SAP-Technology", "Mercedes-Benz-Automotive",
                    "IBM-Technology", "Marlboro-Tobacco",
                    "Netflix-Technology", "BMW-Automotive", "American Express-Financial Services", "Honda-Automotive",
                    "LOreal-Consumer Packaged Goods", "Gucci-Luxury", "Hermes-Luxury", "Nescafe-Beverages",
                    "Home Depot-Retail",
                    "Accenture-Business Services", "Pepsi-Beverages", "Starbucks-Restaurants",
                    "Mastercard-Financial Services",
                    "Frito-Lay-Consummer Packaged Goods", "IKEA-Retail", "Zara-Retail",
                    "Gillette-Consumer Packaged Goods", "HSBC-Financial Services",
                    "Audi-Automotive", "J.P.Morgan-Financial Services", "Deloitte-Business Services", "Sony-Technology",
                    "UPS-Transportation",
                    "Bank of America-Financial Services", "Chase-Financial Services", "Adidas-Apparel",
                    "Channel-Luxuey", "Siemens-Diversified",
                    "Nestle-Consumer Packaged Goods", "CVS-Retail", "Cartier-Luxury", "Porsche-Automotive",
                    "ESPN-Media",
                    "Citi-Financial Services", "Wells Fargo -Financial Servies", "Adobe-Technology",
                    "Pampers-Consumer Packaged Goods", "Corona-Alchol",
                    "T-Mobile-Telecom", "Ebay-Technology", "Chevrolet-Automotive", "PayPal-Financial Services",
                    "Ford-Automotive", "Red Bull-Beveragese", "PwC-Business Services", "HP-Technology",
                    "Colgate-Consumer Packaged Goods", "Fox-Media", "Lowe's-Retail", "Lancome-Consumer Packaged Goods",
                    "H&M-Retail", "Lexus-Automotive", "Santander-Financial Services", "Cosotco-Retail",
                    "Hyundai-Automotive", "Danone-Consumer Packaged Goods", "Heinenken-Alcohol",
                    "Uniqlo-Apparel", "Goldman Sachs-Financial Services", "Hennessy-Alcohol", "Nintendo-Technology",
                    "AXA-Financial Services", "Allianz-Financial Services", "Dell-Technology",
                    "Caterpillar-Heavy Equipment", "LEGO-Leisure", "Huawai-Technology", "John Deere-Heavy Equipment",
                    "UBS-Financial Services", "KFC-Restaurants", "Burger King-Restaurants", "EY-Business Services",
                    "FedEx-Transportation", "Volkswagen-Automotive"]
    Designed_for = ["Twitter-uxlivinglab", "Linkdin-uxliving", "Facebook-Customer stories",
                    "Instagram-Livinglabstories", "Youtube-Dowell True Moments UX Living Lab", "Tiktok",
                    "Vimeo-(Brand)",
                    "Spotify podcast", "Second life", "Twitter-dowellresearch",
                    "Linkdin-dowellresearch", "Linkdin-Company page-Germany", "Linkdin-Company page-Singapore",
                    "Linkedin-Company page-UK", "Linkedin-Company page-Scandinavia", "Facebook-DoWell Research",
                    "Youtube-Dowell Research", "Twitter-seeuser", "Linkedin-Intership", "Facebook-uxlivinglab team",
                    "Instagram-uxlivinglab team", "Youtube-Team playlist", "Twitter-unpacandwin", "Linkedin-unpacandwin", "Facebook-unpacandwin", "Instagram-unpacandwin", "Youtube-unpacandwin"]

    Targeted_category = ["Brand", "Corporate",
                         "Team building", "Consumer contest"]
    # takes in the image
    a = random.randint(1, 5)

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
    images = output[a]
    Targeted_categorys = random.choice(Targeted_category)
    Designed_for = random.choice(Designed_for)
    Targeted_for = random.choice(Targeted_for)
    # takes in user_id
    post = {
        'Targeted_category': Targeted_categorys,
        'Designed_for': Designed_for,
        'Targeted_for': Targeted_for,
        'images': images,
    }
    print('post:', post)
    print('article:', articles)
    save_post(articles, post)
    return 'done'


def save_post(articles, post):
    eventId = eventId = create_event()['event_id']
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
    paragraph_list = [articles['paragraph']]
    combined_article = "\n\n".join(paragraph_list)
    paragraph_without_commas = combined_article.replace(
        '.', '. ').replace(',.', '.')

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
        "field": {
            "user_id": articles['user_id'],
            "session_id": articles['session_id'],
            "eventId": eventId,
            'client_admin_id': articles['client_admin_id'],
            "title": articles['title'],
            "paragraph": paragraph_without_commas,
            "source": articles["source"],
            "qualitative_categorization": articles['qualitative_categorization'],
            "targeted_for": post['Targeted_for'],
            "designed_for": post['Designed_for'],
            "targeted_category": post['Targeted_category'],
            "image": post['images'],
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
    return ("data:")


def media_post(user_id, username):
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
    response = requests.request("POST", url, headers=headers, data=data)
    post = json.loads(response.json())
    # takes in user_id
    # takes in the json data
    posts = post['data']

    post = []
    try:
        for row in posts:
            if row['status'] == '':
                data = {'title': row['title'], 'paragraph': row['paragraph'], 'Date': row["date"],
                        'image': row['image'], 'source': row['source'], 'PK': row['_id'], 'time': row['time']}
                post.append(data)
    except:
        post = []
    article = post[-1]
    paragraph = article['paragraph']
    image = article['image']
    key = get_key(user_id)
    linked_accounts = check_connected_accounts(username)
    timezone = article['timezone']


def time_converter(schedule, timezone):
    formart = datetime.strptime(schedule, '%m/%d/%Y %H:%M:%S')
    current_time = pytz.timezone(timezone)
    localize = current_time.localize(formart)
    utc = pytz.timezone('UTC')
    shedulded = localize.astimezone(utc)
    string = str(shedulded)[:-6]
    formart = datetime.strptime(
        string, "%Y-%m-%d %H:%M:%S").isoformat() + "Z"
    return formart


def api_call_schedule(postes, platforms, key, image, post_id, formart):
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
                print(message['message'][:62])
    elif r1.json()['status'] == 'success' and 'warnings' not in r1.json():
        print('post have been sucessfully posted')
        # credit_handler = CreditHandler()
        # credit_handler.consume_step_4_credit(request)
        update = update_schedule(post_id)

    else:
        for warnings in r1.json()['warnings']:
            print(warnings['message'])
