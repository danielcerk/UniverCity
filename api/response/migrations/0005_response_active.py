# Generated by Django 5.1.4 on 2025-01-23 00:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('response', '0004_response_dislike_response_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='response',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
