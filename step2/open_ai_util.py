import time
import urllib

import openai
from django.db import transaction

from create_article import settings
from step2.views import create_event, save_data


class ChatGPT:
    def __init__(self):
        """
        This method is called when initializing the class
        """
        openai.api_key = settings.OPENAI_KEY
        self.openai_object = openai

    def generate_article(self, prompt):
        """
        This method generates an article
        """
        response = self.openai_object.Completion.create(
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

        return article_str

    def generate_multiple_articles_ai_writer(self, prompt, user_id, client_admin_id, session_id, RESEARCH_QUERY,
                                             target_industry, qualitative_categorization, targeted_for, designed_for,
                                             targeted_category, image, subject):
        """
        This method generates and saves the articles
        """
        print('this is the value of the promtp')
        print(prompt)
        duration = 200  # Total duration in seconds
        interval = 10  # Interval between generating articles in seconds
        start_time = time.time()
        current_time = time.time()
        while current_time - start_time < duration:
            # Generate article using OpenAI's GPT-3

            article_str = self.generate_article(prompt=prompt)

            sources = urllib.parse.unquote("https://openai.com")
            # matches = re.findall(r'(https?://[^\s]+)', article)
            # for match in matches:
            #     sources += match.strip() + '\n'

            try:
                with transaction.atomic():
                    self.save_article_data(RESEARCH_QUERY, article_str, client_admin_id, designed_for, image,
                                           qualitative_categorization, session_id, sources, subject, target_industry,
                                           targeted_category, targeted_for, user_id)

            except:
                return {'message': "Article did not save successfully.", 'title': RESEARCH_QUERY}

            # Wait for the specified interval before generating the next article
            time.sleep(interval)

            # Update current time
            current_time = time.time()

        return {'message': 'Article generation completed'}

    def save_article_data(self, RESEARCH_QUERY, article_str, client_admin_id, designed_for, image,
                          qualitative_categorization, session_id, sources, subject, target_industry, targeted_category,
                          targeted_for, user_id):
        """
        This method saves article data
        """
        event_id = create_event()['event_id']
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


def generate_articles_task(**kwargs):
    """
    This method generates multiple articles using chat gpt
    """
    print('Generating articles')
    chat_gpt = ChatGPT()
    print('This kwargs')
    print(kwargs)

    chat_gpt.generate_multiple_articles_ai_writer(**kwargs)
