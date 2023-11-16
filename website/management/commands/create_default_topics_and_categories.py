import logging

from django.core.management import BaseCommand
from django.db import transaction

from website.models import Category, UserTopic

log = logging.getLogger(__name__)


class Command(BaseCommand):
    def __init__(self):
        super().__init__()

    help = "This command creates default topics and categories"

    def handle(self, *args, **options):
        topic_name_list = (
            ('Livinglab', 'Livinglab'),
            ('Innovation', 'Innovation'),
            ('User experience', 'User experience'),
            ('Storytelling', 'Storytelling'),
            ('Consumer Behaviour', 'Consumer Behaviour'),
            ('Behavioral economics', 'Behavioral economics'),
            ('Consumer Insights', 'Consumer Insights'),
            ('Statistics', 'Statistics'),

        )
        categories = (
            ('Technology & Telecom', 'Technology & Telecom'),
            ('Food & Beverages', 'Food & Beverages'),
            ('Travel & Leisure', 'Travel & Leisure'),
            ('Restaurants & Hotels', 'Restaurants & Hotels'),
            ('Automotive', 'Automotive'),
            ('Apparel', 'Apparel'),
            ('Banking & Insurance', 'Banking & Insurance'),
            ('Chain stores', 'Chain stores'),
            ('Alcohol', 'Alcohol'),
            ('Tobacco', 'Tobacco'),
            ('Business Services & consultancies', 'Business Services & consultancies'),
            ('Transportation', 'Transportation'),
            ('Media', 'Media'),
            ('Heavy equipments', 'Heavy equipments'),
        )
        with transaction.atomic():
            # Creating default categories
            for category_name in categories:
                category = Category.objects.filter(name=category_name[0], is_default=True)
                if category:
                    category = category.first()
                    category.modified_by = 'create_default_categories_command'
                else:
                    category = Category()
                    category.created_by = 'create_default_categories_command'
                category.is_default = True
                category.name = category_name[0]
                category.save()

            # Creating default topics
            for topic_name in topic_name_list:
                user_topic = UserTopic.objects.filter(name=topic_name[0], is_default=True)
                if user_topic:
                    user_topic = user_topic.first()
                    user_topic.modified_by = 'create_default_categories_command'
                else:
                    user_topic = UserTopic()
                    user_topic.created_by = 'create_default_categories_command'
                user_topic.is_default = True
                user_topic.name = topic_name[0]
                user_topic.save()