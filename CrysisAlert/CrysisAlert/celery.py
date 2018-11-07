from __future__ import absolute_import, unicode_literals
from celery import Celery
from django.conf import settings
import os

#project_name = os.path.split(os.path.abspath('.'))[-1]
#project_settings = '%s.settings' % project_name

#os.environ.setdefault('DJANGO_SETTINGS_MODULE', project_settings)

#app = Celery(project_name)

#app.config_from_object('django.conf:settings')

#app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CrysisAlert.settings")
app = Celery('CrysisAlert')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))