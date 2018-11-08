from celery.decorators import periodic_task
from celery import shared_task
from django.core.mail import send_mail
import time
from app.models import CrisisReport
from datetime import datetime,timedelta
from django.utils import timezone
from dateutil import tz
import string
import random

# Set up a periodic task to send email automatically every 30 min.
@periodic_task(run_every=3 * 60)
def sendmail():
	# Get aimed crisis reports from database
	to_zone = tz.gettz('Asia/Singapore')
	time = timezone.now().astimezone(to_zone)-timedelta(minutes=30)
	all_crisis = getCrisis(time)
	
	# Get the record of description, time, location, type and status of each crisis record.
	report_id = id_generator()
	no_of_crisis = len(all_crisis)
	email = "Report ID: " + report_id + "\nDate: " + timezone.now().strftime("%Y-%m-%d") + "\nNumber of crisis: " + str(no_of_crisis)
	report = ""
	for r in all_crisis:
		crisis = "\nDescription: " + str(r.description) + "		Time: " + r.create_date_time.strftime("%Y-%m-%d %H:%M:%S") + " 	Location: " + str(r.street_name) + " 	Type:" + str(r.crisis_type) + " 	Status: " + str(r.status) + "\n"
		report += crisis
	if report == "":
		report = '\nNo updated crisis in this half hour.'
	email += report
	
	# Send crisis report through email
	send_mail(
		'Crisis Report',
		email,
		'primeminister3003@gmail.com',
		['crisisalertlm@gmail.com'],
		fail_silently=False,)
	print(report)
	return True

# Generate report id
def id_generator(size=14, chars=string.ascii_lowercase + string.digits):
   return ''.join(random.choice(chars) for _ in range(size))

# Filter the crisis reports that is created within 30 min.
def getCrisis(time):
	report = CrisisReport.objects.filter(create_date_time__gte=time)
	return report

@shared_task
def hello():
	print("Hello there!")
