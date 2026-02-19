from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team', 'created_at')
    list_filter = ('team',)
    search_fields = ('name', 'email', 'team')
    ordering = ('name',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'members_count', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'activity_type', 'duration', 'calories_burned', 'date')
    list_filter = ('activity_type',)
    search_fields = ('user_email', 'activity_type')
    ordering = ('-date',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'rank', 'total_activities', 'total_calories', 'total_duration', 'updated_at')
    ordering = ('rank',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'activity_type', 'difficulty', 'duration', 'calories_estimate')
    list_filter = ('activity_type', 'difficulty')
    search_fields = ('name', 'activity_type')
    ordering = ('name',)
