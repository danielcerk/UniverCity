from django.contrib import admin
from .models import LikeDislike

@admin.register(LikeDislike)
class LikeDislikeModelAdmin(admin.ModelAdmin):

    list_display = ('user', 'like_dislike_object', 'object_id',
        'is_like', 'created_at')
    readonly_fields = ('like_dislike_object',)
