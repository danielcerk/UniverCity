from rest_framework.routers import DefaultRouter

from .views import LikeDislikeViewSet

router = DefaultRouter()

router.register(r'', LikeDislikeViewSet, basename='like-or-dislike')

urlpatterns = router.urls
