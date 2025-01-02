from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from django.db.models import Q
from api.profile_user.models import Profile
from api.communities.models import Community
from api.communities.reclamations.models import Reclamations
from api.questions.models import Question
from api.response.models import Response as ResponseModel
from .serializers import (
    CommunitySerializer,
    ProfileSerializer, 
    ReclamationSerializer, 
    ResponseSerializer, 
    QuestionSerializer
)

class SearchAPIView(APIView):

    def get(self, request):

        query = request.query_params.get('q', '').strip()

        if not query:

            return Response({"error": "O paramêtro q é requerido."}, status=HTTP_400_BAD_REQUEST)

        communities = Community.objects.filter(Q(name__icontains=query))
        profiles = Profile.objects.filter(Q(user__name__icontains=query))
        reclamations = Reclamations.objects.filter(Q(title__icontains=query))
        responses = ResponseModel.objects.filter(Q(text__icontains=query))
        questions = Question.objects.filter(Q(title__icontains=query))

        communities_data = CommunitySerializer(communities, many=True).data
        profiles_data = ProfileSerializer(profiles, many=True).data
        reclamations_data = ReclamationSerializer(reclamations, many=True).data
        responses_data = ResponseSerializer(responses, many=True).data
        questions_data = QuestionSerializer(questions, many=True).data

        return Response({
            "communities": communities_data,
            "profiles": profiles_data,
            "reclamations": reclamations_data,
            "responses": responses_data,
            "questions": questions_data,
        }, status=HTTP_200_OK)
