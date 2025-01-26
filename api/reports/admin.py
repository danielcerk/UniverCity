from django.contrib import admin

from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):

    list_display = (
        'user', 'content_object', 
        'object_id', 'description', 'status',
        'created_at', 'updated_at'
    )

    list_filter = (
        'user', 'status'
    )