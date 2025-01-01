from rest_framework import serializers

from api.communities.models import Community

class CommunitySerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Community
        fields = ['id','name', 'slug', 'small_description',
                  'site', 'city', 'state', 'located_in',
                  'founded_at', 'members', 'is_verified',
                  'created_at', 'updated_at']

        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field':'slug'}}