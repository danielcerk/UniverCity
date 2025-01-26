from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings

User = settings.AUTH_USER_MODEL

class GenericContent(models.Model):
    like_dislike_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name='Curtida/Não curtida',
        related_name='likes_dislikes',
        null=True
    )
    object_id = models.PositiveIntegerField()
    like_dislike_object = GenericForeignKey('like_dislike_type', 'object_id')

    class Meta:

        abstract = True

class LikeDislike(GenericContent):
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Usuário',
        related_name='likes_dislikes'
    )
    is_like = models.BooleanField(default=False, verbose_name="É curtida")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Interação'
        verbose_name_plural = 'Interações'
        unique_together = ('user', 'like_dislike_type', 'object_id')

    def save(self, *args, **kwargs):
        
        existing_interaction = LikeDislike.objects.filter(
            user=self.user,
            like_dislike_type=self.like_dislike_type,
            object_id=self.object_id
        ).first()

        if existing_interaction:

            if existing_interaction.is_like == self.is_like:
                
                existing_interaction.is_like = False
            
            else:
                
                existing_interaction.is_like = True

            existing_interaction.save()

        like_dislike_object = self.like_dislike_object

        if like_dislike_object:

            if self.is_like and hasattr(like_dislike_object, 'like'):

                like_dislike_object.like = models.F('like') + 1

            elif not self.is_like and hasattr(like_dislike_object, 'dislike'):

                like_dislike_object.dislike = models.F('dislike') + 1

            like_dislike_object.save()

    def delete(self, *args, **kwargs):

        like_dislike_object = self.like_dislike_object

        if like_dislike_object:

            if self.is_like and hasattr(like_dislike_object, 'like'):

                like_dislike_object.like = models.F('like') - 1

            elif not self.is_like and hasattr(like_dislike_object, 'dislike'):
                
                like_dislike_object.dislike = models.F('dislike') - 1

            like_dislike_object.save()

        super().delete(*args, **kwargs)


    def __str__(self):

        action = "curtiu" if self.is_like else "não curtiu"

        return f"{self.user} {action} {self.like_dislike_object}"