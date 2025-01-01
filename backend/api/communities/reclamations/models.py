from django.db import models
from ..models import Community

from django.conf import settings

from django.contrib.contenttypes.fields import GenericRelation
from api.response.models import Response
from api.like_dislike.models import LikeDislike

from django.utils.text import slugify

import itertools

User = settings.AUTH_USER_MODEL

class Reclamations(models.Model):

    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    slug = models.SlugField(max_length=255, 
        unique=True, blank=True)

    title = models.CharField(max_length=255, verbose_name='Título')
    content = models.TextField(verbose_name='Reclamação')

    like = models.PositiveBigIntegerField(default=0)
    dislike = models.PositiveBigIntegerField(default=0)

    likes_dislikes = GenericRelation(LikeDislike,
        object_id_field='object_id', content_type_field='like_dislike_type')
    responses = GenericRelation(Response, 
        object_id_field='object_id', content_type_field='content_type')
    
    responses_count = models.PositiveBigIntegerField(default=0)

    is_resolved = models.BooleanField(default=False,
        verbose_name='Resolvido')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        verbose_name = 'Reclamação'
        verbose_name_plural = 'Reclamações'

    def save(self, *args, **kwargs):

        if not self.slug or (self.pk and Reclamations.objects.filter(pk=self.pk).exists() and 
                             Reclamations.objects.get(pk=self.pk).title != self.title):
                
            base_slug = slugify(self.title)
            
            slug = base_slug
            
            for x in itertools.count(1):
                
                if not Reclamations.objects.filter(slug=slug).exists():
                    
                    break
                
                slug = f'{base_slug}-{x}'
                
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):

        return 'a reclamação de %s sobre "%s" na comunidade %s' % (self.user.name, 
            self.title, self.community.name)