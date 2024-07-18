from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
import random


# Create your views here.
def index(request):
    # Common tacos, pick one at random
    menu = ["Al Pastor Tacos", "Carne Asada Tacos", "Chicken Tacos", "Carnitas Tacos"]
    choice = random.randint(0, len(menu) - 1)
    return HttpResponse(menu[choice])