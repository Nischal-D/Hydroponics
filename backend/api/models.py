from django.db import models

class SensorReading(models.Model):
    device_id = models.CharField(max_length=10)  # alphanumeric
    ph = models.FloatField()
    tds = models.FloatField()
    humidity = models.FloatField()
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)  # automatic timestamp

    def __str__(self):
        return f"{self.device_id} @ {self.timestamp}"

class ControlData(models.Model):
    device_id = models.CharField(max_length=10)  # same device id
    pH_threshold = models.FloatField(default=0)
    ec_threshold = models.FloatField(default=0)
    rh_threshold = models.FloatField(default=0)
    pH_pmp_time = models.FloatField(default=0)
    ec_pmp_time = models.FloatField(default=0)
    rh_fan_time = models.FloatField(default=0)
    timestamp = models.DateTimeField(auto_now=True)  # when backend writes this

    def __str__(self):
        return f"ControlData for {self.device_id} @ {self.timestamp}"
