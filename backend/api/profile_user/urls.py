from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, ProfileDetailView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')

urlpatterns = [

    path('account', ProfileDetailView.as_view(), name='account'),
    path('', include(router.urls)),

]
