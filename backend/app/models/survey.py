from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class SurveyResponse(BaseModel):
    # Personal Information
    name: str = Field(..., description="Student's name")
    email: str = Field(..., description="Student's email")
    university: Optional[str] = Field(None, description="University/Institution name")
    
    # Skills Assessment
    programming_languages: List[str] = Field(..., description="Known programming languages")
    skill_level: SkillLevel = Field(..., description="Overall skill level")
    ai_ml_experience: str = Field(..., description="Experience with AI/ML")
    
    # Interests
    interest_areas: List[str] = Field(..., description="Areas of interest in AI")
    preferred_project_type: str = Field(..., description="Type of project preferred")
    industry_interest: List[str] = Field(..., description="Industries of interest")
    
    # Goals & Availability
    career_goal: str = Field(..., description="Primary career goal")
    learning_style: str = Field(..., description="Preferred learning style")
    time_commitment: str = Field(..., description="Weekly time commitment")
    project_duration: str = Field(..., description="Preferred project duration")
    
    # Collaboration
    team_preference: str = Field(..., description="Solo or team preference")
    collaboration_tools: List[str] = Field(..., description="Familiar collaboration tools")

class TaskResource(BaseModel):
    title: str
    url: str
    type: str  # "docs", "video", "tutorial", "article"

class TaskDetail(BaseModel):
    name: str
    description: str
    steps: List[str]
    resources: List[TaskResource]
    estimated_time: str

class ProjectRoadmapWeek(BaseModel):
    week: int
    title: str
    tasks: List[TaskDetail]
    deliverables: List[str]

class ProjectRecommendation(BaseModel):
    title: str
    description: str
    difficulty_level: str
    tech_stack: List[str]
    estimated_duration: str
    learning_outcomes: List[str]
    roadmap: List[ProjectRoadmapWeek]
    tags: List[str]

class RecommendationResponse(BaseModel):
    student_name: str
    recommendations: List[ProjectRecommendation]
    personalization_summary: str

class CommunityProject(BaseModel):
    id: str
    title: str
    description: str
    author_name: str
    author_email: str
    difficulty_level: str
    tech_stack: List[str]
    tags: List[str]
    looking_for_collaborators: bool = True
    max_team_size: int = 4
    current_members: int = 1
    created_at: str

class PublishProjectRequest(BaseModel):
    project: ProjectRecommendation
    author_name: str
    author_email: str
    looking_for_collaborators: bool = True
    max_team_size: int = 4

class LinkedInPostRequest(BaseModel):
    project_title: str
    tech_stack: List[str]
    student_name: str
    difficulty_level: str
