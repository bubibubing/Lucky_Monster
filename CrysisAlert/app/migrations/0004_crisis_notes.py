# Generated by Django 2.1.1 on 2018-11-07 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20181029_1152'),
    ]

    operations = [
        migrations.AddField(
            model_name='crisis',
            name='notes',
            field=models.TextField(default=''),
        ),
    ]