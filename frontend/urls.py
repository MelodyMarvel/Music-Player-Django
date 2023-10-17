from django.urls import path, include
from .views import index

app_name = 'frontend' #gjango needs to know that this url.py file belongs to the frontend

urlpatterns = [
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
] 