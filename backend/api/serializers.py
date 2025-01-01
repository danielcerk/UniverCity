# Serializer for search

from rest_framework import serializers

from api.profile_user.models import Profile
from api.communities.models import Community
from api.communities.reclamations.models import Reclamations
from api.questions.models import Question
from api.response.models import Response

class CommunitySerializer(serializers.ModelSerializer):

    class Meta:

        model = Community
        fields = ['id', 'name', 'slug']

class ProfileSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='user.full_name', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)

    class Meta:

        model = Profile
        fields = ['id','name', 'full_name','slug']

class ReclamationSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source='user.name', read_only=True)
    community = serializers.CharField(source='community.slug',
             read_only=True)

    class Meta:
        model = Reclamations
        fields = ['id', 'title', 'slug', 'user', 'community']

class ResponseSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Response
        fields = ['id', 'text', 'content_type', 'object_id', 'user']

class QuestionSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source='user.name', read_only=True)
    community = serializers.CharField(source='community.slug',
             read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'title', 'slug', 'user', 'community']