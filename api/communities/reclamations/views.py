from django.shortcuts import render

from .serializers import ReclamationsSerializer
from .models import Reclamations
from rest_framework.exceptions import NotFound
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import ( 
    IsAuthenticatedOrReadOnly,
    BasePermission,
    SAFE_METHODS
)

from rest_framework.response import Response

from ..models import Community

from api.profile_user.models import Profile

class IsAuthorOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:

            return True

        return obj.user == request.user


class ReclamationsViewSet(ModelViewSet):

    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    queryset = Reclamations.objects.all()
    serializer_class = ReclamationsSerializer

    lookup_field = 'slug'

    def get_queryset(self):
        
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

                reclamation = Reclamations.objects.filter(community=community, user=profile.user)

            else:

                reclamation = Reclamations.objects.filter(community=community)

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")

        return reclamation

    def retrieve(self, request, *args, **kwargs):
    
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

        except Community.DoesNotExist:
            
            raise NotFound(detail="A comunidade não foi encontrada.")
        
        reclamation = self.get_object()

        if reclamation.community != community:

            raise NotFound(detail="Esta reclamação não pertence a esta comunidade.")
        
        serializer = self.get_serializer(reclamation)

        return Response(serializer.data)