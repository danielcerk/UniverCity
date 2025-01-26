from django.shortcuts import get_object_or_404
from .serializers import LikeDislikeSerializer
from .models import LikeDislike

from rest_framework import status
from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import (
    IsAuthenticated,
    BasePermission,
    SAFE_METHODS
)

from api.communities.models import Community
from api.communities.reclamations.models import Reclamations
from api.profile_user.models import Profile
from api.questions.models import Question
from rest_framework.exceptions import NotFound
from django.contrib.contenttypes.models import ContentType

from rest_framework.response import Response

class IsAuthorOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:

            return True

        return obj.user == request.user

class LikeDislikeViewSet(ModelViewSet):

    permission_classes = [IsAuthorOrReadOnly, IsAuthenticated]

    queryset = LikeDislike.objects.all()
    serializer_class = LikeDislikeSerializer

    def get_queryset(self):

        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        if content_type_id and object_id:
            
            content_type = ContentType.objects.get(id=content_type_id)
            return LikeDislike.objects.filter(like_dislike_type=content_type, object_id=object_id)
        
        return LikeDislike.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):

        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        like_dislike = LikeDislike.objects.all()
        serializer = LikeDislikeSerializer(like_dislike, many=True)

        try:

            content_type = ContentType.objects.get(id=content_type_id)
            like_dislikes = LikeDislike.objects.filter(like_dislike_type=content_type, object_id=object_id)
            serializer = LikeDislikeSerializer(like_dislikes, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ContentType.DoesNotExist:

            return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):

        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        data = request.data

        if content_type_id and object_id:

            try:

                content_type = ContentType.objects.get(id=content_type_id)

            except ContentType.DoesNotExist:

                return Response({'error': 'Content type not found'}, status=status.HTTP_404_NOT_FOUND)

            data.update({
                'content_type': content_type.id,
                'object_id': object_id
            })

        serializer = self.get_serializer(data=data)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, *args, **kwargs):

        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')
        pk = kwargs.get('pk')

        try:

            content_type = ContentType.objects.get(id=content_type_id)
            like_dislike = LikeDislike.objects.get(like_dislike_type=content_type, object_id=object_id, pk=pk)
            serializer = LikeDislikeSerializer(like_dislike)

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except (ContentType.DoesNotExist, LikeDislike.DoesNotExist):

            return Response({'error': 'LikeDislike not found'}, status=status.HTTP_404_NOT_FOUND)