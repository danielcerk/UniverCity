from django.shortcuts import render

from .serializers import QuestionSerializer
from .models import Question
from api.communities.models import Community
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import (

    IsAuthenticatedOrReadOnly,
    BasePermission,
    SAFE_METHODS

)

from api.profile_user.models import Profile

class IsAuthorOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:

            return True

        return obj.user == request.user

class QuestionViewSet(ModelViewSet):

    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    lookup_field = 'slug'

    def get_queryset(self):
        
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

                question = Question.objects.filter(community=community,
                user=profile.user)

            else:

                question = Question.objects.filter(community=community)
            

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        return question

    def retrieve(self, request, *args, **kwargs):
    
        community_slug = self.kwargs.get('community_slug')
        profile_slug = self.kwargs.get('profile_slug')

        try:

            community = Community.objects.get(slug=community_slug)

            if profile_slug:

                profile = Profile.objects.get(slug=profile_slug)

        except Community.DoesNotExist:

            raise NotFound(detail="A comunidade não foi encontrada.")
        
        question = self.get_object()

        if question.community != community:

            raise NotFound(detail="Esta pergunta não pertence a esta comunidade.")
        
        serializer = self.get_serializer(question)

        return Response(serializer.data)