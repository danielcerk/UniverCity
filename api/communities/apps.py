from django.apps import AppConfig


class CommunitiesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.communities'

    def ready(self):
        
        import api.communities.signals
