from rest_framework import serializers

from .models import Response

class ResponseSerializers(serializers.ModelSerializer):

    author = serializers.CharField(source='user.name', read_only=True)
    author_slug = serializers.CharField(source='user.profile.slug', read_only=True)

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        
        model = Response
        fields = ['id','user','author','object_id', 'content_type', 'author_slug', 'text', 'like', 
                  'dislike', 'created_at', 'updated_at']