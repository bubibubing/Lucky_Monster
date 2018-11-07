from django.shortcuts import render
from django.contrib import messages
from app.models import *
import nexmo
import facebook
from twython import Twython
import tweepy
from django.core.mail import send_mail
import threading
from datetime import datetime,timedelta
from django.utils import timezone
from dateutil import tz

def sms(request):
	context = locals()
	template = 'sms.html'
	to_zone = tz.gettz('Asia/Singapore')
	time = timezone.now().astimezone(to_zone)-timedelta(minutes=30)
	
	# timer = threading.Timer(1, hour_timer)
	# timer.start()
	if request.method =='POST':
		actionType = 'Fire-Fighting'
		info = getInfo(actionType)
		report = getCrisis(time)
		
		#get crisis report detail
		no_of_crisis = len(report)
		print(no_of_crisis)
		for r in report:
				print((r.create_date_time).astimezone(to_zone))

		# if info == None:
		# 	messages.error(request,'Invaild required type.')
		# else:
		# 	s = sendSMS(info)
		# 	f = facebookPost(info)
		# 	t = twitterPost(info)
		# 	if s == False:
		# 		messages.error(request,'Fail to sent SMS to the relevant agency.')
		# 	elif f == False:
		# 		messages.error(request,'Fail to psot on Facebook.')
		# 	elif t == False:
		# 		messages.error(request,'Fail to psot on Twitter.')
		# 	else:
		# 		messages.success(request, 'SMS has sent to relevant agencies. Also, the crisis alert have been put up to Facebook and Twitter.')

		return render(request,template,context)
	else:
		return render(request,template,context)

def getCrisis(time):
	'''
	This method gets all crisis report within last 30 minutes
	Args:
        actionType (string): The require action of the crisis event
    Returns:
        report (QuerySet): crisis report within last 30 minutes
    '''
	report = CrisisReport.objects.filter(create_date_time__gte=time)
	return report


def getInfo(actionType):
	'''
	This method gets the information of crisis event such as relevant agency, contact number of the agency and action to carry
	Args:
        actionType (string): The require action of the crisis event
    Returns:
        msg (python object): A python object that contains necessary information needed for sending sms, such as relevant agency, contact number of the agency and action to carry
	'''
	assistant = Assistance.objects.get(type_of_assistance=actionType)
	infoDispatch = InfoDispatch.objects.get(assistance_type=assistant)
	agent = infoDispatch.agencies
	note = infoDispatch.notes
	agency = Agency.objects.get(name=agent)
	contact = agency.contact_num

	if agent != None and note != None and contact != None:
		info={
			"agent":agent,
			"contact":contact,
			"note":note
		}
		return info
	return None

def sendSMS(info):
	'''
	This method gets the information of crisis event such as time, venue, brief description of the 
	crisis event and the action reuqired to deal with the crisis event. It takes in the request from
	the front-end and sends the SMS to the relevant agencies.
	Args:
        msg (python object): A python object that contains necessary information needed for sending sms, such as relevant agency, contact number of the agency and action to carry
    Returns:
        True/False (Boolean): Return True if it is successfully send the sms to the relevant agencies. Return False otherwise.
	'''

	api_key = 'XXX'
	api_secret = 'XXX'
	client = nexmo.Client(key=api_key, secret=api_secret)
	response = client.send_message({'from': 'Crisis Alert', 'to': info['contact'], 'text': info['note']})

	response = response['messages'][0]

	if response['status'] == '0':
		print(response['message-id'])
	else:
		print(response['error-text'])
		return False
	return True


def facebookPost(info):
	'''
	This method gets the suggested actions based on the type of action required and post the crisis alert with suggested actions on Facebook to alert the public
	Also, the public could share the post and broadcast to their friends.
	Args:
        msg (python object): A python object that contains necessary information needed for sending sms, such as relevant agency, contact number of the agency and action to carry
    Returns:
        True/False (Boolean): Return True if it is successfully posted on Facebook. Return False otherwise.
	'''

	fcfg={
		"page_id":"XXX",
		"access_token":"XXX"
	}
	g=facebook_api(fcfg)
	if g != None:
		status = g.put_object("me", "feed", message=info['note'])
		# status=g.put_wall_post(info['note'])
		return True
	return False


def twitterPost(info):
	'''
	This method gets the suggested actions based on the type of action required and post the crisis alert with suggested actions on Twitter to alert the public
	Also, the public could share the post and broadcast to their friends.
	Args:
        msg (python object): A python object that contains necessary information needed for sending sms, such as relevant agency, contact number of the agency and action to carry
    Returns:
        True/False (Boolean): Return True if it is successfully posted on Twitter. Return False otherwise.
	'''
	tcfg={
		"consumer_secret":"XXX",
		"consumer_key":"XXX",
		"access_token":"XXX",
		"access_token_secret":"XXX"
	}
	tapi = twitter_api(tcfg)
	if tapi != None:
		tapi.update_status(info['note'])
		return True
	return False

# Send crisis report through email.
# def send_email():
# 	# Get crisis records which happened or was modified 30min ago from database.
# 	'''
# 	crisis_report = CrisisReport.objects.filter(create_date_time >= datetime.datetime.now() - datetime.timedelta(seconds=1800)
# 		or last_modified >= datetime.datetime.now() - datetime.timedelta(seconds=1800))
# 	if crisis_report is None:
# 		crisis_report = 'No updated crisis in this half hour.'
# 	'''
# 	send_mail(
# 		'Crisis Report',
# 		"Hello World",
# 		'primeminister3003@gmail.com',
# 		['crisisalertlm@gmail.com'],
# 		fail_silently=False,)


def facebook_api(fcfg):
	'''
	This method setup the connection with the Facebook Graph API
	Args:
        fcfg (python object): The access credential of the Facebook Graph API
    Returns:
        graph(GraphAPI): Return the GraphAPI object that is connected and successfully accessed
	'''

	graph = facebook.GraphAPI(fcfg['access_token'])
	# Get page token to post as the page.
	resp = graph.get_object('me/accounts')
	page_access_token = None
	for page in resp['data']:
		if page['id'] == fcfg['page_id']:
			page_access_token = page['access_token']
	graph = facebook.GraphAPI(page_access_token)
	return graph


def twitter_api(tcfg):
	'''
	This method setup the connection with the Twitter API
	Args:
        tcfg (python object): The access credential of the Twitter API
    Returns:
        tapi(twitterAPI): Return the Twitter API object that is connected and successfully accessed
	'''
	auth = tweepy.OAuthHandler(tcfg['consumer_key'], tcfg['consumer_secret'])
	auth.set_access_token(tcfg['access_token'], tcfg['access_token_secret'])

	tapi = tweepy.API(auth)
	return tapi

# Set a timer that sends email every half an hour.
# 30min = 1800s
# def hour_timer():
# 	send_email()
# 	global timer
#     timer = threading.Timer(1800, hour_timer)
# 	timer.start()