from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import SensorReading, ControlData, Device
from django.contrib.auth.models import User
from .serializers import SensorReadingSerializer, ControlDataSerializer, UserDeviceSerializer

class SensorListAPIView(APIView):
    permission_classes = []  # public access

    def get(self, request):
        sensor_data = SensorReading.objects.all().order_by('-timestamp')[:50]
        serializer = SensorReadingSerializer(sensor_data, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class ControlDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            device = request.user.device
            control = ControlData.objects.get(device_id=device.device_id)
        except Device.DoesNotExist:
            return Response({"error": "No device linked to user"}, status=status.HTTP_404_NOT_FOUND)
        except ControlData.DoesNotExist:
            return Response({"error": "Control data not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ControlDataSerializer(control)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        try:
            device = request.user.device
            control = ControlData.objects.get(device_id=device.device_id)
        except Device.DoesNotExist:
            return Response({"error": "No device linked to user"}, status=status.HTTP_404_NOT_FOUND)
        except ControlData.DoesNotExist:
            return Response({"error": "Control data not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ControlDataSerializer(control, data=request.data, partial=True)  # allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "updated", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDeviceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserDeviceSerializer(request.user)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
