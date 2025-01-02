from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from .serializers import CommunitySerializer
from .models import Community

from rest_framework.permissions import ( 
    BasePermission,
    SAFE_METHODS,
    IsAuthenticated
)

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
