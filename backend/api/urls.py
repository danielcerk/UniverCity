from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from api.communities.views import CommunityViewSet
from api.communities.reclamations.views import ReclamationsViewSet
from api.questions.views import QuestionViewSet
from api.like_dislike.views import LikeDislikeViewSet
from api.profile_user.views import ProfileViewSet
from api.response.views import ResponseViewSet

from .views import SearchAPIView

# Roteador principal para 'communities'

router = DefaultRouter()
router.register(r'communities', CommunityViewSet, basename='community')

community_reclamation_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_reclamation_router.register(r'reclamations', 
    ReclamationsViewSet, basename='community-reclamation')
community_reclamation_router.register(r'reclamations/(?P<reclamation_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='reclamation-response')
community_reclamation_router.register(r'reclamations/(?P<reclamation_slug>[^/.]+)/responses/<int:response_id>/like_dislike/<int:action_id>', 
    LikeDislikeViewSet, basename='reclamation-response-like-dislike')
community_reclamation_router.register(r'reclamations/(?P<reclamation_slug>[^/.]+)/like_dislike', 
    LikeDislikeViewSet, basename='reclamation-like-dislike')

community_question_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_question_router.register(r'questions', QuestionViewSet, 
    basename='community-question')
community_question_router.register(r'questions/(?P<question_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='question-response')
community_reclamation_router.register(r'question/(?P<question_slug>[^/.]+)/responses/<int:response_id>/like_dislike/<int:action_id>', 
    LikeDislikeViewSet, basename='question-response-like-dislike')
community_question_router.register(r'questions/(?P<question_slug>[^/.]+)/like_dislike', 
    LikeDislikeViewSet, basename='question-like-dislike')

# With profile

community_profile_reclamation_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_profile_reclamation_router.register(r'profile', 
    ReclamationsViewSet, basename='community-profile-reclamation')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations', 
    ReclamationsViewSet, basename='profile-reclamation')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations/(?P<reclamation_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='profile-reclamation-response')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations/(?P<reclamation_slug>[^/.]+)/responses/<int:response_id>/like_dislike/<int:action_id>', 
    LikeDislikeViewSet, basename='profile-reclamation-response-like-dislike')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations/(?P<reclamation_slug>[^/.]+)/like_dislike', 
    LikeDislikeViewSet, basename='profile-reclamation-like-dislike')

community_profile_question_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_profile_reclamation_router.register(r'profile', 
    QuestionViewSet, basename='community-profile-question')
community_profile_question_router.register(r'profile/(?P<profile_slug>[^/.]+)/questions', QuestionViewSet, 
    basename='profile-question')
community_profile_question_router.register(r'profile/(?P<profile_slug>[^/.]+)/questions/(?P<question_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='profile-question-response')
community_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/question/(?P<question_slug>[^/.]+)/responses/<int:response_id>/like_dislike/<int:action_id>', 
    LikeDislikeViewSet, basename='profile-question-response-like-dislike')
community_profile_question_router.register(r'profile/(?P<profile_slug>[^/.]+)/questions/(?P<question_slug>[^/.]+)/like_dislike', 
    LikeDislikeViewSet, basename='profile-question-like-dislike')

# URLs
urlpatterns = [
    path('api/v1/auth/', include('api.auth.urls')),
    path('api/v1/', include('api.profile_user.urls')),
    path('api/v1/', include(router.urls)),
    path('api/v1/', include(community_reclamation_router.urls)),
    path('api/v1/', include(community_question_router.urls)),
    path('api/v1/', include(community_profile_reclamation_router.urls)),
    path('api/v1/', include(community_profile_question_router.urls)),
    path('search/', SearchAPIView.as_view(), name='search-api'),
]
