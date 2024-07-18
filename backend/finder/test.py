import requests
import random

url = "https://api.yelp.com/v3/businesses/search"

api_key = "SnTeVBG9Cm72Z4RUZM9_Wp7uQ6tApwYwkgiDiX-5LLhlbnSywpwaL-AKfgnI-uuqd30oL6_zUv7pD35TlaWNNysnNh7_EOwtEIOt-PVW56gMinlYMHP5cKyUrsWWZnYx"

headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {api_key}",
    }

params = {
    "latitude": 34.2036121,
    "longitude": -118.5472122,
    "term": "taco truck",
    "limit": 10
}


response = requests.get(url, headers=headers, params=params)

if response.status_code == 200:
    data = response.json()
    trucks = data.get('businesses')
    closest = 0
    dist = 100000000
    for i in range(len(trucks)):
        d = trucks[i].get("distance")
        if d < dist:
            closest = i



    truck = trucks[closest]
    info = {
        'name': truck.get("name"),
        'location': truck.get("location"),
        'rating': truck.get("rating"),
        'url': truck.get("url"),
        'image_url': truck.get("image_url"),
        'hours': truck.get("business_hours")
    }

    print(info)


menu = ["Al Pastor Tacos", "Carne Asada Tacos", "Chicken Tacos", "Carnitas Tacos"]
choice = random.randint(0, len(menu) - 1)
print(menu[choice])