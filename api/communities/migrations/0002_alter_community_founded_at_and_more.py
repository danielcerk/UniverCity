# Generated by Django 5.1.4 on 2024-12-27 00:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('communities', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='community',
            name='founded_at',
            field=models.DateField(blank=True, null=True, verbose_name='Data de fundação'),
        ),
        migrations.AlterField(
            model_name='community',
            name='located_in',
            field=models.CharField(blank=True, max_length=255, verbose_name='Localização'),
        ),
    ]
