from django.db import models

# Create your models here.
class Crisis(models.Model):
    
    crisis_type = models.CharField(max_length=50)
    

class CrisisReport(models.Model):
    '''
    Crisis reports received by call center operators
    '''

    STATUS_CHOICES = (
        ('U', 'Unhandled'),
        ('I', 'In Progress'),
        ('S', 'Solved')
    )

    witness_first_name = models.CharField(max_length=20)
    witness_last_name = models.CharField(max_length=20)
    mobile_number = models.CharField(max_length=8)

    street_name = models.CharField(max_length=150)
    crisis_type = models.ForeignKey('Crisis', on_delete=models.CASCADE)
    description = models.TextField()
    injured_people_num = models.IntegerField()

    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    create_date_time = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def get_witness_name(self):
        return "{} {}".format(self.witness_first_name, self.witness_last_name)

class Assistance(models.Model):
    ASSISTANCE_TYPE_CHOICE = (
        ('E', 'Emergency Ambulance'),
        ('R', 'Rescue and Evacuation'),
        ('F', 'Fire-Fighting'),
        ('G', "Gas Leak Control")
    )

    crisis = models.ForeignKey('Crisis', on_delete=models.CASCADE)
    type_of_assistance = models.CharField(max_length=1, choices=ASSISTANCE_TYPE_CHOICE)
    agencies = models.ManyToManyField('Agencies', through='InfoDispatch')


class InfoDispatch(models.Model):
    assistance_type = models.ForeignKey(Assistance, on_delete=models.CASCADE)
    agencies = models.ForeignKey('Agency', on_delete=models.CASCADE)
    notes = models.CharField(max_length=50)
    

class Agency(models.Model):
    name = models.CharField(max_length=50)
    contact_num = models.CharField(max_length=6)


class Facilities(Agency):
    location = models.CharField(max_length=50)

