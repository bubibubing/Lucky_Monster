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
```
$ virtualenv --no-site-packages --distribute .env && .env/Scripts/activate && pip install -r requirements.txt
```
## Run Server
```
python manage.py runserver 0.0.0.0:8000
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
