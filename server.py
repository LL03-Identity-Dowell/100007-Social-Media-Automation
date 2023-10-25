from django.http import JsonResponse

def serverReports(request):
    return JsonResponse({"info": "Kindly bare with us but be sure to check soon"})
