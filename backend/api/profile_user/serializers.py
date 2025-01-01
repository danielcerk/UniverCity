from rest_framework import serializers

from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='user.full_name', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    phone = serializers.CharField()

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:

        model = Profile
        fields = ['id','name', 'full_name',
                   'slug', 'email', 'biografy', 'phone', 'created_at', 'updated_at']

        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field':'slug'}}

    def __init__(self, *args, **kwargs):

        fields = kwargs.pop("fields", None)
        super().__init__(*args, **kwargs)

        if fields:

            allowed = set(fields)
            existing = set(self.fields.keys())

            for field in existing - allowed:
                
                self.fields.pop(field)