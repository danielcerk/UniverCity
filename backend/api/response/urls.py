from rest_framework.routers import DefaultRouter

from .views import ResponseViewSet

router = DefaultRouter()

router.register(r'', ResponseViewSet, basename='response')

urlpatterns = router.urls
