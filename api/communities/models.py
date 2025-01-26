from django.db import models
from cities_light.models import Region, SubRegion
from django.contrib.auth import get_user_model
from django.utils.text import slugify

import itertools

User = get_user_model()

class Community(models.Model):

    name = models.CharField(max_length=255, 
        verbose_name='Nome')
    slug = models.SlugField(max_length=255, 
        unique=True, blank=True)
    small_description = models.TextField(
        verbose_name='Descrição')

    site = models.URLField(null=True, blank=True,
        verbose_name='Site')

    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)

    located_in = models.CharField(max_length=255,
        verbose_name='Localização', blank=True)
    founded_at = models.DateField(null=True, 
        blank=True, verbose_name='Data de fundação')

    members = models.PositiveBigIntegerField(default=0, 
        verbose_name='Número de participantes')

    is_verified = models.BooleanField(default=False)

    active = models.BooleanField(default=True, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        verbose_name = 'Comunidade/Universidade'
        verbose_name_plural = 'Comunidades/Universidades'

    def save(self, *args, **kwargs):

        self.located_in = f'{self.city}, {self.state}'

        if not self.slug or (self.pk and Community.objects.filter(pk=self.pk).exists() and 
                             Community.objects.get(pk=self.pk).name != self.name):
                
            base_slug = slugify(self.name)
            
            slug = base_slug
            
            for x in itertools.count(1):
                
                if not Community.objects.filter(slug=slug).exists():
                    
                    break
                
                slug = f'{base_slug}-{x}'
                
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):

        return self.name
    
class MemberCommunity(models.Model):

    community = models.ForeignKey(Community, 
        on_delete=models.CASCADE, verbose_name='Comunidade')
    
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name='Membro'
    )

    active = models.BooleanField(default=True, verbose_name='Ativo')

    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name='Atualizado em'
    )

    class Meta:

        verbose_name = 'Membro'
        verbose_name_plural = 'Membros'

    def save(self, *args, **kwargs):

        community = Community.objects.get(pk=self.community.pk)

        community.members += 1
        community.save()

        super().save(*args, **kwargs)

    def __str__(self):

        return f'{self.user.name} - {self.community.name}'
