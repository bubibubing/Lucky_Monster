from django.contrib import admin
from .models import Crisis, CrisisReport, Assistance, Agency, Facility

# Register your models here.
admin.site.register(Crisis)
admin.site.register(CrisisReport)
admin.site.register(Assistance)
admin.site.register(Agency)
admin.site.register(Facility)