from django.shortcuts import render
from django.http import HttpResponse
import requests
import json
import time
from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def index(request):
    print("Hello World")
    # data = {
    #     'email': 'mail@example.com',
    #     'target_industry': 'Food & Beverages',
    #     'target_product': 'Smart Phone',
    #     'subject_determinant': '-',
    #     'subject': 'Livinglab',
    #     'subject_number': 'singular',
    #     'object_determinant': '-',
    #     'object': 'application',
    #     'object_number': 'plural',
    #     'verb': 'create',
    #     'adjective': 'wonderful',
    #     'api_sentence_435_1':
    #     {
    #         'sentence': 'Wonderful applications were created by Livinglab.',
    #         'sentence_type': 'Past passive sentence.',
    #         'sentence_id': 435
    #     },
    #     'api_sentence_436_2':
    #     {
    #         'sentence': 'Livinglab was creating wonderful applications.',
    #         'sentence_type': 'Past progressive sentence.',
    #         'sentence_id': 436
    #     },
    #     'api_sentence_437_3':
    #     {
    #         'sentence': 'Livinglab had created wonderful applications.',
    #         'sentence_type': 'Past perfect sentence.',
    #         'sentence_id': 437
    #     },
    #     'api_sentence_438_4':
    #     {
    #         'sentence':'Livinglab did not create wonderful applications.',
    #         'sentence_type': 'Past negated sentence.',
    #         'sentence_id': 438
    #     },
    #     'api_sentence_439_5':
    #     {
    #         'sentence': 'Wonderful applications are created by Livinglab.',
    #         'sentence_type': 'Present passive sentence.',
    #         'sentence_id': 439
    #     },
    #     'api_sentence_440_6':
    #     {
    #         'sentence': 'Livinglab is creating wonderful applications.',
    #         'sentence_type': 'Present progressive sentence.',
    #         'sentence_id': 440
    #     },
    #     'api_sentence_441_7':
    #     {
    #         'sentence': 'Livinglab has created wonderful applications.',
    #         'sentence_type': 'Present perfect sentence.',
    #         'sentence_id': 441
    #     },
    #     'api_sentence_442_8':
    #     {
    #         'sentence': 'Livinglab does not create wonderful applications.',
    #         'sentence_type': 'Present negated sentence.',
    #         'sentence_id': 442
    #     },
    #     'api_sentence_443_9':
    #     {
    #         'sentence': 'Wonderful applications will be created by Livinglab.',
    #         'sentence_type': 'Future passive sentence.',
    #         'sentence_id': 443
    #     },
    #     'api_sentence_444_10':
    #     {
    #         'sentence': 'Livinglab will be creating wonderful applications.',
    #         'sentence_type': 'Future progressive sentence.',
    #         'sentence_id': 444
    #     },
    #     'api_sentence_445_11':
    #     {
    #         'sentence': 'Livinglab will have created wonderful applications.',
    #         'sentence_type': 'Future perfect sentence.',
    #         'sentence_id': 445
    #     },
    #     'api_sentence_446_12':
    #     {
    #         'sentence': 'Livinglab will not create wonderful applications.',
    #         'sentence_type': 'Future negated sentence.',
    #         'sentence_id': 446
    #     },
    #     'sentence_rank_435_2':
    #     {
    #         'sentence_rank': '1',
    #         'sentence_result': 'Wonderful applications were created by Livinglab.',
    #         'sentence_id': 435
    #     },
    #     'sentence_rank_436_3':
    #     {
    #         'sentence_rank': '2',
    #         'sentence_result': 'Livinglab was creating wonderful applications.',
    #         'sentence_id': 436
    #     },
    #     'sentence_rank_437_4':
    #     {
    #         'sentence_rank': '3',
    #         'sentence_result': 'Livinglab had created wonderful applications.',
    #         'sentence_id': 437
    #     },
    #     'sentence_rank_438_5':
    #     {
    #         'sentence_rank': '4',
    #         'sentence_result': 'Livinglab did not create wonderful applications.',
    #         'sentence_id': 438
    #     },
    #     'sentence_rank_439_6':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Wonderful applications are created by Livinglab.',
    #         'sentence_id': 439
    #     },
    #     'sentence_rank_440_7':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab is creating wonderful applications.',
    #         'sentence_id': 440
    #     },
    #     'sentence_rank_441_8':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab has created wonderful applications.',
    #         'sentence_id': 441
    #     },
    #     'sentence_rank_442_9':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab does not create wonderful applications.',
    #         'sentence_id': 442
    #     },
    #     'sentence_rank_443_10':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Wonderful applications will be created by Livinglab.',
    #         'sentence_id': 443
    #     },
    #     'sentence_rank_444_11':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab will be creating wonderful applications.',
    #         'sentence_id': 444
    #     },
    #     'sentence_rank_445_12':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab will have created wonderful applications.',
    #         'sentence_id': 445
    #     },
    #     'sentence_rank_446_13':
    #     {
    #         'sentence_rank': None,
    #         'sentence_result': 'Livinglab will not create wonderful applications.',
    #         'sentence_id': 446
    #     },
    #     'rank_4': '4'
    # }
    # topics = []
    # # rank = []
    # # sentence = []
    # for key in data.keys():
    #     if key.startswith('sentence_rank_'):
    #         if data[key]['sentence_rank'] is not None:
    #             topic = { "rank": data[key]['sentence_rank'], "sentence": data[key]['sentence_result'] }
    #             print(topic)
    #             topics.append(topic)
    #             # rank.append(data[key]['sentence_rank'])
    #             # sentence.append(data[key]['sentence_result'])
    # subject = data['subject']
    # verb = data['verb']
    # print("Topics")
    # print(topics)
    return render(request, 'article/main.html', {'topics': "Hello"})


# helper functions
@xframe_options_exempt
def pretty_print(headline, json_obj):
    print("-----------------", headline, "-----------------")
    print(json.dumps(json_obj, sort_keys=True, indent=4, separators=(',', ': ')))
@xframe_options_exempt
def generate_article(request):
    if request.method!="POST":
        return HttpResponseRedirect(reverse("main-view"))
    else:
        RESEARCH_QUERY = request.POST.get("title")

    SERVER = "https://panel.ai-writer.com/"
    API_KEY = "B91ACB505A7392D27356C26747EDD70D"
    para = []
    # RESEARCH_QUERY = "content marketing"

    # first, we create a new research request for the keyword "marketing"
    research_request_obj = requests.post(SERVER + '/aiw/apiendpoint2/put_research_request/'+requests.utils.quote(RESEARCH_QUERY), params={"api_key":API_KEY, "identifier": "test_identifier"}).json()

    # show output
    pretty_print("NEW REQUEST", research_request_obj)


    # now get the research result, we will wait for a while and keep asking the server about it
    for _ in range(30):

        # request the result of the query
        research_result = requests.get(SERVER + '/aiw/apiendpoint2/get_research_result/'+research_request_obj["id"], params={"api_key":API_KEY}).json()

        # if the result is here, we will break the waiting loop
        if "result" in research_result and research_result["result"] is not None:
            break

        # the sleep makes sure we do not bomb the API endpoints
        time.sleep(30)


    # go through all rewritten paragraphs and print them
    for paragraph in research_result["result"]["article"]:
        print(paragraph["paragraph_text"])
        para.append(paragraph["paragraph_text"])
    # print all cited sources
    for src_url in research_result["result"]["cited_sources"]:
        print("Source:", src_url)

    return render(request, 'article/article.html',{'title': RESEARCH_QUERY,
                                                    'paragraph': para,
                                                    'src_url': research_result["result"]["cited_sources"]})

# def article_generated(request):
    # return render(request, 'article/article.html')
