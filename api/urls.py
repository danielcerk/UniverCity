from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from api.communities.views import CommunityViewSet, MemberCommunityViewSet
from api.communities.reclamations.views import ReclamationsViewSet
from api.questions.views import QuestionViewSet
from api.response.views import ResponseViewSet
from api.reports.views import ReportViewSet
from .views import SearchAPIView

# Roteador principal para 'communities'

router = DefaultRouter()
router.register(r'communities', CommunityViewSet, basename='community')

community_member_router = NestedDefaultRouter(router, r'communities',
    lookup='community')
community_member_router.register(r'members', 
    MemberCommunityViewSet, basename='community-member')
community_member_router.register(r'members/(?P<profile_slug>[^/.]+)/', 
    MemberCommunityViewSet, basename='community-member-profile')

community_reclamation_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_reclamation_router.register(r'reclamations', 
    ReclamationsViewSet, basename='community-reclamation')
community_reclamation_router.register(r'reclamations/(?P<reclamation_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='reclamation-response')

community_question_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_question_router.register(r'questions', QuestionViewSet, 
    basename='community-question')
community_question_router.register(r'questions/(?P<question_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='question-response')

# With profile

community_profile_reclamation_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_profile_reclamation_router.register(r'profile', 
    ReclamationsViewSet, basename='community-profile-reclamation')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations', 
    ReclamationsViewSet, basename='profile-reclamation')
community_profile_reclamation_router.register(r'profile/(?P<profile_slug>[^/.]+)/reclamations/(?P<reclamation_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='profile-reclamation-response')

community_profile_question_router = NestedDefaultRouter(router, r'communities', 
    lookup='community')
community_profile_question_router.register(r'profile', 
    QuestionViewSet, basename='community-profile-question')
community_profile_question_router.register(r'profile/(?P<profile_slug>[^/.]+)/questions', QuestionViewSet, 
    basename='profile-question')
community_profile_question_router.register(r'profile/(?P<profile_slug>[^/.]+)/questions/(?P<question_slug>[^/.]+)/responses', 
    ResponseViewSet, basename='profile-question-response')

router.register(r'reports', ReportViewSet, basename='report')

another_urlpatterns = [
    path('reports/<int:content_type_id>/<int:object_id>/', ReportViewSet.as_view({'get': 'list', 'post': 'create'}), name='report-list'),
    path('reports/<int:content_type_id>/<int:object_id>/<int:pk>/', ReportViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='report-detail'),
]

urlpatterns = [
    path('api/v1/auth/', include('api.auth.urls')),
    path('api/v1/', include('api.profile_user.urls')),
    path('api/v1/', include(router.urls)),
    path('api/v1/', include(community_member_router.urls)),
    path('api/v1/', include(community_reclamation_router.urls)),
    path('api/v1/', include(community_question_router.urls)),
    path('api/v1/', include(community_profile_reclamation_router.urls)),
    path('api/v1/', include(community_profile_question_router.urls)),
    path('api/v1/', include('api.status.urls')),
    path('api/v1/', include('api.feed.urls')),
    path('api/v1/', include(another_urlpatterns)),
    path('search/', SearchAPIView.as_view(), name='search-api'),
]
