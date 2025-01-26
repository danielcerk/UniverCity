from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.contenttypes.fields import GenericRelation
from api.like_dislike.models import LikeDislike
from api.reports.models import Report

from django.db.models import F

User = settings.AUTH_USER_MODEL

class GenericContent(models.Model):

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name='Tipo de conteúdo',
        related_name='responses'
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        abstract = True

class Response(GenericContent):

    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        verbose_name='Usuário')
    text = models.TextField(verbose_name='Conteúdo')

    like = models.PositiveBigIntegerField(default=0)
    dislike = models.PositiveBigIntegerField(default=0)

    likes_dislikes = GenericRelation(LikeDislike,
        object_id_field='object_id', content_type_field='like_dislike_type')

    reports = GenericRelation(Report,
        object_id_field='object_id', content_type_field='content_type')

    active = models.BooleanField(default=True, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        verbose_name = 'Resposta'
        verbose_name_plural = 'Respostas'

        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def save(self, *args, **kwargs):
        is_new = self.pk is None 

        super().save(*args, **kwargs)

        if self.content_type.model in ['reclamations', 'question']:

            content_object = self.content_object

            message = f'@{self.user.name} respondeu seu conteúdo com "{self.text}".'

            send_mail(
                f'@{self.user.name} respondeu seu conteúdo.',
                message,
                'suporteconstsoft@gmail.com',
                [content_object.user.email],
                fail_silently=False,

            )

            if is_new:
                
                content_object.responses_count = F('responses_count') + 1

            else:
                
                pass

            content_object.save(update_fields=['responses_count'])
            content_object.refresh_from_db(fields=['responses_count'])

    def delete(self, *args, **kwargs):

        if self.content_type.model in ['reclamations', 'question']:

            content_object = self.content_object

            content_object.responses_count = F('responses_count') - 1
            content_object.save(update_fields=['responses_count'])
            content_object.refresh_from_db(fields=['responses_count'])

        super().delete(*args, **kwargs)



    def __str__(self):

        return f'a resposta de {self.user.name} {self.content_object}'
