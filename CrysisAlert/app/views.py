from django.shortcuts import render
from django.contrib import messages
import nexmo

# Create your views here.
def sms(request):
	context=locals()
	template = 'sms.html' 
	api_key = '584b637b'
	api_secret = '6SkVXAWV6U0LtPkO'
	if request.method =='POST':
		client = nexmo.Client(key=api_key, secret=api_secret)
		agency = 'sp'
		if(agency == 'scdf'):
			response = client.send_message({'from': 'Crisis Alert', 'to': '+6598374816', 'text': 'Dear SCDF Officer: SOS!'})
		elif(agency == 'sp'):
			response = client.send_message({'from': 'Crisis Alert', 'to': '+6593259717', 'text': 'Dear Singapore Power Officer: SOS!'})
		
		response = response['messages'][0]
		messages.success(request, 'SMS has sent to relevant agencies.')

		if response['status'] == '0':
			print(response['message-id'])
		else:
			print(response['error-text'])
			messages.error(request, 'SMS does not sent to relevant agencies. Please resend the SMS.')

		return render(request,template,context)
	else:
		return render(request,template,context)
