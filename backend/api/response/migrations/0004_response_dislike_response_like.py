# Generated by Django 5.1.4 on 2024-12-27 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('response', '0003_response_response_re_content_eba467_idx'),
    ]

    operations = [
        migrations.AddField(
            model_name='response',
            name='dislike',
            field=models.PositiveBigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='response',
            name='like',
            field=models.PositiveBigIntegerField(default=0),
        ),
    ]
