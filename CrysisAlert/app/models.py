from django.db import models

# Create your models here.
class CrisisReport(models.Model):
    '''
    Crisis reports received by call center operators
    '''

    STATUS_CHOICES = (
        ('U', 'Unhandled'),
        ('I', 'In Progress'),
        ('S', 'Solved')
    )

    ASSISTANCE_TYPE_CHOICE = (
        ('E', 'Emergency Ambulance'),
        ('R', 'Rescue and Evacuation'),
        ('F', 'Fire-Fighting'),
        ('G', "Gas Leak Control")
    )

    street_name = models.CharField(max_length=150)
    witness_first_name = models.CharField(max_length=20)
    witness_last_name = models.CharField(max_length=20)
    mobile_number = models.CharField(max_length=8)
    description = models.TextField()
    type_of_assistance = models.CharField(max_length=1, choices=ASSISTANCE_TYPE_CHOICE)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    create_date_time = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def get_witness_name(self):
        return "{} {}".format(self.witness_first_name, self.witness_last_name)

class CrisisReportDetail():
    pass

