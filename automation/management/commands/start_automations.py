import logging

from django.core.management import BaseCommand

from automation.automate import Automate
from helpers import get_all_automations

log = logging.getLogger(__name__)


class Command(BaseCommand):
    def __init__(self):
        super().__init__()

    help = "This command starts social media automations"

    def handle(self, *args, **options):
        log.info('Starting automations')
        automations = get_all_automations()
        log.info(f'Found {len(automations)} automations')
        for automation in automations:

            auto_strings = automation['auto_strings']
            data_di = automation['data_dic']

            automate = Automate(session=automation['session'],
                                number_of_posts=automation.get('number_of_posts_per_day'))
            if automate.approval.get('topic') == True:
                # Todo: Remove this
                automate.generate_topics(auto_strings, data_di)
                # async_task(automate.generate_topics,
                #            auto_strings, data_di, hook='automation.services.hook_now')
