from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Device, SensorReading, ControlData

class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields = ['device_id', 'ph', 'tds', 'humidity', 'temperature', 'timestamp']
        read_only_fields = fields

class ControlDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlData
        fields = ['device_id', 'pH_threshold', 'ec_threshold', 'rh_threshold',
                  'pH_pmp_time', 'ec_pmp_time', 'rh_fan_time', 'timestamp']
        read_only_fields = ['device_id', 'timestamp']

class UserDeviceSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(source='device.device_id', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'device_id']
