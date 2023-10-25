import concurrent.futures
import random
import time
import urllib
import urllib.parse
from datetime import datetime

import openai
import requests
from django.db import transaction

from create_article import settings
from step2.views import create_event
from step2.views import save_data
from website.models import Sentences, SentenceResults, SentenceRank


@transaction.atomic
def step_1(auto_strings, data_di):
    # sleep time to allow for redirection in main app
    time.sleep(25)
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
        subject=auto_strings['subject'],
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

    return ('done')


def hook_now2(task):
    print(task.result)
