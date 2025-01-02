from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.mail import send_mail

from .models import UserProfile

message = '''

Ei %s,

Estamos muito felizes em ter você conosco na UniverCity! Nossa missão é ajudar a tirar dúvidas de calouros, reclamações e mais de universidades .

Seja muito bem-vindo(a)!

Atenciosamente,

Equipe UniverCity.

'''

@receiver(post_save, sender=UserProfile)
def create_user_profile(sender, instance, created, **kwargs):

	if created:

		# Send Email to user
		
		greeting_message = message % instance.name

		send_mail(
			'Bem-Vindo a UniverCity! O lugar para você conhecer sua universidade.',
			greeting_message,
			'suporteconstsoft@gmail.com',
			[instance.email],
			fail_silently=False,

		)
		