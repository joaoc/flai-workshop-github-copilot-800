from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.exceptions import NotFound
from bson import ObjectId
from bson.errors import InvalidId
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer
)


def get_object_by_id(queryset, id_str):
    """Look up a Djongo/MongoDB document by its ObjectId string."""
    try:
        obj = queryset.get(_id=ObjectId(id_str))
    except (InvalidId, queryset.model.DoesNotExist):
        raise NotFound(detail=f"Object with id '{id_str}' not found.")
    return obj


@api_view(['GET'])
def api_root(request, format=None):
    """
    OctoFit Tracker API root - lists all available endpoints.
    """
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'teams': reverse('team-list', request=request, format=format),
        'activities': reverse('activity-list', request=request, format=format),
        'leaderboard': reverse('leaderboard-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
    })


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing users (superheroes).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = '_id'

    def get_object(self):
        obj = get_object_by_id(self.get_queryset(), self.kwargs['_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing teams (Team Marvel, Team DC).
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = '_id'

    def get_object(self):
        obj = get_object_by_id(self.get_queryset(), self.kwargs['_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for logging and managing fitness activities.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    lookup_field = '_id'

    def get_object(self):
        obj = get_object_by_id(self.get_queryset(), self.kwargs['_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for competitive leaderboard rankings.
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    lookup_field = '_id'

    def get_object(self):
        obj = get_object_by_id(self.get_queryset(), self.kwargs['_id'])
        self.check_object_permissions(self.request, obj)
        return obj


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for personalized workout suggestions.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    lookup_field = '_id'

    def get_object(self):
        obj = get_object_by_id(self.get_queryset(), self.kwargs['_id'])
        self.check_object_permissions(self.request, obj)
        return obj
