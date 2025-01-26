from rest_framework import serializers

from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='user.full_name', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=False)
    last_name = serializers.CharField(source='user.last_name', read_only=False)
    name = serializers.CharField(source='user.name', read_only=False)
    email = serializers.EmailField(source='user.email', read_only=False)

    phone = serializers.CharField()

    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:

        model = Profile
        fields = ['id','name','first_name', 'last_name', 'full_name',
                   'slug', 'email', 'biografy', 'is_moderator', 'phone', 'created_at', 'updated_at']

        lookup_field = 'slug'
        extra_kwargs = {'url': {'lookup_field':'slug'}}

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():

            if attr == "user":

                user_data = value

                for user_attr, user_value in user_data.items():

                    setattr(instance.user, user_attr, user_value)

            else:
                
                setattr(instance, attr, value)

        instance.user.save()
        instance.save()

        return instance

    def __init__(self, *args, **kwargs):

        fields = kwargs.pop("fields", None)
        super().__init__(*args, **kwargs)

        if fields:

            allowed = set(fields)
            existing = set(self.fields.keys())

            for field in existing - allowed:
                
                self.fields.pop(field)