from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileModelAdmin(admin.ModelAdmin):

    list_display = ('user', 'slug', 'phone', 'is_moderator',
        'created_at', 'updated_at')
    
    list_filter = ('is_moderator',)