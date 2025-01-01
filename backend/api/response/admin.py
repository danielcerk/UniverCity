from django.contrib import admin
from .models import Response

@admin.register(Response)
class ResponseModelAdmin(admin.ModelAdmin):

    list_display = ('user', 'content_object', 'object_id',
     'text','like', 'dislike',
     'created_at')

    readonly_fields = ('content_object',)