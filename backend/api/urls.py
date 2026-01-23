from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SensorListAPIView, ControlDataAPIView, UserDeviceAPIView

urlpatterns = [
    # JWT authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Sensor readings (public)
    path('sensors/', SensorListAPIView.as_view(), name='sensor-list'),

    # Control data (read & update for logged-in user)
    path('control/', ControlDataAPIView.as_view(), name='control-data'),

    # User info (logged-in user)
    path('user/', UserDeviceAPIView.as_view(), name='user-device'),
]
