from django.http import JsonResponse

def serverReports(request):
    return JsonResponse({"info": "We apologize for the inconvenience. Please check back soon."})