from django.contrib import admin
from .models import Reclamations

@admin.register(Reclamations)
class ReclamationModelAdmin(admin.ModelAdmin):

    list_display = ('title','community__name', 'user__name','like',
                    'dislike', 'is_resolved')
    list_filter = ('community__name', 'is_resolved')