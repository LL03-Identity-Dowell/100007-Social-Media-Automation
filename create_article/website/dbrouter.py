from .models import User, IndustryData, Sentences, SentenceResults, SentenceRank

class WebsiteDBRouter:
    """
    A router to control all database operations on models in the website contenttypes application.
    """
    # route_app_labels = {'website'}

    def db_for_read(self, model, **hints):
        """
        Attempts to read auth and contenttypes models go to auth_db.
        """
        if model == User or model == IndustryData or model == Sentences or model == SentenceResults or model == SentenceRank:
            return 'website'
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth and contenttypes models go to auth_db.
        """
        if model == User or model == IndustryData or model == Sentences or model == SentenceResults or model == SentenceRank:
            return 'website'
        return None

# class UserDBRouter(object):

#     def db_for_read(self, model, **hints):
#         """ reading SomeModel from otherdb """
#         if model == User:
#             return 'website'
#         return None

#     def db_for_write(self, model, **hints):
#         """ writing SomeModel to otherdb """
#         if model == User:
#             return 'website'
#         return None

# class IndustryDataDBRouter(object):

#     def db_for_read(self, model, **hints):
#         """ reading SomeModel from otherdb """
#         if model == IndustryData:
#             return 'website'
#         return None

#     def db_for_write(self, model, **hints):
#         """ writing SomeModel to otherdb """
#         if model == IndustryData:
#             return 'website'
#         return None

# class SentencesDBRouter(object):

#     def db_for_read(self, model, **hints):
#         """ reading SomeModel from otherdb """
#         if model == Sentences:
#             return 'website'
#         return None

#     def db_for_write(self, model, **hints):
#         """ writing SomeModel to otherdb """
#         if model == Sentences:
#             return 'website'
#         return None

# class SentenceResultsDBRouter(object):

#     def db_for_read(self, model, **hints):
#         """ reading SomeModel from otherdb """
#         if model == SentenceResults:
#             return 'website'
#         return None

#     def db_for_write(self, model, **hints):
#         """ writing SomeModel to otherdb """
#         if model == SentenceResults:
#             return 'website'
#         return None

# class UserDBRouter(object):

#     def db_for_read(self, model, **hints):
#         """ reading SomeModel from otherdb """
#         if model == User:
#             return 'website'
#         return None

#     def db_for_write(self, model, **hints):
#         """ writing SomeModel to otherdb """
#         if model == User:
#             return 'website'
#         return None
