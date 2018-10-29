from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
# Create your tests here.
class UserAccountTest(APITestCase):
    def setUp(self):
        # Create a original user account
        self.test_user = User.objects.create_user(
            "testuser", 
            "test@example.com", 
            "testpassword"
        )

        # URL for creating an account
        self.create_url = reverse('create_account')

    def test_create_user(self):
        data = {
            'username': 'Kate',
            'email': 'kate@example.com',
            'password': 'thisisapassword',
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])
        self.assertFalse('password' in response.data)

    def test_create_with_short_password(self):
        data = {
            'username': 'Kate',
            'email': 'kate@example.com',
            'password': '1',
        }

        response = self.client.post(self.create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['password']), 1)


    def test_create_with_no_password(self):
        data = {
            'username': 'Kate',
            'email': 'kate@example.com',
            'password': '',
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['password']), 1)


    def test_create_user_with_too_long_username(self):
        data = {
            'username': 'foo'*30,
            'email': 'foobarbaz@example.com',
            'password': 'foobar'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)

    def test_create_user_with_no_username(self):
        data = {
                'username': '',
                'email': 'foobarbaz@example.com',
                'password': 'foobar'
                }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)

    def test_create_user_with_preexisting_username(self):
        data = {
                'username': 'testuser',
                'email': 'user@example.com',
                'password': 'testuser'
                }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['username']), 1)


    def test_create_user_with_preexisting_email(self):
        data = {
            'username': 'testuser2',
            'email': 'test@example.com',
            'password': 'testuser'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)

    def test_create_user_with_invalid_email(self):
        data = {
            'username': 'foobarbaz',
            'email':  'testing',
            'passsword': 'foobarbaz'
        }


        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)

    def test_create_user_with_no_email(self):
        data = {
                'username' : 'foobar',
                'email': '',
                'password': 'foobarbaz'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(len(response.data['email']), 1)


class UserLoginTest(APITestCase):
    def setUp(self):
        # Create a user account
        self.test_user = User.objects.create_user(
            "testuser", 
            "test@example.com", 
            "testpassword"
        )

        # URL for creating an account
        self.login_url = reverse('login')

    def test_successful_login(self):
        data = {
            "username": 'testuser',
            "password": 'testpassword',
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["Login"])

    def test_login_with_wrong_password(self):
        data = {
            "username": 'testuser',
            "password": 'PASSWORD',
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(response.data["Login"])


    def test_login_with_nonexisted_account(self):
        data = {
            "username": 'USERACCOUNT',
            "password": 'PASSWORD',
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(response.data["Login"])


class UserPasswordChangeTest(APITestCase):
    def setUp(self):
        # Create a user account
        self.test_user = User.objects.create_user(
            "testuser", 
            "test@example.com", 
            "testpassword"
        )

        # URL for creating an account
        self.password_change_url = reverse('change_passoword')

    def test_successful_change_password(self):
        data = {
            "username": 'USERACCOUNT',
            "password": 'PASSWORD',
        }

        response = self.client.post(self.password_change_url, data, format="json")













