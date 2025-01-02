from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework_simplejwt import views as jwt_views
from .views import (
    MyTokenObtainPairView,
    RegisterView,
    LogoutAPIView
)

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    path('logout/', LogoutAPIView.as_view(), name ='logout'),
]
