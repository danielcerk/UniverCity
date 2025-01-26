from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import ( 
    BasePermission,
    SAFE_METHODS,
    IsAuthenticatedOrReadOnly
)

from .serializers import CommunitySerializer, MemberCommunitySerializer
from .models import Community, MemberCommunity

from api.profile_user.models import Profile

class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        
        if request.method in SAFE_METHODS:

            return True
        
        return request.user and ( request.user.is_staff or request.user.is_superuser )

class CommunityViewSet(ModelViewSet):

    permission_classes = [IsAdminOrReadOnly]
    
    queryset = Community.objects.all().order_by('-created_at')
    serializer_class = CommunitySerializer

    lookup_field = 'slug'

class MemberCommunityViewSet(ModelViewSet):

    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = MemberCommunitySerializer

    lookup_field = 'user__profile__slug'

    def get_queryset(self):

        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = get_object_or_404(Profile, slug=profile_slug)
                return MemberCommunity.objects.filter(
                    user=profile.user, community=community
                ).order_by('-created_at')

            return MemberCommunity.objects.filter(community=community).order_by('-created_at')

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        except Profile.DoesNotExist:

            raise NotFound(detail="O perfil não foi encontrado.")
    
    def retrieve(self, request, *args, **kwargs):

        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        print(profile_slug)

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        except Profile.DoesNotExist:

            raise NotFound(detail="O perfil não foi encontrado.")

        response = self.get_object()
        serializer = self.get_serializer(response)

        return Response(serializer.data)
