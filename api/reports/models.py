from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth import get_user_model

User = get_user_model()

class GenericContent(models.Model):

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name='Tipo de conteúdo',
        related_name='reports'
    )

    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:

        abstract = True

class Report(GenericContent):

    class StatusOptions(models.TextChoices):

        APROVADO = 'APROVADO', 'Aprovado'
        PENDENTE = 'PENDENTE', 'Pendente'
        REJEITADO = 'REJEITADO', 'Rejeitado'

    user = models.ForeignKey(User, on_delete=models.CASCADE,
        verbose_name='Reportador')

    description = models.TextField(blank=True,verbose_name='Descriçaõ')

    status = models.CharField(
        max_length=255,
        default=StatusOptions.PENDENTE,
        choices=StatusOptions.choices,

    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:

        verbose_name = 'Denúncia'
        verbose_name_plural = 'Denúncias'

        indexes = [

            models.Index(fields=["content_type", "object_id"]),
            
        ]

    def save(self, *args, **kwargs):

        if self.status == 'PENDENTE':

            super().save(*args, **kwargs)

        elif self.status == 'APROVADO':

            if self.content_type.model in ['reclamations', 'question', 'response']:

                content_object = self.content_object

                if content_object:

                    super().save(*args, **kwargs)

                    content_object.refresh_from_db()
                    content_object.delete()
  
        elif self.status == 'REJEITADO':

            self.delete()

            return

    def __str__(self):

        return self.user.name