from django.test import TestCase
from app.models import Crisis, CrisisReport, Assistance, InfoDispatch, Agent, Facilities

from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status


# Create your tests here.

class ObjectCreator:

    @classmethod
    def create_crisis(self, crisis_type):
        Crisis.objects.create(crisis_type=crisis_type)

    @classmethod
    def create_report(self, crisis_type):
        CrisisReport.objects.create(
            witness_first_name="John",
            witness_last_name="Joe",
            mobile_number="6762323",

            street_name="King's street",
            crisis_type=self.create_crisis(crisis_type),
            description="",
            injured_people_num=13,
            status='U',
        )

    @classmethod    
    def create_assistance(self):
        Assistance.objects.create(
            crisis=self.create_crisis(),
            type_of_assistance='R',
            agencies=self.create_agency(),
        )
    
    @classmethod
    def create_agent(self):
        Agent.objects.create(name="Police", contact_num="9999")


class CrisisReportTest(TestCase):
    def setUp(self):
        ObjectCreator.create_crisis(crisis_type="Storm")

    def test_reports(self):
        # report = CrisisReport.objects.get(witness_first_name="John")
        crisis = Crisis.objects.get(crisis_type="")
        self.assertEquals(str(report.crisis_type), "Storm")
