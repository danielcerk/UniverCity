from rest_framework import serializers
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.contrib.auth import get_user_model
from .utils import GetAttributes

from ..communities.models import Community
from ..communities.reclamations.models import Reclamations
from ..questions.models import Question
from ..response.models import Response

User = get_user_model()

class StatusSerializer(serializers.Serializer):

    count_user_per_date = serializers.DictField()

    count_communities_per_date = serializers.DictField()
    count_reclamations_per_date = serializers.DictField()

    count_questions_per_date = serializers.DictField()
    count_response_per_date = serializers.DictField()
    
    status_app = serializers.BooleanField(default=False)
    status_db = serializers.BooleanField(default=False)
    count_users = serializers.IntegerField()
    contribuitors = serializers.ListField(
        child=serializers.DictField()
    )

    def to_representation(self, instance):
       
        get_all_users_count = (

            User.objects.annotate(data=TruncDate('created_at'))
            .values('data')
            .annotate(total=Count('id'))
            .order_by('data')
            
        )

        count_users_per_date = {
            obj['data'].strftime("%d/%m"): obj['total'] for obj in get_all_users_count
        }

        get_all_communities_count = (

            Community.objects.annotate(data=TruncDate('created_at'))
            .values('data')
            .annotate(total=Count('id'))
            .order_by('data')
            
        )

        count_communities_per_date = {
            obj['data'].strftime("%d/%m"): obj['total'] for obj in get_all_communities_count
        }

        get_all_reclamations_count = (

            Reclamations.objects.annotate(data=TruncDate('created_at'))
            .values('data')
            .annotate(total=Count('id'))
            .order_by('data')
            
        )

        count_reclamations_per_date = {
            obj['data'].strftime("%d/%m"): obj['total'] for obj in get_all_reclamations_count
        }

        get_all_questions_count = (

            Question.objects.annotate(data=TruncDate('created_at'))
            .values('data')
            .annotate(total=Count('id'))
            .order_by('data')
            
        )

        count_questions_per_date = {
            obj['data'].strftime("%d/%m"): obj['total'] for obj in get_all_questions_count
        }

        get_all_response_count = (

            Response.objects.annotate(data=TruncDate('created_at'))
            .values('data')
            .annotate(total=Count('id'))
            .order_by('data')
            
        )

        count_response_per_date = {
            obj['data'].strftime("%d/%m"): obj['total'] for obj in get_all_response_count
        }

        count_users = User.objects.all().count()
        contribuitors_users = GetAttributes().get_contribuitors()

        # Recuperar valores de status
        status_app = instance.get('status_app', False)
        status_db = instance.get('status_db', False)

        # Retornar todos os campos
        return {
            'count_user_per_date': count_users_per_date,
            'count_communities_per_date': count_communities_per_date,
            'count_reclamations_per_date': count_reclamations_per_date,
            'count_questions_per_date': count_questions_per_date,
            'count_response_per_date': count_response_per_date,
            'status_app': status_app,
            'status_db': status_db,
            'count_users': count_users,
            'contribuitors': contribuitors_users,
        }