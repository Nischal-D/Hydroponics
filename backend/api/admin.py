from django.contrib import admin
from .models import Device, SensorReading, ControlData

# Register your models here.
admin.site.register(Device)
admin.site.register(SensorReading)
admin.site.register(ControlData)