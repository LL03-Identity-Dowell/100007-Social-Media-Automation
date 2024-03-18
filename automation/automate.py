import concurrent.futures
import json
import logging
import random
import traceback
import urllib.parse
from datetime import datetime, timedelta
from io import BytesIO

import openai
import pytz
import requests
from PIL import Image
from django.db import transaction
from django.utils.timezone import localtime, localdate
from django_q.tasks import async_task
from pexels_api.api import API

from credits.constants import STEP_1_SUB_SERVICE_ID, STEP_2_SUB_SERVICE_ID, STEP_3_SUB_SERVICE_ID, STEP_4_SUB_SERVICE_ID
from credits.credit_handler import CreditHandler
from helpers import fetch_organization_user_info, create_event, save_data, check_connected_accounts, get_key, \
    save_profile_key_to_post, filter_all_automations
from react_version import settings
from website.models import Sentences, SentenceResults, SentenceRank


class Automate:
    """
    """
    __name__ = 'Automate'

    def __init__(self, session: dict, is_daily_automation: bool = False, number_of_posts: int = 1,
                 automation_id: str = ''):
        logging.info('Initializing automate class')
        self.credit_handler = CreditHandler()
        self.user_info = session.get('user_info')
        self.session = session
        self.pexels_api_key = '563492ad6f91700001000001e4bcde2e91f84c9b91cffabb3cf20c65'
        self.is_daily_automation = is_daily_automation
        self.approval = self.get_client_approval(self.session['user_id'])
        self.number_of_posts = number_of_posts
        self.automation_id = automation_id

    def __str__(self):
        return f'Automate Social media posting'

    def update_automation_data(self):
        """

        @return:
        """
        organization_automations = filter_all_automations({'org_id': self.session['org_id']})
        if self.automation_id == '':
            print('No automation id has been provided. Skipping....')
            return
        updated_automation_list = []

        for automation in organization_automations:
            if automation.get('id') == self.automation_id:
                updated_automation = {**automation}
                days_run = automation.get('days_run', 0)
                updated_automation['days_run'] = days_run + 1
                updated_automation_list.append(updated_automation)
            else:
                updated_automation_list.append(automation)
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
                'user_id': self.session['user_id'],
            },
            "update_field": {
                "automations": updated_automation_list,
                "org_id": self.session['org_id'],
                "has_automation": True
            },
            "platform": "bangalore"
        })
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.json())
        return updated_automation_list

    def get_client_approval(self, user_id):
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
            "field": {"user_id": user_id},
            "update_field": {
                "order_nos": 21
            },
            "platform": "bangalore"
        }

        data = json.dumps(payload)
        response = requests.request("POST", url, headers=headers, data=data)
        response_data_json = json.loads(response.json())

        try:
            for value in response_data_json['data']:
                if 'topic' in value.keys():
                    approval = {
                        'topic': value.get('topic', 'False'),
                        'post': value.get('post', 'False'),
                        'article': value.get('article', 'False'),
                        'schedule': value.get('schedule', 'False')
                    }
                    return (approval)
            return ({'topic': 'False'})
        except Exception as e:
            logging.exception(e)
            approval = {'topic': 'False'}
        return (approval)

    def generate_topic_api(self, grammar_arguments=None, subject=None, verb=None, objdet=None, adjective=None,
                           object=None):
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
        print(response)
        if 'sentence' not in response.keys():
            return {'status': 'FAILED', 'response': response}
        return [response['sentence'], type_of_sentence]

    @transaction.atomic
    def generate_topics(self, auto_strings, data_dic):

        credit_response = self.credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_1_SUB_SERVICE_ID,
            session=self.session,
        )
        print(credit_response)
        if not credit_response.get('success'):
            return credit_response

        user = auto_strings.get('user') or auto_strings.get('user_id')
        if isinstance(auto_strings['topic'], int):
            topic_id = auto_strings['topic']
        else:
            topic_id = auto_strings['topic'].id
        sentence_grammar = Sentences.objects.create(
            user=user,
            object=auto_strings['object'],
            topic_id=topic_id,
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
                api_result = self.generate_topic_api(
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

        async_task(self.selected_result, result_ids,
                   data_dictionary, hook='automation.services.hook_now')
        # ToDo: Cahange this
        # self.selected_result(result_ids, data_dictionary)
        return data_dictionary

    @transaction.atomic
    def selected_result(self, article_id, data_dic):
        credit_handler = CreditHandler()
        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_1_SUB_SERVICE_ID,
            session=self.session,
        )
        print(credit_response)
        if not credit_response.get('success'):
            return credit_response
        try:
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
            data_dic = {
                **data_dic,
                **Rank_dict

            }
            self.insert_form_data(data_dic)
            print('Finished selecting sentences')
            credit_handler = CreditHandler()
            credit_handler.consume_step_1_credit(user_info=self.user_info)
            if self.approval['article'] == True:
                # TODO: change this
                async_task(self.generate_article,
                           data_dic, hook='automation.services.hook_now')
                # self.generate_article(data_dic=data_dic)
            return {'status': 'SUCCESS', 'response': data_dic}

        except Exception as e:
            print(str(e))
            return {'status': 'FAILED', 'response': e}

    def generate_time_intervals(self, num_intervals, start_time=None, end_time=None):
        """
        This method generates time intervals based on the
        @param num_intervals:
        @param start_time:
        @param end_time:
        @return:
        """
        # Calculate the total duration between start and end times
        total_duration = end_time - start_time

        # Calculate the interval duration
        interval_duration = total_duration / (num_intervals - 1)

        # Generate a list of time intervals
        time_intervals = [start_time + i * interval_duration for i in range(num_intervals)]

        return time_intervals

    def get_user_topics(self):
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
            "field": {"org_id": self.session['org_id']},
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
            user_org_id_list = [portfolio_info.get(
                'org_id') for portfolio_info in self.session['portfolio_info'] if
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
            return topics
        except Exception as e:
            print(e)
            return []

    @transaction.atomic
    def generate_article(self, data_dic=None, ):
        """
        This method generated articles according to the number of article required. The default is one article
        """
        if data_dic is None:
            print('Getting topics from already created topics')
            topics = self.get_user_topics()[:10]
            data_dic = {}
            for count, topic in enumerate(topics):
                data_dic[f'sentence_rank_{str(count)}'] = {'sentence_result': topic['sentence']}

        number_articles = self.number_of_posts
        credit_handler = CreditHandler()

        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_2_SUB_SERVICE_ID,
            session=self.session,
        )
        if not credit_response.get('success'):
            return credit_response

        topic_rank = 1
        generated_articles = []

        while len(generated_articles) < number_articles and topic_rank <= 12:
            # getting required data

            sentence_key = f'sentence_rank_{topic_rank}'
            topic_data = {
                'sentence': data_dic[sentence_key]['sentence_result']
            }

            article_data = self.generate_topic_article(topic_data)
            topic_rank += 1
            if 'error' in article_data.keys():
                print(article_data)
                continue

            generated_articles += article_data['article_data_list']

        if self.approval['post'] == False:
            return {'status': 'SUCCESS', 'response': generated_articles}

        client_admin_id = self.session['userinfo']['client_admin_id']
        now = datetime.now()
        timezone = self.session['timezone']
        current_timezone = pytz.timezone(timezone)
        local_time = current_timezone.localize(now)
        end_time = local_time + timedelta(hours=5)
        schedule_time_intervals = self.generate_time_intervals(
            num_intervals=number_articles,
            start_time=local_time,
            end_time=end_time,
        )

        for count, article in enumerate(generated_articles[:number_articles]):
            schedule_time = schedule_time_intervals[count]
            post_data = {
                'post_id': article.get('id'),
                'paragraph': article.get('paragraph'),
                "user_id": self.session['user_id'],
                "username": self.session['username'],
                "org_id": self.session['org_id'],
                "session_id": self.session['session_id'],
                'client_admin_id': client_admin_id,
                "title": article.get('title'),
                "event_id": article.get('event_id'),
                "source": article.get('source'),
                "schedule_time": schedule_time,
            }

            # Todo: Change this
            task_id = async_task(self.save_post, post_data,
                                 hook='automation.services.hook_now')
            article['task_id'] = task_id
            # self.save_post(post_data)

        return {'status': 'SUCCESS', 'response': generated_articles}

    def generate_topic_article(self, data):
        """
        This method generates articles for a single topic using chatgpt
        """
        try:
            print(f'Generating articles for sentence {str(data.get("sentence"))}')
            start_datetime = datetime.now()
            RESEARCH_QUERY = data['sentence']
            user_id = self.session['user_id']
            session_id = self.session["session_id"]
            # calling user aproval
            org_id = self.session["org_id"]
            user_selected_cities = []
            user_data = fetch_organization_user_info(org_id)
            # Set your OpenAI API key here
            openai.api_key = settings.OPENAI_KEY
            # Build prompt
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
            source = urllib.parse.unquote("")
            event_id = create_event()['event_id']
            user_id = self.session["user_id"]
            client_admin_id = self.session['userinfo']['client_admin_id']
            hashtags_in_last_paragraph = set(
                word.lower() for word in paragraphs[-1].split() if word.startswith('#'))
            for i in range(len(paragraphs) - 1):
                paragraphs[i] += " " + " ".join(hashtags_in_last_paragraph)
            article_data_list = []
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
                        "source": source,
                        "paragraph": paragraphs[i],
                        "citation_and_url": source,

                    }
                    saved_article = save_data('step3_data', 'step3_data',
                                              step3_data, '34567897799')
                    saved_article = json.loads(saved_article)
                    article_data_list.append({
                        "id": saved_article.get('inserted_id'),
                        "title": RESEARCH_QUERY,
                        "paragraph": paragraphs[i],
                        "source": source,
                        "event_id": event_id,
                    })
            step2_data = {
                "user_id": user_id,
                "session_id": session_id,
                "org_id": org_id,
                "eventId": event_id,
                'client_admin_id': client_admin_id,
                "title": RESEARCH_QUERY,
                "paragraph": article_str,
                "source": source,
                "citation_and_url": source,
            }
            save_data('step2_data', 'step2_data',
                      step2_data, '9992828281')
            end_datetime = datetime.now()
            time_taken = end_datetime - start_datetime
            print(f"Total time taken: {time_taken}")
            credit_handler = CreditHandler()
            credit_handler.consume_step_2_credit(user_info=self.user_info)
            return {
                'article_data_list': article_data_list,

            }
        except Exception as e:
            logging.exception(e)
            return {'error': f'{str(e)}'}

    def save_post(self, post_data, ):
        """
        This method saves a post to step 4. It also gets an image for the post
        """
        print(f'Saving post')
        credit_handler = CreditHandler()
        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_3_SUB_SERVICE_ID,
            session=self.session,
        )
        if not credit_response.get('success'):
            return credit_response

        eventId = create_event()['event_id']
        time = localtime()
        test_date = str(localdate())
        date_obj = datetime.strptime(test_date, '%Y-%m-%d')
        date = datetime.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        paragraph_list = [post_data['paragraph']]
        combined_article = "\n\n".join(paragraph_list)
        paragraph_without_commas = combined_article.replace(
            '.', '. ').replace(',.', '.')

        client_admin_id = self.session['userinfo']['client_admin_id']

        image = self.get_post_image(post_data)

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
                'client_admin_id': client_admin_id,
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
        credit_handler.consume_step_3_credit(user_info=self.user_info)
        async_task(self.media_post, post_data,
                   hook='automation.services.hook_now')
        return response

    def media_post(self, data: dict):
        credit_handler = CreditHandler()
        credit_response = credit_handler.check_if_user_has_enough_credits(
            sub_service_id=STEP_4_SUB_SERVICE_ID,
            session=self.session,
        )

        if not credit_response.get('success'):
            return credit_response
        username = self.session['username']
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
        org_id = data['org_id']

        user_id = data['user_id']
        key = get_key(user_id)

        social_with_count_restrictions = [
            channel for channel in linked_accounts if channel in ['twitter', 'pintrest']]
        social_without_count_restrictions = [channel for channel in linked_accounts if
                                             channel not in ['twitter', 'pintrest']]
        arguments = []
        schedule_time_str = None
        if data.get('schedule_time'):
            schedule_time = data.get('schedule_time')
            schedule_time_str = schedule_time.strftime('%Y-%m-%dT%H:%M:%SZ')

        if social_with_count_restrictions:
            truncated_post = f'{paragraph[:235]}\n\n{logo}'
            arguments.append(
                (truncated_post, social_with_count_restrictions,
                 key, image, org_id, post_id, schedule_time_str),
            )
        if social_without_count_restrictions:
            arguments.append(
                (postes, social_without_count_restrictions,
                 key, image, org_id, post_id, schedule_time_str),
            )

        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Using lambda, unpacks the tuple (*f) into api_call(*args)
            results = executor.map(
                lambda f: self.post_article_to_aryshare(*f), arguments)

            end_datetime = datetime.now()
            time_taken = end_datetime - start_datetime
            print(f"Total time taken: {time_taken}")
        return 'DONE'

    def insert_form_data(self, data_dict):
        url = "http://uxlivinglab.pythonanywhere.com/"
        if not data_dict.get('eventId'):
            print('none')
            data_dict['eventId'] = self.get_event_id()
        # data_dict['dowelltime'] = get_dowellclock()
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
        return (data_dict)

    def get_event_id(self):
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

    def get_post_image(self, data: dict):
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
        api = API(self.pexels_api_key)
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

    def post_article_to_aryshare(self, post, platforms, key, image, org_id, post_id, schedule_date=None):
        payload = {'post': post,
                   'platforms': platforms,
                   'profileKey': key,
                   'mediaUrls': [image],
                   }
        if schedule_date:
            payload['scheduleDate'] = str(schedule_date)
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
                self.update_most_recent(post_id)
                credit_handler = CreditHandler()
                credit_handler.consume_step_4_credit(user_info=self.user_info)
                update = self.update_most_recent(post_id)
                return {'success': True, 'message': 'Successfully Posted'}
            else:
                warnings = [warning['message']
                            for warning in response_data['warnings']]
                return {'success': False, 'error_message': warnings}
        except Exception as e:
            return {'success': False, 'error_message': str(e)}

    def update_most_recent(self, pk):
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
