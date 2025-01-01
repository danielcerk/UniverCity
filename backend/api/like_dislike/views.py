from django.shortcuts import get_object_or_404
from .serializers import LikeDislikeSerializer
from .models import LikeDislike

from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import (
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

    permission_classes = [IsAuthorOrReadOnly]

    queryset = LikeDislike.objects.all()
    serializer_class = LikeDislikeSerializer

    def get_queryset(self):
        
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        question_slug = self.kwargs.get('question_slug')
        reclamation_slug = self.kwargs.get('reclamation_slug')

        response_id = self.kwargs.get('response_id')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

                if question_slug:

                    question = get_object_or_404(Question, slug=question_slug)

                    question_content_type = ContentType.objects.get_for_model(Question)

                    if question:

                        response = LikeDislike.objects.filter(content_type=question_content_type,
                                 object_id=question.id)

                    else:

                        raise NotFound('Resposta para a questão não foi encontrada')

                elif reclamation_slug:

                    if reclamation_slug:

                        reclamation = get_object_or_404(Reclamations, slug=reclamation_slug)

                        reclamation_content_type = ContentType.objects.get_for_model(Reclamations)

                        if reclamation:

                            response = LikeDislike.objects.filter(content_type=reclamation_content_type, object_id=reclamation.id)

                    else:

                        raise NotFound('Resposta para a reclamação não foi encontrada')

            else:

                response = LikeDislike.objects.all()
            
        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        return response

    def retrieve(self, request, *args, **kwargs):
    
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        question_slug = self.kwargs.get('question_slug')
        reclamation_slug = self.kwargs.get('reclamation_slug')

        response_id = self.kwargs.get('response_id')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        response = self.get_object()
        
        serializer = self.get_serializer(response)

        return Response(serializer.data)