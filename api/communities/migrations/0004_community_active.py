# Generated by Django 5.1.4 on 2025-01-23 00:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0003_alter_community_city_alter_community_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
