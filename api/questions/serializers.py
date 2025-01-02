from rest_framework import serializers

from .models import Question

class QuestionSerializer(serializers.ModelSerializer):

    author = serializers.CharField(source='user.name', read_only=True)
    author_slug = serializers.CharField(source='user.profile.slug', read_only=True)

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        
        model = Question
        fields = ['id', 'title', 'slug','community','user',
                  'author','author_slug', 'content', 'like',
                  'dislike', 'responses_count', 'created_at', 'updated_at']