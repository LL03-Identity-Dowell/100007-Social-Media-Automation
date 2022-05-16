# from ayrshare import SocialPost
# import requests

# payload = {'title': 'Nitesh Profile'}
# headers = {'Content-Type': 'application/json',
#         'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

# r = requests.post('https://app.ayrshare.com/api/profiles/profile',
#     json=payload,
#     headers=headers)

# print(r.json())

import requests

payload = {'post': 'Testing post',
        'platforms': ['facebook'],
        # 'mediaUrls': ['https://images.ayrshare.com/imgs/GhostBusters.jpg']
        }
headers = {'Content-Type': 'application/json',
        'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'}

r = requests.post('https://app.ayrshare.com/api/post',
    json=payload,
    headers=headers)

print(r.json())