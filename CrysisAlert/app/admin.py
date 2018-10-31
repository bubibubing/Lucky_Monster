from django.contrib import admin
from .models import Crisis, CrisisReport, Assistance, InfoDispatch, Agency, Facilities

# Register your models here.
admin.site.register(Crisis)
admin.site.register(CrisisReport)
admin.site.register(Assistance)
admin.site.register(InfoDispatch)
admin.site.register(Agency)
admin.site.register(Facilities)