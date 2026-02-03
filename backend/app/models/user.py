from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, ARRAY, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import uuid

# Association table for project collaborators
project_collaborators = Table(
    'project_collaborators',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True),
    Column('joined_at', DateTime(timezone=True), server_default=func.now())
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # Basic info
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # OAuth info
    provider = Column(String, nullable=False)  # "github" or "google"
    provider_id = Column(String, nullable=False)
    
    # Profile info (from survey)
    university = Column(String, nullable=True)
    programming_languages = Column(ARRAY(String), default=[])
    skill_level = Column(String, nullable=True)
    ai_ml_experience = Column(String, nullable=True)
    interest_areas = Column(ARRAY(String), default=[])
    career_goal = Column(String, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_profile_complete = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owned_projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    collaborated_projects = relationship(
        "Project",
        secondary=project_collaborators,
        back_populates="collaborators"
    )
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # Project info
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    difficulty_level = Column(String, nullable=True)
    tech_stack = Column(ARRAY(String), default=[])
    tags = Column(ARRAY(String), default=[])
    estimated_duration = Column(String, nullable=True)
    
    # Roadmap stored as JSON string
    roadmap_json = Column(Text, nullable=True)
    
    # Community settings
    is_published = Column(Boolean, default=False)
    looking_for_collaborators = Column(Boolean, default=True)
    max_team_size = Column(Integer, default=4)
    
    # Owner
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="owned_projects")
    
    # Collaborators
    collaborators = relationship(
        "User",
        secondary=project_collaborators,
        back_populates="collaborated_projects"
    )
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    @property
    def current_members(self):
        return len(self.collaborators) + 1  # +1 for owner


class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    
    # User who received this recommendation
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="recommendations")
    
    # Survey data snapshot
    survey_data_json = Column(Text, nullable=True)
    
    # AI response
    recommendations_json = Column(Text, nullable=False)
    personalization_summary = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
