import requests

url = "https://linguatools-sentence-generating.p.rapidapi.com/realise"

querystring = {"object":"thief","subject":"police","verb":"arrest"}

headers = {
	"X-RapidAPI-Host": "linguatools-sentence-generating.p.rapidapi.com",
	"X-RapidAPI-Key": "1ab6a8ab35msh454e13d4febb540p1f0fe3jsn5303c2162430"
}

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)