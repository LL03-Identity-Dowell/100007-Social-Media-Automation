import random
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from website.models import SentenceResults, SentenceRank
from website.serializers import SelectedResultSerializer
from .services import insert_form_data, get_client_approval

from django_q.tasks import async_task
from website.permissions import HasBeenAuthenticated



class RankAutomationAPIView(APIView):
    permission_classes = (HasBeenAuthenticated,)
    serializer_class = SelectedResultSerializer

    def post(self, request, *args, **kwargs):
        selected_result_serializer = SelectedResultSerializer(
            data=request.data)
        if not selected_result_serializer.is_valid():
            return Response(selected_result_serializer.errors, status=HTTP_400_BAD_REQUEST)
        
        userid = request.session['user_id']
        topic = get_client_approval(userid)
        sentence_ids = request.session.get('result_ids')

        if not sentence_ids:
            return Response({'message': 'The user does not have generated sentences in the session. Please generate '
                                        'sentences again.'}, status=HTTP_400_BAD_REQUEST)

        loop_counter = 1
        Rank = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        Rank_dict = {}
        
        for sentence_id in sentence_ids:
            selected_rank = random.choice(Rank)
            key = 'rank_{}'.format(loop_counter)
            Rank_dict[key] = selected_rank

            loop_counter += 1
            sentence_result = SentenceResults.objects.get(pk=sentence_id)
            selected_result_obj = SentenceRank.objects.create(
                sentence_result=sentence_result, sentence_rank=selected_rank
            )

            request.session['data_dictionary'] = {
                **request.session['data_dictionary'],
                **{
                    "sentence_rank_{}".format(loop_counter - 1): {
                        "sentence_rank": selected_rank,
                        'sentence_result': sentence_result.sentence,
                        'sentence_id': sentence_id
                    }
                }
            }

            Rank.remove(selected_rank)

        data_dictionary = request.POST.dict()
        data_dictionary['client_admin_id'] = request.session['userinfo']['client_admin_id']

        request.session['data_dictionary'] = {
            **request.session['data_dictionary'],
            **data_dictionary,
            **Rank_dict
        }

        data_dic = request.session['data_dictionary']

        insert_form_data(request.session['data_dictionary'])

        print(topic)
        if topic.get('article') == 'True':
            async_task("automate.services.generate_article",
                       data_dic, hook='automate.services.hook_now2')
            return Response({'message': 'Your sentences are being ranked in the background'})
        else:
            return Response({'message': 'Sentence ranked successfully'})
