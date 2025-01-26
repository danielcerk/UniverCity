from django.dispatch import receiver
from django.db.models.signals import pre_delete

from .models import MemberCommunity, Community

@receiver(pre_delete, sender=MemberCommunity)
def decrement_member_of_community(sender, instance, **kwargs):

    community = Community.objects.get(pk=instance.community.pk)
    
    community.members -= 1
    community.save()