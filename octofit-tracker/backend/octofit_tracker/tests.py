from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Iron Man',
            email='tony.stark@marvel.com',
            team='Team Marvel'
        )

    def test_list_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        url = reverse('user-list')
        data = {'name': 'Thor', 'email': 'thor.odinson@marvel.com', 'team': 'Team Marvel'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def tearDown(self):
        User.objects.all().delete()


class TeamTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            description='Avengers assemble!',
            members_count=6
        )

    def test_list_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        url = reverse('team-list')
        data = {'name': 'Team DC', 'description': 'Justice League!', 'members_count': 6}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def tearDown(self):
        Team.objects.all().delete()


class ActivityTests(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_email='tony.stark@marvel.com',
            activity_type='Running',
            duration=30,
            calories_burned=300,
            date=datetime.now(),
            notes='Morning run'
        )

    def test_list_activities(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_activity(self):
        url = reverse('activity-list')
        data = {
            'user_email': 'bruce.wayne@dc.com',
            'activity_type': 'Boxing',
            'duration': 60,
            'calories_burned': 500,
            'date': datetime.now().isoformat(),
            'notes': 'Evening boxing'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def tearDown(self):
        Activity.objects.all().delete()


class LeaderboardTests(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            team_name='Team Marvel',
            total_activities=52,
            total_calories=31034,
            total_duration=3475,
            rank=1
        )

    def test_list_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        Leaderboard.objects.all().delete()


class WorkoutTests(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Superhero Strength Training',
            description='Build strength like a superhero',
            activity_type='Weight Training',
            difficulty='intermediate',
            duration=45,
            calories_estimate=350,
            instructions='1. Warm up\n2. Lift\n3. Cool down'
        )

    def test_list_workouts(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        url = reverse('workout-list')
        data = {
            'name': 'Speedster Cardio',
            'description': 'Fast cardio session',
            'activity_type': 'Running',
            'difficulty': 'advanced',
            'duration': 30,
            'calories_estimate': 400,
            'instructions': '1. Sprint\n2. Rest\n3. Repeat'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def tearDown(self):
        Workout.objects.all().delete()


class APIRootTests(APITestCase):
    def test_api_root(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
