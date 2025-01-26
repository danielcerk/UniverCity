from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator

from django.contrib.auth import get_user_model

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod

    def get_token(cls, user):

        token = super().get_token(user)

        token['name'] = user.name
        token['email'] = user.email

        return token


class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True, validators=[
            UniqueValidator(queryset=User.objects.all())
        ]
    )

    password = serializers.CharField(
        write_only=True, required=True, 
    )

    class Meta:

        model = User
        fields = ('name', 
            'first_name', 'last_name', 'email', 'password')


    def create(self, validated_data):

        user = User.objects.create(

            name = validated_data['name'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email = validated_data['email']

        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class UserSerializer(serializers.ModelSerializer):

    class Meta:

        model = User
        fields = ('id', 'name', 'email', 'first_name', 'last_name')