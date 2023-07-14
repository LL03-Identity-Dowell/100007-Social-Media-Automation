from django.shortcuts import render, redirect, HttpResponse
from django.urls import reverse
from django.http import HttpResponseRedirect,JsonResponse

def serverReports(request):
    return JsonResponse({"info":"Kindly bare with us but be sure to check soon"})
