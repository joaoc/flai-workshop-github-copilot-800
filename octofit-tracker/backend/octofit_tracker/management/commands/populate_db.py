from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Avengers assemble! The mightiest heroes united for fitness.',
            members_count=0
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League fighting for health and wellness.',
            members_count=0
        )
        
        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@marvel.com'},
            {'name': 'Captain America', 'email': 'steve.rogers@marvel.com'},
            {'name': 'Thor', 'email': 'thor.odinson@marvel.com'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@marvel.com'},
            {'name': 'Hulk', 'email': 'bruce.banner@marvel.com'},
            {'name': 'Spider-Man', 'email': 'peter.parker@marvel.com'},
        ]
        
        dc_heroes = [
            {'name': 'Batman', 'email': 'bruce.wayne@dc.com'},
            {'name': 'Superman', 'email': 'clark.kent@dc.com'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@dc.com'},
            {'name': 'Flash', 'email': 'barry.allen@dc.com'},
            {'name': 'Aquaman', 'email': 'arthur.curry@dc.com'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@dc.com'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team='Team Marvel'
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team='Team DC'
            )
            dc_users.append(user)
        
        # Update team member counts
        team_marvel.members_count = len(marvel_users)
        team_marvel.save()
        team_dc.members_count = len(dc_users)
        team_dc.save()
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'Boxing', 'CrossFit']
        all_users = marvel_users + dc_users
        
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories = int(duration * random.uniform(5, 12))
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_email=user.email,
                    activity_type=activity_type,
                    duration=duration,
                    calories_burned=calories,
                    date=datetime.now() - timedelta(days=days_ago),
                    notes=f'{activity_type} session by {user.name}'
                )
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        
        # Calculate Team Marvel stats
        marvel_activities = Activity.objects.filter(user_email__in=[u.email for u in marvel_users])
        marvel_total_activities = marvel_activities.count()
        marvel_total_calories = sum([a.calories_burned for a in marvel_activities])
        marvel_total_duration = sum([a.duration for a in marvel_activities])
        
        # Calculate Team DC stats
        dc_activities = Activity.objects.filter(user_email__in=[u.email for u in dc_users])
        dc_total_activities = dc_activities.count()
        dc_total_calories = sum([a.calories_burned for a in dc_activities])
        dc_total_duration = sum([a.duration for a in dc_activities])
        
        # Determine ranks
        if marvel_total_calories > dc_total_calories:
            marvel_rank, dc_rank = 1, 2
        else:
            marvel_rank, dc_rank = 2, 1
        
        Leaderboard.objects.create(
            team_name='Team Marvel',
            total_activities=marvel_total_activities,
            total_calories=marvel_total_calories,
            total_duration=marvel_total_duration,
            rank=marvel_rank
        )
        
        Leaderboard.objects.create(
            team_name='Team DC',
            total_activities=dc_total_activities,
            total_calories=dc_total_calories,
            total_duration=dc_total_duration,
            rank=dc_rank
        )
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Superhero Strength Training',
                'description': 'Build strength like a superhero with compound movements',
                'activity_type': 'Weight Training',
                'difficulty': 'intermediate',
                'duration': 45,
                'calories_estimate': 350,
                'instructions': '1. Warm up 5 mins\n2. Bench press 3x10\n3. Squats 3x10\n4. Deadlifts 3x10\n5. Cool down'
            },
            {
                'name': 'Speedster Cardio Blast',
                'description': 'High-intensity cardio workout to boost speed and endurance',
                'activity_type': 'Running',
                'difficulty': 'advanced',
                'duration': 30,
                'calories_estimate': 400,
                'instructions': '1. Warm up jog 5 mins\n2. Sprint intervals 20 mins\n3. Cool down jog 5 mins'
            },
            {
                'name': 'Warrior Yoga Flow',
                'description': 'Flexibility and balance training for warriors',
                'activity_type': 'Yoga',
                'difficulty': 'beginner',
                'duration': 30,
                'calories_estimate': 150,
                'instructions': '1. Sun salutations\n2. Warrior poses\n3. Balance poses\n4. Relaxation'
            },
            {
                'name': 'Hero HIIT Circuit',
                'description': 'High-intensity interval training for maximum results',
                'activity_type': 'CrossFit',
                'difficulty': 'advanced',
                'duration': 40,
                'calories_estimate': 450,
                'instructions': '1. Burpees 1 min\n2. Mountain climbers 1 min\n3. Jump squats 1 min\n4. Rest 30s\n5. Repeat 8 rounds'
            },
            {
                'name': 'Aquatic Power Swim',
                'description': 'Build endurance with swimming laps',
                'activity_type': 'Swimming',
                'difficulty': 'intermediate',
                'duration': 45,
                'calories_estimate': 380,
                'instructions': '1. Warm up 5 mins easy swim\n2. Freestyle laps 20 mins\n3. Backstroke 10 mins\n4. Cool down 10 mins'
            },
            {
                'name': 'Combat Boxing Session',
                'description': 'Boxing workout for strength and agility',
                'activity_type': 'Boxing',
                'difficulty': 'intermediate',
                'duration': 50,
                'calories_estimate': 420,
                'instructions': '1. Jump rope 5 mins\n2. Shadow boxing 10 mins\n3. Heavy bag work 20 mins\n4. Speed bag 10 mins\n5. Cool down'
            },
        ]
        
        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)
        
        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams created: {Team.objects.count()}')
        self.stdout.write(f'Users created: {User.objects.count()}')
        self.stdout.write(f'Activities created: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts created: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('\nTeam Marvel: {} total calories'.format(marvel_total_calories)))
        self.stdout.write(self.style.SUCCESS('Team DC: {} total calories'.format(dc_total_calories)))
