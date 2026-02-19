"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/

API Endpoints are accessible via:
- Local: http://localhost:8000/api/
- Codespace: https://$CODESPACE_NAME-8000.app.github.dev/api/
"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    api_root,
    UserViewSet,
    TeamViewSet,
    ActivityViewSet,
    LeaderboardViewSet,
    WorkoutViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'workouts', WorkoutViewSet, basename='workout')

# Codespace URL configuration for API endpoints
# Format: https://${CODESPACE_NAME}-8000.app.github.dev/api/[endpoint]/
codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    # API base URL for GitHub Codespaces
    API_BASE_URL = f"https://{codespace_name}-8000.app.github.dev"
else:
    # API base URL for local development
    API_BASE_URL = "http://localhost:8000"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('', api_root, name='api-root-index'),
]
