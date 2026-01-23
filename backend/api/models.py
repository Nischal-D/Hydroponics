from django.db import models
from django.contrib.auth.models import User

class Device(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="device"
    )
    device_id = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"{self.user.username} - {self.device_id}"

class SensorReading(models.Model):
    device_id = models.CharField(max_length=10)
    ph = models.FloatField()
    tds = models.FloatField()
    humidity = models.FloatField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_id} @ {self.timestamp}"

class ControlData(models.Model):
    device_id = models.CharField(max_length=10, unique=True)

    pH_threshold = models.FloatField(default=0)
    ec_threshold = models.FloatField(default=0)
    rh_threshold = models.FloatField(default=0)

    pH_pmp_time = models.FloatField(default=0)
    ec_pmp_time = models.FloatField(default=0)
    rh_fan_time = models.FloatField(default=0)

    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ControlData for {self.device_id}"
