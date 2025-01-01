from rest_framework.routers import DefaultRouter

from .views import ReclamationsViewSet

router = DefaultRouter()

router.register(r'', ReclamationsViewSet, basename='reclamations')

urlpatterns = router.urls
