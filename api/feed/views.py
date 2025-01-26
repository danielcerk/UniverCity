from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import FeedSerializer

from django.contrib.auth import get_user_model

User = get_user_model()

class FeedView(APIView):

    def get(self, request, *args, **kwargs):

        id = self.kwargs.get('id')

        user = get_object_or_404(User, pk=id)

        serializer = FeedSerializer(instance={'user': user})

        return Response(serializer.data)