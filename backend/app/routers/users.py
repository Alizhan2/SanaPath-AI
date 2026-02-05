from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

router = APIRouter(prefix="/api/users", tags=["users"])

# In-memory storage for demo (in production use database)
users_data = {}
achievements_data = {}

class UserStats(BaseModel):
    total_projects: int = 0
    completed_projects: int = 0
    completed_tasks: int = 0
    completed_weeks: int = 0
    streak: int = 0
    xp: int = 0
    level: int = 1
    joined_community: bool = False
    resources_used: int = 0

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    stats: UserStats = UserStats()
    created_at: datetime = datetime.now()

class Achievement(BaseModel):
    id: str
    title: str
    description: str
    points: int
    unlocked: bool = False
    unlocked_at: Optional[datetime] = None

class UserSettings(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    weekly_digest: bool = True
    project_updates: bool = True
    community_activity: bool = False
    marketing_emails: bool = False
    profile_public: bool = True
    show_activity: bool = True
    show_projects: bool = True
    show_achievements: bool = True
    theme: str = "dark"
    reduced_motion: bool = False
    sound_effects: bool = True
    language: str = "en"

# Predefined achievements
ACHIEVEMENTS = [
    {"id": "first_project", "title": "First Launch", "description": "Start your first AI project", "points": 100},
    {"id": "week_complete", "title": "Week Warrior", "description": "Complete your first week", "points": 200},
    {"id": "three_projects", "title": "Project Pro", "description": "Start 3 different projects", "points": 300},
    {"id": "streak_7", "title": "On Fire!", "description": "Maintain a 7-day streak", "points": 500},
    {"id": "ten_tasks", "title": "Task Master", "description": "Complete 10 tasks", "points": 250},
    {"id": "community_join", "title": "Team Player", "description": "Join a community project", "points": 150},
    {"id": "first_complete", "title": "Finisher", "description": "Complete your first project", "points": 1000},
    {"id": "code_master", "title": "Code Master", "description": "Complete 50 tasks total", "points": 750},
    {"id": "scholar", "title": "AI Scholar", "description": "Use 20+ learning resources", "points": 400},
]

@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile and stats"""
    if user_id not in users_data:
        # Create default profile
        users_data[user_id] = {
            "id": user_id,
            "name": "AI Student",
            "email": f"{user_id}@sanapath.ai",
            "stats": {
                "total_projects": 0,
                "completed_projects": 0,
                "completed_tasks": 0,
                "completed_weeks": 0,
                "streak": 0,
                "xp": 0,
                "level": 1,
                "joined_community": False,
                "resources_used": 0
            }
        }
    return users_data[user_id]

@router.put("/profile/{user_id}")
async def update_user_profile(user_id: str, profile: dict):
    """Update user profile"""
    if user_id not in users_data:
        users_data[user_id] = {"id": user_id}
    users_data[user_id].update(profile)
    return users_data[user_id]

@router.get("/stats/{user_id}")
async def get_user_stats(user_id: str):
    """Get user statistics"""
    if user_id not in users_data:
        return UserStats().dict()
    return users_data[user_id].get("stats", UserStats().dict())

@router.put("/stats/{user_id}")
async def update_user_stats(user_id: str, stats: UserStats):
    """Update user statistics"""
    if user_id not in users_data:
        users_data[user_id] = {"id": user_id}
    
    # Calculate XP and level
    stats_dict = stats.dict()
    
    # Award XP for various activities
    xp = stats.completed_tasks * 10 + stats.completed_projects * 100 + stats.completed_weeks * 50
    stats_dict["xp"] = xp
    stats_dict["level"] = max(1, xp // 500 + 1)
    
    users_data[user_id]["stats"] = stats_dict
    
    # Check for unlocked achievements
    check_achievements(user_id, stats_dict)
    
    return stats_dict

@router.post("/stats/{user_id}/add-xp")
async def add_xp(user_id: str, xp_amount: int):
    """Add XP to user"""
    if user_id not in users_data:
        users_data[user_id] = {"id": user_id, "stats": UserStats().dict()}
    
    current_xp = users_data[user_id].get("stats", {}).get("xp", 0)
    new_xp = current_xp + xp_amount
    new_level = max(1, new_xp // 500 + 1)
    
    users_data[user_id]["stats"]["xp"] = new_xp
    users_data[user_id]["stats"]["level"] = new_level
    
    level_up = new_level > users_data[user_id]["stats"].get("level", 1)
    
    return {
        "xp": new_xp,
        "level": new_level,
        "level_up": level_up
    }

@router.get("/achievements/{user_id}")
async def get_user_achievements(user_id: str):
    """Get user achievements"""
    if user_id not in achievements_data:
        achievements_data[user_id] = {a["id"]: False for a in ACHIEVEMENTS}
    
    result = []
    for achievement in ACHIEVEMENTS:
        unlocked = achievements_data[user_id].get(achievement["id"], False)
        result.append({
            **achievement,
            "unlocked": unlocked
        })
    
    return result

@router.post("/achievements/{user_id}/unlock/{achievement_id}")
async def unlock_achievement(user_id: str, achievement_id: str):
    """Unlock an achievement for user"""
    if user_id not in achievements_data:
        achievements_data[user_id] = {}
    
    achievement = next((a for a in ACHIEVEMENTS if a["id"] == achievement_id), None)
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    if achievements_data[user_id].get(achievement_id):
        return {"message": "Already unlocked", "achievement": achievement}
    
    achievements_data[user_id][achievement_id] = True
    
    # Award XP for achievement
    if user_id in users_data:
        current_xp = users_data[user_id].get("stats", {}).get("xp", 0)
        users_data[user_id]["stats"]["xp"] = current_xp + achievement["points"]
        users_data[user_id]["stats"]["level"] = (users_data[user_id]["stats"]["xp"] // 500) + 1
    
    return {
        "message": "Achievement unlocked!",
        "achievement": achievement,
        "xp_earned": achievement["points"]
    }

def check_achievements(user_id: str, stats: dict):
    """Check and unlock achievements based on stats"""
    if user_id not in achievements_data:
        achievements_data[user_id] = {}
    
    conditions = {
        "first_project": stats.get("total_projects", 0) >= 1,
        "week_complete": stats.get("completed_weeks", 0) >= 1,
        "three_projects": stats.get("total_projects", 0) >= 3,
        "streak_7": stats.get("streak", 0) >= 7,
        "ten_tasks": stats.get("completed_tasks", 0) >= 10,
        "community_join": stats.get("joined_community", False),
        "first_complete": stats.get("completed_projects", 0) >= 1,
        "code_master": stats.get("completed_tasks", 0) >= 50,
        "scholar": stats.get("resources_used", 0) >= 20,
    }
    
    for achievement_id, condition in conditions.items():
        if condition and not achievements_data[user_id].get(achievement_id):
            achievements_data[user_id][achievement_id] = True

@router.get("/settings/{user_id}")
async def get_user_settings(user_id: str):
    """Get user settings"""
    return UserSettings().dict()

@router.put("/settings/{user_id}")
async def update_user_settings(user_id: str, settings: UserSettings):
    """Update user settings"""
    return settings.dict()

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top users by XP"""
    leaderboard = []
    for user_id, data in users_data.items():
        leaderboard.append({
            "id": user_id,
            "name": data.get("name", "Anonymous"),
            "avatar_url": data.get("avatar_url"),
            "xp": data.get("stats", {}).get("xp", 0),
            "level": data.get("stats", {}).get("level", 1)
        })
    
    leaderboard.sort(key=lambda x: x["xp"], reverse=True)
    return leaderboard[:limit]

@router.post("/activity/{user_id}")
async def log_activity(user_id: str, activity_type: str):
    """Log user activity and update streak"""
    if user_id not in users_data:
        users_data[user_id] = {"id": user_id, "stats": UserStats().dict()}
    
    stats = users_data[user_id].get("stats", {})
    
    # Update based on activity type
    if activity_type == "task_complete":
        stats["completed_tasks"] = stats.get("completed_tasks", 0) + 1
    elif activity_type == "project_start":
        stats["total_projects"] = stats.get("total_projects", 0) + 1
    elif activity_type == "project_complete":
        stats["completed_projects"] = stats.get("completed_projects", 0) + 1
    elif activity_type == "week_complete":
        stats["completed_weeks"] = stats.get("completed_weeks", 0) + 1
    elif activity_type == "resource_used":
        stats["resources_used"] = stats.get("resources_used", 0) + 1
    elif activity_type == "daily_login":
        stats["streak"] = stats.get("streak", 0) + 1
    elif activity_type == "join_community":
        stats["joined_community"] = True
    
    users_data[user_id]["stats"] = stats
    check_achievements(user_id, stats)
    
    return {"message": "Activity logged", "stats": stats}
