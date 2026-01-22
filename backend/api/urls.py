from django.contrib import admin
from django.urls import path
from .views import HomeAPIView

urlpatterns = [
    path('', HomeAPIView.as_view(), name='api-home'),
]
