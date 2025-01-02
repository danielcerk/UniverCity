from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Você foi registrado!",
                "user": {
                    "name": user.name,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )

class LogoutAPIView(APIView):

    permission_classes = (AllowAny,)

    def post(self, request):

        try:

            refresh_token = request.data['refresh_token']

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        
        except Exception as e:

            return Response(status=status.HTTP_400_BAD_REQUEST)