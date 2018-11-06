# Lucky_Monster
## SMS
This project uses dj-nexmo for sending sms to relevant agnecies. Therefore, dj-demo needs to be installed.
### Installation Guide
Currently, dj-nexmo only supports Python 3.3+, and Django 2.0+. The steps to install dj-nexmo are listed below:
```
	1.	pip install dj-nexmo
	
	2.	Add "djnexmo" to INSTALLED_APPS in your settings.
	
	3.	Run python manage.py migrate djnexmo to create the necessary models.
```

## Facebook
This project uses facebook sdk to post inforamtion on  Facebook.
### Installation Guide
```
	1.	pip install facebook-sdk
```

## Twitter
This project uses facebook sdk to post inforamtion on  Twitter.
### Installation Guide
twitter libary is used in this project. This library provides a pure Python interface for the Twitter API.
```

	1.	pip install tweepy
```

## Docker
Docker is a computer program that performs operating-system-level virtualization, also known as "containerization".
Available on branch **callcenter**.
Need to install docker first, then start Docker on your computer.
- [Download Docker](https://www.docker.com/get-started)

```bash
$ git checkout callcenter
$ cd CrysisAlert
$ docker-compose up
```
The server will be started
