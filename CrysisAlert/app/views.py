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

def info_dispatch(crisis_report):
	info = getInfo(crisis_report)
	if not info:
		print('Invaild required type.')
	else:
		try:
			sendSMS(info)
		except Exception:
			print('Fail to sent SMS to the relevant agency.')
			pass
		try:
			facebookPost(info)
		except Exception:
			print('Fail to post on Facebook.')
			pass
		try:
			twitterPost(info)
		except:
			print("Fail to post on Twitter")
			pass

		# if s == False:
		# 	messages.error(request,'Fail to sent SMS to the relevant agency.')
		# elif f == False:
		# 	messages.error(request,'Fail to psot on Facebook.')
		# elif t == False:
		# 	messages.error(request,'Fail to psot on Twitter.')
		# else:
		# 	messages.success(request, 'SMS has sent to relevant agencies. Also, the crisis alert have been put up to Facebook and Twitter.')


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


def getInfo(crisis_report):
	'''
	This method gets the information of crisis event such as relevant agency, contact number of the agency and action to carry
	Args:
        actionType (string): The require action of the crisis event
    Returns:
        msg (python object): A python object that contains necessary information needed for sending sms, such as relevant agency, contact number of the agency and action to carry
	'''
	# assistant = Assistance.objects.get(type_of_assistance=actionType)
	# infoDispatch = InfoDispatch.objects.get(assistance_type=assistant)
	# agent = infoDispatch.agencies
	# note = infoDispatch.notes
	# agency = Agency.objects.get(name=agent)
	# contact = agency.contact_num


	crisis = crisis_report["crisis_type"]
	crisis_type = crisis.crisis_type
	crisis_notes = crisis.notes
	witness_name = crisis_report['name']
	witness_contact = crisis_report['mobile_number']
	street_name = crisis_report['street_name']
	description = crisis_report['description']
	injured_people = crisis_report['injured_people_num']
	contact = []
	for assistance in crisis_report['assistance']:
		for agent in assistance.agencies.all():
			contact.append("+65"+agent.contact_num)
	
	info={
		"crisis_type": crisis_type,
		"witness_name": witness_name,
		"witness_contact": witness_contact,
		"street": street_name,
		"contact": contact,
		"notes": crisis_notes,
		"description": description,
		"injured_people": injured_people,	
	}
	print(info)
	return info

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

	api_key = '584b637b'
	api_secret = '6SkVXAWV6U0LtPkO'
	client = nexmo.Client(key=api_key, secret=api_secret)
	response = client.send_message({
		'from': 'Crisis Alert', 
		'to': info['contact'][0], 
		'text': "Crisis type: {}\nStreet: {}\nDescription: {}\nWitness name: {}\nWitness Contact: {}".format(
			info["crisis_type"], info["street"], info["description"], info["witness_name"], info["witness_contact"]) 			
	})

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
		"page_id":"538078229937423",
		"access_token":"EAAYNHre91MMBADbwqws8GxQZChPFOzDygB11yRo8dTAxOfe4PIAOzkFlywNN1ZAlB4oxjycGFU1F4ZCZB910hpehQ4ZA6rMcK6mFoOY6azo88D1ZCwtrF7hZAZAIvoNGjrBUoZCPb3ZA3NMjMrsXDlXWvXR0YHZBUPWGkG0XrZCSaUGnsXqdHD4KoZCXcZBH9GfJDCZC4ZBbKPdOometbwZDZD",
	}
	g = facebook_api(fcfg)
	if g != None:
		message = "Crisis type: {}\nStreet: {}\nDescription: {}\nAdvice: {}\n".format(
			info["crisis_type"], info["street"], info["description"], info["notes"])
		status = g.put_object("me", "feed", message=message)
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
		"consumer_secret":"xJWTezAVPP1eLW312Wt9NAZWObE1Kr0jpRTX993Y6cewlR0PLU",
		"consumer_key":"ZGYa8NkRnVcl8QBA0JExYLdkj",
		"access_token":"1052836226456113152-JtWpiqnr2y6snwxn78pOfTPTtEeHlJ",
		"access_token_secret":"1bFTkfuGSTxSX7t6iQQmENHKyn3B926ovmFwdQoaO42ao"
	}
	tapi = twitter_api(tcfg)
	if tapi != None:
		message = "Crisis type: {}\nStreet: {}\nDescription: {}\nAdvice: {}\n".format(
			info["crisis_type"], info["street"], info["description"], info["notes"])
		tapi.update_status(message)
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