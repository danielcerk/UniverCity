# Generated by Django 5.1.4 on 2024-12-27 00:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('communities', '0002_alter_community_founded_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reclamations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Título')),
                ('content', models.TextField()),
                ('is_resolved', models.BooleanField(default=False, verbose_name='Resolvido')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communities.community')),
            ],
            options={
                'verbose_name': 'Reclamação',
                'verbose_name_plural': 'Reclamações',
            },
        ),
    ]