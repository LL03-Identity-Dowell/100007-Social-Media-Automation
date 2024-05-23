import requests

# Define the payload for the post request
payload = {
    'post': 'Testing post',
    'platforms': ['facebook'],
    # 'mediaUrls': ['https://images.ayrshare.com/imgs/GhostBusters.jpg']  # Uncomment if you want to include media URLs
}

# Define the headers including the Authorization token
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 8DTZ2DF-H8GMNT5-JMEXPDN-WYS872G'
}

# Make the post request to the Ayrshare API
try:
    r = requests.post('https://app.ayrshare.com/api/post', json=payload, headers=headers)
    
    # Check if the request was successful
    if r.status_code == 200:
        print("Request was successful.")
    else:
        print(f"Request failed with status code {r.status_code}")

    # Print the response JSON
    print(r.json())

except requests.exceptions.RequestException as e:
    # Print the error if the request fails
    print(f"An error occurred: {e}")
