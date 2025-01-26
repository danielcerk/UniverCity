from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import (

    IsAuthenticatedOrReadOnly,
    BasePermission,
    SAFE_METHODS

)

from .serializers import ReportSerializers
from .models import Report

from api.communities.models import Community
from api.communities.reclamations.models import Reclamations
from api.profile_user.models import Profile
from api.questions.models import Question
from api.response.models import Response as ResModel

from django.contrib.contenttypes.models import ContentType

class IsAuthorOrReadOnly(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:

            return True

        return obj.user == request.user


class ReportViewSet(ModelViewSet):

    permission_classes = [IsAuthorOrReadOnly, IsAuthenticatedOrReadOnly]
    serializer_class = ReportSerializers

    def get_queryset(self):
        # Usando kwargs para acessar os parâmetros na URL
        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        if content_type_id and object_id:
            content_type = ContentType.objects.get(id=content_type_id)
            return Report.objects.filter(content_type=content_type, object_id=object_id)
        
        return Report.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        report = Report.objects.all()
        serializer = ReportSerializers(report, many=True)

        if not content_type_id or not object_id:
            return Response(serializer.data, status=status.HTTP_200_OK)

        try:
            content_type = ContentType.objects.get(id=content_type_id)
            reports = Report.objects.filter(content_type=content_type, object_id=object_id)
            serializer = ReportSerializers(reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ContentType.DoesNotExist:
            return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')

        data = request.data

        # Verifica se os argumentos da rota estão presentes
        if content_type_id and object_id:
            try:
                content_type = ContentType.objects.get(id=content_type_id)
            except ContentType.DoesNotExist:
                return Response({'error': 'Content type not found'}, status=status.HTTP_404_NOT_FOUND)

            # Atualiza os dados com os valores da rota
            data.update({
                'content_type': content_type.id,
                'object_id': object_id
            })

        # Criação normal, caso os argumentos da rota não estejam presentes
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, *args, **kwargs):
        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')
        pk = kwargs.get('pk')

        try:
            content_type = ContentType.objects.get(id=content_type_id)
            report = Report.objects.get(content_type=content_type, object_id=object_id, pk=pk)
            serializer = ReportSerializers(report)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except (ContentType.DoesNotExist, Report.DoesNotExist):
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):

        content_type_id = self.kwargs.get('content_type_id')
        object_id = self.kwargs.get('object_id')
        pk = self.kwargs.get('pk')

        try:

            content_type = ContentType.objects.get(id=content_type_id)
            report = Report.objects.get(content_type=content_type, object_id=object_id, pk=pk)

            if not request.user.profile.is_moderator:

                raise PermissionDenied("Você não tem permissão para editar uma denúncia")
            
            
            serializer = ReportSerializers(report, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data)
        
        except Profile.DoesNotExist:

            raise NotFound("Perfil não encontrado.")