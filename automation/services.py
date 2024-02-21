import concurrent.futures
import json
import random
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
from django_q.tasks import async_task
from pexels_api import API

from create_article import settings
from credits.constants import STEP_1_SUB_SERVICE_ID, STEP_2_SUB_SERVICE_ID, STEP_3_SUB_SERVICE_ID
from credits.credit_handler import CreditHandler
from helpers import download_and_upload_image, save_profile_key_to_post, \
    check_connected_accounts
from step2.views import create_event
from step2.views import save_data, get_key, update_schedule
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


def generate_topic_api(grammar_arguments=None, subject=None, verb=None, objdet=None, adjective=None, object=None):
    url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
    if grammar_arguments is None:
        grammar_arguments = {}

    querystring = {
        "object": object,
        "subject": subject,
        "verb": verb,
        "objdet": objdet,
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


@transaction.atomic
def generate_topics(auto_strings, data_dic):
    credit_handler = CreditHandler()
    credit_response = credit_handler.check_if_user_has_enough_credits(
        sub_service_id=STEP_1_SUB_SERVICE_ID,
        user_info=data_dic['user_info'],
    )
    print(credit_response)
    if not credit_response.get('success'):
        return credit_response
    print('Start of generating sentences')
    sentence_grammar = Sentences.objects.create(
        user=auto_strings['user'],
        object=auto_strings['object'],
        topic=auto_strings['topic'],
        verb=auto_strings['verb'],
        adjective=data_dic['adjective'],
    )

    tenses = ['past', 'present', 'future']
    other_grammar = ['passive', 'progressive', 'perfect', 'negated']
    api_results = []

    for tense in tenses:
        for grammar in other_grammar:
            arguments = {
                'tense': tense,
                grammar: grammar,
            }
            api_result = generate_topic_api(
                grammar_arguments=arguments,
                subject=data_dic['subject'],
                verb=data_dic['verb'],
                objdet=data_dic['object'],
                adjective=data_dic['adjective'],
                object=data_dic['object'],
            )
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
    result_ids = list(result_ids)

    data_dictionary = {
        **data_dic,
        **{
            f"api_sentence_{counter}": {
                "sentence": api_result[0],
                'sentence_type': api_result[1],
                'sentence_id': sentence_result.pk
            }
            for counter, (api_result, sentence_result) in enumerate(zip(api_results, sentence_results), start=1)
        }
    }
    async_task("automation.services.selected_result", result_ids, data_dictionary, hook='automation.services.hook_now')
    return data_dictionary


@transaction.atomic
def selected_result(article_id, data_dic):
    credit_handler = CreditHandler()
    credit_response = credit_handler.check_if_user_has_enough_credits(
        sub_service_id=STEP_1_SUB_SERVICE_ID,
        user_info=data_dic['user_info'],
    )
    print(credit_response)
    if not credit_response.get('success'):
        return credit_response
    print('Selecting sentences')
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
        insert_form_data(data_dic)
        approval = get_client_approval(data_dic['user_id'])
        print('Finished selecting sentences')
        credit_handler = CreditHandler()
        credit_handler.consume_step_1_credit(user_info=data_dic['user_info'])
        if approval['article'] == True:
            async_task("automation.services.generate_article", data_dic, hook='automation.services.hook_now')
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
def generate_article(data_dic, ):
    credit_handler = CreditHandler()
    credit_response = credit_handler.check_if_user_has_enough_credits(
        sub_service_id=STEP_2_SUB_SERVICE_ID,
        user_info=data_dic['user_info'],
    )
    if not credit_response.get('success'):
        return credit_response
    print("generating article.........................................................")
    start_datetime = datetime.now()
    Rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ]
    api_no = random.choice(Rank)
    key = f'api_sentence_{api_no}'
    RESEARCH_QUERY = data_dic[key]['sentence']
    user_ids = data_dic["user_id"]
    session_id = data_dic["session_id"]
    approval = get_client_approval(user_ids)
    org_id = data_dic["org_id"]
    openai.api_key = settings.OPENAI_KEY

    prompt_limit = 2000
    min_characters = 500

    # Modify the prompt to include the formatted user data
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
    post_id_list = []
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
            post_data = save_data('step3_data', 'step3_data',
                                  step3_data, '34567897799')
            post_id_list.append(post_data)

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
    #   seeking for approval to automate step 3
    credit_handler = CreditHandler()
    credit_handler.consume_step_2_credit(user_info=data_dic['user_info'])
    if approval['post'] == True:
        picked_article = post_id_list[0]
        picked_article = json.loads(picked_article)
        post_data = {
            'post_id': picked_article.get('inserted_id'),
            'paragraph': paragraphs[0],
            "user_id": user_id,
            "username": data_dic['username'],
            "org_id": org_id,
            "session_id": session_id,
            "eventId": event_id,
            'client_admin_id': client_admin_id,
            "title": RESEARCH_QUERY,
            "source": sources,
            "user_info": data_dic['user_info'],
        }
        async_task("automation.services.save_post", post_data,
                   hook='automation.services.hook_now')
    print('step_3 is done')
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
    paragraph = articles['paragraph']
    print("this is the selected paragraph", paragraph)
    title = articles['title']
    source = articles["source"]
    session_id = articles['session_id']
    org_id = articles['org_id']

    # takes in the image
    a = random.randint(1, 5)
    max_characters = 200
    query = paragraph[:max_characters]
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
    # takes in user_id
    uploaded_image = download_and_upload_image(image_url=images)
    images = uploaded_image.get('file_url')
    post = {
        'image': images,
    }
    print('post:', post)
    print('article:', articles)
    save_post(articles, post)
    return 'done'


def get_post_image(data: dict):
    print('Getting post image=====================================')
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
        return {'message': 'No images found please try again!'}
    images = output[0]
    return images


def save_post(post_data, ):
    credit_handler = CreditHandler()
    credit_response = credit_handler.check_if_user_has_enough_credits(
        sub_service_id=STEP_3_SUB_SERVICE_ID,
        user_info=post_data['user_info'],
    )
    if not credit_response.get('success'):
        return credit_response
    print('Saving post to step 4=========================================')
    eventId = create_event()['event_id']
    time = localtime()
    test_date = str(localdate())
    date_obj = datetime.strptime(test_date, '%Y-%m-%d')
    date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
    paragraph_list = [post_data['paragraph']]
    combined_article = "\n\n".join(paragraph_list)
    paragraph_without_commas = combined_article.replace(
        '.', '. ').replace(',.', '.')

    image = get_post_image(post_data)

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
            "user_id": post_data['user_id'],
            "session_id": post_data['session_id'],
            "eventId": eventId,
            'client_admin_id': post_data['client_admin_id'],
            "org_id": post_data['org_id'],
            "title": post_data['title'],
            "paragraph": paragraph_without_commas,
            "source": post_data["source"],
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
    response = requests.request(
        "POST", url, headers=headers, data=payload)
    print(f'This is the response: {str(response.text)}')
    response = json.loads(response.json())
    post_data['post_id'] = response.get('inserted_id')
    post_data['image'] = image
    credit_handler = CreditHandler()
    credit_handler.consume_step_3_credit(user_info=post_data['user_info'])
    async_task("automation.services.media_post", post_data,
               hook='automation.services.hook_now')
    return response


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


def post_article_to_aryshare(postes, platforms, key, image, org_id, post_id):
    payload = {'post': postes,
               'platforms': platforms,
               'profileKey': key,
               'mediaUrls': [image],
               }
    headers = {'Content-Type': 'application/json',
               'Authorization': F"Bearer {str(settings.ARYSHARE_KEY)}"}
    try:
        r1 = requests.post('https://app.ayrshare.com/api/post',
                           json=payload,
                           headers=headers)
        print(r1.json())
        response_data = r1.json()
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
            return {'success': True, 'message': 'Successfully Posted'}
        else:
            warnings = [warning['message']
                        for warning in response_data['warnings']]
            return {'success': False, 'error_message': warnings}
    except Exception as e:
        return {'success': False, 'error_message': str(e)}


def media_post(data: dict):
    # credit_handler = CreditHandler()
    # credit_response = credit_handler.check_if_user_has_enough_credits(
    #     sub_service_id=STEP_4_SUB_SERVICE_ID,
    #     request=request,
    # )

    # if not credit_response.get('success'):
    #     return JsonResponse('credit_error', safe=False)
    username = data['username']
    linked_accounts = check_connected_accounts(username)
    start_datetime = datetime.now()
    title = data['title']
    paragraph = data['paragraph']
    paragraph2 = paragraph[0:230]
    image = data['image']

    # Logo in its own paragraph
    logo = "Created and posted by #samanta #uxlivinglab"

    post_id = data['post_id']

    # Splitting the content and logo into separate paragraphs
    postes_paragraph1 = f"{paragraph[0:2000]}."
    postes_paragraph2 = logo

    # Combining the paragraphs with a newline character
    postes = f"{postes_paragraph1}\n\n{postes_paragraph2}"

    twitter_post_paragraph1 = paragraph2

    twitter_post = f"{twitter_post_paragraph1}\n\n{logo}."

    print(twitter_post)
    org_id = data['org_id']

    user_id = data['user_id']
    key = get_key(user_id)

    social_with_count_restrictions = [channel for channel in linked_accounts if channel in ['twitter', 'pintrest']]
    social_without_count_restrictions = [channel for channel in linked_accounts if
                                         channel not in ['twitter', 'pintrest']]
    arguments = []
    if social_with_count_restrictions:
        truncated_post = f'{paragraph[:235]}\n\n{logo}'
        arguments.append(
            (truncated_post, social_with_count_restrictions, key, image, org_id, post_id),
        )
    if social_without_count_restrictions:
        arguments.append(
            (postes, social_without_count_restrictions, key, image, org_id, post_id),
        )

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Using lambda, unpacks the tuple (*f) into api_call(*args)
        results = executor.map(lambda f: post_article_to_aryshare(*f), arguments)
        end_datetime = datetime.now()
        time_taken = end_datetime - start_datetime
        print(f"Total time taken: {time_taken}")
    return 'DONE'


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
