from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'name', 'email', 'team', 'created_at']

    def get__id(self, obj):
        return str(obj._id)


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at', 'members_count']

    def get__id(self, obj):
        return str(obj._id)


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user_email', 'activity_type', 'duration', 'calories_burned', 'date', 'notes']

    def get__id(self, obj):
        return str(obj._id)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'team_name', 'total_activities', 'total_calories', 'total_duration', 'rank', 'updated_at']

    def get__id(self, obj):
        return str(obj._id)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'activity_type', 'difficulty', 'duration', 'calories_estimate', 'instructions']

    def get__id(self, obj):
        return str(obj._id)
