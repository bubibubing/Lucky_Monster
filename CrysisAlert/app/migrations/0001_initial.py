# Generated by Django 2.1.1 on 2018-10-25 09:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Agency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('contact_num', models.CharField(max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Assistance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_of_assistance', models.CharField(choices=[('E', 'Emergency Ambulance'), ('R', 'Rescue and Evacuation'), ('F', 'Fire-Fighting'), ('G', 'Gas Leak Control')], max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='Crisis',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crisis_type', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='CrisisReport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('mobile_number', models.CharField(max_length=8)),
                ('street_name', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('injured_people_num', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('U', 'Unhandled'), ('I', 'In_Progress'), ('S', 'Solved')], default='U', max_length=1)),
                ('create_date_time', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='crisis_report', to=settings.AUTH_USER_MODEL)),
                ('crisis_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Crisis')),
            ],
            options={
                'ordering': ('last_modified',),
            },
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('agency_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='app.Agency')),
                ('location', models.CharField(max_length=50)),
            ],
            bases=('app.agency',),
        ),
        migrations.AddField(
            model_name='assistance',
            name='agencies',
            field=models.ManyToManyField(to='app.Agency'),
        ),
        migrations.AddField(
            model_name='assistance',
            name='crisis',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Crisis'),
        ),
    ]
