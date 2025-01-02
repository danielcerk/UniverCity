from rest_framework import serializers

from .models import Reclamations

class ReclamationsSerializer(serializers.ModelSerializer):

    author = serializers.CharField(source='user.name', read_only=True)
    author_slug = serializers.CharField(source='user.profile.slug', read_only=True)

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:

        model = Reclamations
        fields = ['community', 'user', 'author', 'author_slug', 'slug', 'title', 'content',
                  'like', 'dislike', 'responses_count', 'is_resolved',
                  'created_at', 'updated_at']

        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field':'slug'}}