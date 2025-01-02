from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionModelAdmin(admin.ModelAdmin):

    list_display = ('community', 
        'user__name','title', 'content','like','dislike', 'created_at',
        'updated_at')