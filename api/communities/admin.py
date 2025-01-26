from django.contrib import admin
from .models import Community, MemberCommunity

@admin.register(Community)
class CommunityModelAdmin(admin.ModelAdmin):

    list_display = ('name', 'slug', 'short_small_description',
                    'located_in', 'founded_at', 'members',
                    'is_verified')
    
    list_filter = ('name', 'located_in', 'founded_at',
                   'is_verified')
    
    def short_small_description(self, obj):
        
        return (obj.small_description[:15] + '...') if len(obj.small_description) > 15 else obj.small_description

    short_small_description.short_description = 'Small Description'

@admin.register(MemberCommunity)
class MemberCommunityAdmin(admin.ModelAdmin):

    list_display = (
        'community', 'user', 
        'active', 'created_at', 'updated_at'
    )

    list_filter = (
        'community', 'active'
    )