# Lucky_Monster
## Django Rest framework
- [QuickStart](http://www.django-rest-framework.org/#quickstart)
- [Django Tutorials](https://docs.djangoproject.com/en/2.1/intro/tutorial01/)
## Virtual Enviroment
Virtualenv creates an environment that has its own installation directories, that doesn’t share libraries with other virtualenv environments.

For the packages you want to install, please add to the requirements.txt. ```$ pip install -r requirements.txt``` will install all the packages specified in the requirements.txt.
### Start the virtual envirment
#### Unix-like System
```
$ virtualenv --no-site-packages --distribute .env && source .env/bin/activate && pip install -r requirements.txt
```
#### Windows
To be updated😂

## Run Server
```
python manage.py runserver 0.0.0.0:8000
```
