# Generated by Django 5.1.4 on 2024-12-27 00:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cities_light', '0011_alter_city_country_alter_city_region_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nome')),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True)),
                ('small_description', models.TextField(verbose_name='Descrição')),
                ('site', models.URLField(blank=True, null=True, verbose_name='Site')),
                ('located_in', models.CharField(max_length=255, verbose_name='Localização')),
                ('founded_at', models.DateField(blank=True, null=True, verbose_name='Localização')),
                ('members', models.PositiveBigIntegerField(default=0, verbose_name='Número de participantes')),
                ('is_verified', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='localizacoes', to='cities_light.subregion', verbose_name='Cidade')),
                ('state', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='localizacoes', to='cities_light.region', verbose_name='Estado')),
            ],
            options={
                'verbose_name': 'Comunidade/Universidade',
                'verbose_name_plural': 'Comunidades/Universidades',
            },
        ),
    ]
