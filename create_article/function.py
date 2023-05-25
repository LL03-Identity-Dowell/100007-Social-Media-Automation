import requests
import json
import time
from mega import Mega
from bson.objectid import ObjectId
from datetime import datetime

url = 'http://100045.pythonanywhere.com/dowellmega'
headers = {'content-type': 'application/json'}
response = requests.post(url = url,headers=headers)
responses = json.loads(response.text)
mega=Mega()
m = mega.login(responses["username"],responses["password"])
file=m.download_url('https://mega.co.nz/#!kGJkmRoD!I4-m1woPi12JP7Fu0Qy6x7Isw48C-V1qsrN9B7n-BFQ','/home/100007/create_article/static/photos')