# Generated by Django 2.1.1 on 2018-10-19 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20181019_1128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assistance',
            name='type_of_assistance',
            field=models.CharField(max_length=20),
        ),
    ]
