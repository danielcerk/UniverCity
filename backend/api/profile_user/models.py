from django.db import models

from django.conf import settings

# from phonenumber_field.modelfields import PhoneNumberField

from django.utils.text import slugify

import itertools

User = settings.AUTH_USER_MODEL

class Profile(models.Model):

    user = models.OneToOneField(User, 
        on_delete=models.CASCADE, verbose_name='Usuário')
    slug = models.SlugField(max_length=100, unique=False,
        verbose_name='Slug', null=True, blank=True)
    biografy = models.TextField(null=True, 
        blank=True, verbose_name='Biografia')
    phone = models.CharField(null=True, blank=True, unique=True,
        verbose_name ='Celular', max_length=11)
    
    is_moderator = models.BooleanField(
        default=False, 
        verbose_name='Moderador',
        help_text='Indica se este perfil é de um moderador.'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True, 
        verbose_name='Atualizado em'
    )

    class Meta:

        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfis'

    def save(self, *args, **kwargs):

        self.is_moderator = True if self.user.is_superuser or self.user.is_staff else False

        if not self.slug or (self.pk and Profile.objects.filter(pk=self.pk).exists() and 
                             Profile.objects.get(pk=self.pk).user.name != self.user.name):
                
            base_slug = slugify(self.user.name)
            
            slug = base_slug
            
            for x in itertools.count(1):
                
                if not Profile.objects.filter(slug=slug).exists():
                    
                    break
                
                slug = f'{base_slug}-{x}'
                
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        
        return f'Perfil de {self.user.name} - ( {self.user.first_name} {self.user.last_name} )'

