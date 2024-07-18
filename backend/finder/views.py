from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests

from private import api_key

# yelp api
url = "https://api.yelp.com/v3/businesses/search"


# headers
headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {api_key}",
    }

def index(incoming):
    # get lat/long from the request
    lat = incoming.GET.get('latitude', None)
    long = incoming.GET.get('longitude', None)
    
    # None specified, return error
    if lat == None or long == None:
        return JsonResponse({'error' : 'No latitude or longitude provided'}, status = 400)

    # request nearest from yelp api
    params = {
        "latitude": lat,
        "longitude": long,
        "term": "taco truck",
        "limit": 10
    }
    response = requests.get(url, headers=headers, params=params)
    info = {
        'error': 'Yelp Api Error',
        'message': response.text
    }
    status = 400
    # got a valid response, return only the infromation we want
    if response.status_code == 200:
        data = response.json()
        trucks = data.get('businesses')
        closest = -1
        dist = 100000000
        for i in range(len(trucks)):
            d = trucks[i].get("distance")
            if d < dist:
                closest = i
        if (closest != -1):
            truck = trucks[closest]
            info = {
                'name': truck.get("name"),
                'location': truck.get("location"),
                'rating': truck.get("rating"),
                'url': truck.get("url"),
                'image_url': truck.get("image_url"),
                'hours': truck.get("business_hours")
            }
        else:
            info = { 'error' : 'No Trucks Found'}
        status = 200

    return JsonResponse(info, status=status)

