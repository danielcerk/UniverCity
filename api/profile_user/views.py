from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    AllowAny,
    BasePermission,
)

from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import status

from .models import Profile
from .serializers import ProfileSerializer

from django.contrib.auth import get_user_model

User = get_user_model()

class IsOwner(BasePermission):

    
    def has_object_permission(self, request, view, obj):

        return obj.user == request.user

class ProfileViewSet(ViewSet):

    lookup_field = 'slug'

    def list(self, request):

        self.permission_classes = [AllowAny]

        profiles = Profile.objects.all().order_by('-created_at')
        serializer = ProfileSerializer(profiles, many=True)

        return Response(serializer.data)

    def retrieve(self, request, slug=None):

        self.permission_classes = [IsAuthenticatedOrReadOnly, IsOwner]

        try:

            profile = Profile.objects.get(slug=slug)

            if profile.user == request.user:

                serializer = ProfileSerializer(profile)

            else:

                serializer = ProfileSerializer(profile, fields=["id", 'name',
                    'first_name', 'last_name', 'email', 
                    'full_name','slug', "biografy", 'phone', 'is_moderator'])

            return Response(serializer.data)
        
        except Profile.DoesNotExist:

            raise NotFound("Perfil não encontrado.")

    def update(self, request, slug=None):

        self.permission_classes = [IsAuthenticated, IsOwner]

        try:

            profile = Profile.objects.get(slug=slug)

            if not ( request.user.profile.is_moderator or profile.user == request.user ):

                raise PermissionDenied("Você não tem permissão para editar este perfil.")
            
            
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data)
        
        except Profile.DoesNotExist:

            raise NotFound("Perfil não encontrado.")

    def destroy(self, request, slug=None):

        self.permission_classes = [IsAuthenticated, IsOwner]

        try:

            profile = Profile.objects.get(slug=slug)

            if profile.user != request.user:

                raise PermissionDenied("Você não tem permissão para deletar este perfil.")
            
            user = profile.user
            user.delete()


            return Response({"detail": "Perfil excluído com sucesso."})
        
        except Profile.DoesNotExist:

            raise NotFound("Perfil não encontrado.")

class ProfileDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "id": user.id,
            "name": user.name,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.profile.phone,
            "slug": user.profile.slug,
            "biografy": user.profile.biografy,
            "is_moderator": user.profile.is_moderator
        })
