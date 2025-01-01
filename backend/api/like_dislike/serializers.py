from rest_framework import serializers

from .models import LikeDislike

class LikeDislikeSerializer(serializers.ModelSerializer):

    class Meta:
        
        model = LikeDislike
        fields = '__all__'