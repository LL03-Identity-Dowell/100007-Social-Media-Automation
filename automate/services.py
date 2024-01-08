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
from step2.views import create_event
from step2.views import save_data, get_key, update_schedule, check_connected_accounts
from website.models import Sentences, SentenceResults, SentenceRank
from website.views import get_client_approval

global PEXELS_API_KEY
PEXELS_API_KEY = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'


@transaction.atomic
def step_1(auto_strings, data_di):
    # sleep time to allow for redirection in main app
    print('starting----------------')

    def api_call(grammar_arguments=None):
        if grammar_arguments is None:
            grammar_arguments = {}
        url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"

        # acess query string from kwargs
        querystring = {
            "object": auto_strings['object'],
            "subject": auto_strings['subject'],
            "verb": auto_strings['verb'],
            "objdet": auto_strings['objdet'],
            "objmod": auto_strings['objmod'],
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

    tenses = ['past', 'present', 'future']
    other_grammar = ['passive',
                     'progressive', 'perfect', 'negated']
    api_results = []
    sentence_grammar = Sentences.objects.create(
        user=auto_strings['user'],
        object=auto_strings['object'],
        topic=auto_strings['topic'],
        verb=auto_strings['verb'],
        adjective=auto_strings['objmod'],
    )

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
    # accessing primary key of values to use in next functions
    article_id = list(result_ids)
    user_id = data_di['user_id']
    # create a dictionary of the generated sentences
    data_dic = {
        **data_di,
        **{
            f"api_sentence_{counter}": {
                "sentence": api_result[0],
                'sentence_type': api_result[1],
                'sentence_id': sentence_result.pk
            }
            for counter, (api_result, sentence_result) in enumerate(zip(api_results, sentence_results), start=1)
        }
    }
    Ranked_dic = selected_result(article_id, data_dic)
    inserts = insert_form_data(Ranked_dic)

    if auto_strings['approve']['article'] == 'True':
        generate = generate_article(data_dic)

    else:
        print('done inserting')
    return (inserts)


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
        Rank = ['1', '2', '3', '4', '5', ' 6', '7', ' 8', '9', '10', '11', '12', ]
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
def generate_article(data_dic):
    start_datetime = datetime.now()
    Rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ]
    api_no = random.choice(Rank)
    key = f'api_sentence_{api_no}'

    # getting required data
    RESEARCH_QUERY = data_dic[key]['sentence']
    subject = data_dic["subject"]
    verb = None
    target_industry = None
    qualitative_categorization = None
    targeted_for = None
    designed_for = None
    targeted_category = None
    user_ids = data_dic["user_id"]
    session_id = data_dic["session_id"]
    # calling user aproval
    approval = get_client_approval(user_ids)

    # image = data_dic["image"]

    # Set your OpenAI API key here
    openai.api_key = settings.OPENAI_KEY

    # Build prompt
    prompt_limit = 280
    prompt = (
            f"Write an article about {RESEARCH_QUERY} that discusses {subject} using {verb} in the {target_industry} industry."
            f" Generate only 2 paragraphs. "
            [:prompt_limit]
            + "..."
    )

    # Variables for loop control
    duration = 5  # Total duration in seconds
    interval = 1  # Interval between generating articles in seconds
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
        print(paragraphs)
        article_str = "\n\n".join(paragraphs)

        sources = urllib.parse.unquote("https://openai.com")

        try:
            with transaction.atomic():
                event_id = create_event()['event_id']

                user_id = user_ids
                client_admin_id = data_dic["client_admin_id"]

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
                    "image": None,
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

        except Exception as e:
            print(f"Error saving data: {str(e)}")
            return ('not saved')
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
    print('step_3 starting')
    #    seeking for approval to automate step 3
    if approval['post'] == 'True':
        step_3 = post_list(user_ids)
    print('step_3 done')
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
                    "Instagram-uxlivinglab team", "Youtube-Team playlist", "Twitter-unpacandwin", "Linkedin-unpacandwin"
        , "Facebook-unpacandwin", "Instagram-unpacandwin", "Youtube-unpacandwin"]

    Targeted_category = ["Brand", "Corporate", "Team building", "Consumer contest"]
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
