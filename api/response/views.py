from django.shortcuts import get_object_or_404

from .serializers import ResponseSerializers
from .models import Response as ResModel
from rest_framework.exceptions import NotFound
from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    BasePermission,
    SAFE_METHODS
)

from api.communities.models import Community
from api.communities.reclamations.models import Reclamations
from api.profile_user.models import Profile
from api.questions.models import Question

from django.contrib.contenttypes.models import ContentType

from rest_framework.response import Response

class IsAuthorOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:

            return True

        return obj.user == request.user

class ResponseViewSet(ModelViewSet):

    permission_classes = [IsAuthorOrReadOnly, IsAuthenticatedOrReadOnly]
    serializer_class = ResponseSerializers

    def get_queryset(self):
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')
        question_slug = self.kwargs.get('question_slug')
        reclamation_slug = self.kwargs.get('reclamation_slug')

        try:
            community = Community.objects.get(slug=community_slug)

            # Se o profile_slug for fornecido, buscamos as respostas associadas ao perfil
            if profile_slug:
                profile = Profile.objects.get(slug=profile_slug)
                response = ResModel.objects.filter(user=profile.user)
            else:
                # Caso contrário, retornamos as respostas associadas à questão ou reclamação
                if question_slug:
                    question = get_object_or_404(Question, slug=question_slug)
                    question_content_type = ContentType.objects.get_for_model(Question)
                    response = ResModel.objects.filter(content_type=question_content_type, object_id=question.id)
                elif reclamation_slug:
                    reclamation = get_object_or_404(Reclamations, slug=reclamation_slug)
                    reclamation_content_type = ContentType.objects.get_for_model(Reclamations)
                    response = ResModel.objects.filter(content_type=reclamation_content_type, object_id=reclamation.id)
                else:
                    response = ResModel.objects.filter(content_type=ContentType.objects.get_for_model(Community), object_id=community.id)

        except Community.DoesNotExist:
            raise NotFound(detail="A comunidade não foi encontrada.")
        except Profile.DoesNotExist:
            raise NotFound(detail="O perfil não foi encontrado.")
        
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
        except Profile.DoesNotExist:
            raise NotFound(detail="O perfil não foi encontrado.")

        response = self.get_object()
        serializer = self.get_serializer(response)

        return Response(serializer.data)
