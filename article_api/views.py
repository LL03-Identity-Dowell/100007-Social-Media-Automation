import requests
from django.db import transaction
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from step2.views import create_event

from article_api.permissions import HasBeenAuthenticated
from article_api.serializers import GenerateArticleSerializer, IndustrySerializer, SentenceSerializer
from react_version import settings
from website.models import User, Sentences, SentenceResults

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from decouple import config
import logging

# Fetch configuration from environment variables
API_KEY_ENDPOINT = config('API_KEY_ENDPOINT', 'https://100105.pythonanywhere.com/api/v1/process-api-key/')
API_SERVICE_ID = config('API_SERVICE_ID', 'DOWELL10015')

@method_decorator(csrf_exempt, name='dispatch')
class APIKeyProcessor(APIView):
    def __init__(self):
        self.api_key_endpoint = API_KEY_ENDPOINT
        self.api_service_id = API_SERVICE_ID

    def validate_api_data(self, api_key):
        payload = {'service_id': self.api_service_id}
        
        try:
            response = requests.post(self.api_key_endpoint, json=payload, timeout=10)
            response.raise_for_status()
            api_key_data = response.json()
        except requests.RequestException as e:
            logging.error(f"API request failed: {e}")
            return False, {"success": False, "message": "API request failed"}

        if response.status_code == 200 and api_key_data.get('success'):
            return True, {
                "success": True,
                "message": "Credits successfully consumed",
                "total_credits": api_key_data.get('total_credits')
            }
        else:
            return False, {
                "success": False,
                "message": api_key_data.get('message', 'Unknown error occurred')
            }


    def post(self, request):
        api_key = request.data.get('api_key')
        if not api_key:
            raise AuthenticationFailed('API key is required.')

        validation_endpoint = f'https://100105.pythonanywhere.com/api/v3/process-services/?type=api_service&api_key={api_key}'
        
        try:
            response = requests.post(validation_endpoint, json={"service_id": self.api_service_id}, timeout=10)
            response.raise_for_status()
            api_key_data = response.json()
        except requests.RequestException as e:
            logging.error(f"API request failed: {e}")
            return Response({"success": False, "message": "API request failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if response.status_code == 200 and api_key_data.get('success'):
            total_credits = api_key_data.get('total_credits')
            return Response({
                'success': True,
                'message': 'Credits successfully consumed',
                'total_credits': total_credits
            }, status=status.HTTP_200_OK)
        else:
            error_message = api_key_data.get('message', 'Unknown error occurred')
            return Response({
                'success': False,
                'message': error_message
            }, status=status.HTTP_400_BAD_REQUEST)


class GenerateSentencesAPIView(generics.CreateAPIView):
    """

    """
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = GenerateArticleSerializer

    def post(self, request):

        session_id = request.session.session_key

        industry_serializer = IndustrySerializer(data=request.data)
        sentence_serializer = SentenceSerializer(data=request.data)
        if not industry_serializer.is_valid():
            return Response(industry_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if not sentence_serializer.is_valid():
            return Response(sentence_serializer.errors, status=HTTP_400_BAD_REQUEST)

        url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"
        email = sentence_serializer.validated_data['email']
        user = User.objects.create(email=email)
        industry = industry_serializer.save()
        industry.user = user
        industry.save()

        object = sentence_serializer.validated_data['object'].lower()
        subject = sentence_serializer.validated_data['subject']
        verb = sentence_serializer.validated_data['verb']
        objdet = sentence_serializer.validated_data['object_determinant']
        adjective = sentence_serializer.validated_data['adjective']

        def api_call(grammar_arguments=None):
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

        data_dictionary = request.POST.dict()
        data_dictionary["user_id"] = user.id
        data_dictionary["session_id"] = session_id
        data_dictionary["email"] = email
        data_dictionary['event_id'] = create_event()['event_id']
        data_dictionary['email'] = email

        try:
            data_dictionary.pop('csrfmiddlewaretoken')
        except KeyError:
            print('csrfmiddlewaretoken key not in data_dictionary')
        request.session['data_dictionary'] = data_dictionary

        sentence_grammar = Sentences.objects.create(
            user=user,
            object=object,
            subject=subject,
            verb=verb,
            adjective=adjective,
        )

        tenses = ['past', 'present', 'future']
        other_grammar = ['passive', 'progressive', 'perfect', 'negated']
        api_results = []

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
        request.session['result_ids'] = list(result_ids)

        request.session['data_dictionary'] = {
            **request.session['data_dictionary'],
            **{
                f"api_sentence_{counter}": {
                    "sentence": api_result[0],
                    'sentence_type': api_result[1],
                    'sentence_id': sentence_result.pk
                }
                for counter, (api_result, sentence_result) in enumerate(zip(api_results, sentence_results), start=1)
            }
        }

        return Response(request.session['data_dictionary'])
