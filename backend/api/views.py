# from django.shortcuts import render
# from django.http import HttpResponse

# # Create your views here.

# def home(request):
#     return HttpResponse("App successfully configured")


from rest_framework.views import APIView
from rest_framework.response import Response

class HomeAPIView(APIView):
    def get(self, request):
        return Response({
            "status": "success",
            "message": "Hydroponics API is running"
        })
