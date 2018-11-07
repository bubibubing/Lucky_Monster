from django.db import models
from django.contrib import auth
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Create your models here.
class Crisis(models.Model):
    crisis_type = models.CharField(max_length=50, unique=True)
    notes = models.TextField(default="")

    def __str__(self):
        return self.crisis_type

    class Meta:
        app_label = "app"

class CrisisReport(models.Model):
    '''
    Crisis reports received by call center operators
    '''

    STATUS_CHOICES = (
        ('U', 'Unhandled'),
        ('I', 'In_Progress'),
        ('S', 'Solved')
    )

    name = models.CharField(max_length=50)
    mobile_number = models.CharField(max_length=8)

    street_name = models.CharField(max_length=150)
    crisis_type = models.ForeignKey('Crisis', related_name="crisis" ,on_delete=models.CASCADE)
    assistance = models.ManyToManyField('Assistance', related_name='assistance')
    description = models.TextField()
    injured_people_num = models.IntegerField(blank=True, null=True)

    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='U')
    create_date_time = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('auth.User', related_name="reports", on_delete=models.CASCADE)


    class Meta:
        app_label = "app"
        ordering = ('last_modified',)

    def __str__(self):
        return "%s %s | %s" % (self.id, self.name, self.create_date_time.strftime('%B %d %Y %H:%M:%S'))


class Assistance(models.Model):
    ASSISTANCE_TYPE_CHOICE = (
        ('E', 'Emergency Ambulance'),
        ('R', 'Rescue and Evacuation'),
        ('F', 'Fire-Fighting'),
        ('G', "Gas Leak Control")
    )

    #crisis = models.ForeignKey('Crisis', on_delete=models.CASCADE)
    type_of_assistance = models.CharField(max_length=1, choices=ASSISTANCE_TYPE_CHOICE)
    agencies = models.ManyToManyField('Agency')

    class Meta:
        app_label = "app"
        # ordering = ('crisis.id')

    def __str__(self):
        return self.get_type_of_assistance_display()


class Agency(models.Model):
    name = models.CharField(max_length=50)
    contact_num = models.CharField(max_length=8)

    class Meta:
        app_label = "app"

    def __str__(self):
        return self.name


class Facility(Agency):
    location = models.CharField(max_length=50)

    class Meta:
        app_label = "app"

    def __str__(self):
        return self.name
