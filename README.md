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

## Email
This project uses Celery and Redis to send email to the Pime Minister's office every half an hour automatically. Therefore, Celery and Redis need to be installed.
### Installation Guide
#### Install Celery
```
$ pip install celery
```
Note: Celery 3.1.25 is the last version that works on windows.
```
$ pip install celery==3.1.25
```
#### Install Redis
```
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make
```
For Windows system: See [install-win10](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)
#### Start Redis
```
$ redis-server
```
### How to run the project
1. Go to the root directory of the Django project (where file manage.py is placed).
2. Open the Celery worker.
    ```
    $ celery -A CrysisAlert worker -l info
    ```
3. Open the Celery beat under the same directory in another cmd window.
    ```
    $ celery -A CrysisAlert beat -l info
    ```
