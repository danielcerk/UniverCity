from rest_framework import serializers
from api.communities.models import Community, MemberCommunity
from api.communities.serializers import CommunitySerializer
from api.communities.reclamations.models import Reclamations
from api.questions.models import Question
from django.contrib.auth import get_user_model

User = get_user_model()

class FeedSerializer(serializers.Serializer):

    reclamations_communities = serializers.DictField()
    question_communities = serializers.DictField()

    def to_representation(self, instance):
        # Identificar o usuário
        user = instance['user'].id

        # Buscar comunidades em que o usuário é membro
        member_in_communities = MemberCommunity.objects.filter(user__pk=user).order_by('-created_at')

        # Inicializar estruturas para organizar dados
        communities_data = {}
        reclamations_data = {}
        questions_data = {}

        # Iterar pelas comunidades do usuário
        for member in member_in_communities:
            community = member.community

            # Serializar a comunidade
            community_serializer = CommunitySerializer(community).data
            communities_data[community.id] = community_serializer

            # Buscar reclamações relacionadas à comunidade
            community_reclamations = Reclamations.objects.filter(community=community).order_by('-created_at')
            reclamations_data[community.id] = [
                {
                    'id': reclamation.id,
                    'title': reclamation.title,
                    'slug': reclamation.slug,
                    'content': reclamation.content,
                    'created_at': reclamation.created_at,
                    'user': {
                        'id': reclamation.user.id,
                        'name': f'@{reclamation.user.name}',
                    },
                    'community': {
                        'id': reclamation.community.id,
                        'name': reclamation.community.name,
                        'slug': reclamation.community.slug,
                    },
                }
                for reclamation in community_reclamations
            ]

            # Buscar questões relacionadas à comunidade
            community_questions = Question.objects.filter(community=community).order_by('-created_at')
            questions_data[community.id] = [
                {
                    'id': question.id,
                    'title': question.title,
                    'slug': question.slug,
                    'content': question.content,
                    'created_at': question.created_at,
                    'user': {
                        'id': question.user.id,
                        'name': f'@{question.user.name}',
                    },
                    'community': {
                        'id': question.community.id,
                        'name': question.community.name,
                        'slug': question.community.slug,
                    },
                }
                for question in community_questions
            ]

        return {
            'reclamations_communities': reclamations_data,
            'question_communities': questions_data,
        }
