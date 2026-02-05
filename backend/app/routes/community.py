"""
Community routes - persistent storage using database
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel, EmailStr
import json

from ..database import get_db
from ..models.user import Project, User, project_collaborators
from ..models.survey import ProjectRecommendation, LinkedInPostRequest
from ..services.ai_engine import generate_linkedin_post
from ..services.auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/community", tags=["Community"])


# Pydantic models for API
class PublishProjectRequest(BaseModel):
    title: str
    description: str
    difficulty_level: str
    tech_stack: List[str]
    tags: List[str]
    roadmap_json: Optional[str] = None
    looking_for_collaborators: bool = True
    max_team_size: int = 4


class CommunityProjectResponse(BaseModel):
    id: int
    uuid: str
    title: str
    description: Optional[str]
    difficulty_level: Optional[str]
    tech_stack: List[str]
    tags: List[str]
    looking_for_collaborators: bool
    max_team_size: int
    current_members: int
    owner_name: str
    owner_email: str
    created_at: str
    
    class Config:
        from_attributes = True


class CommunityProjectsListResponse(BaseModel):
    projects: List[CommunityProjectResponse]
    total: int
    page: int
    per_page: int


@router.post("/publish", response_model=CommunityProjectResponse)
async def publish_project(
    request: PublishProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Publish a project to the community board for collaboration.
    Requires authentication.
    """
    project = Project(
        title=request.title,
        description=request.description,
        difficulty_level=request.difficulty_level,
        tech_stack=request.tech_stack,
        tags=request.tags,
        roadmap_json=request.roadmap_json,
        looking_for_collaborators=request.looking_for_collaborators,
        max_team_size=request.max_team_size,
        is_published=True,
        owner_id=current_user.id
    )
    
    db.add(project)
    await db.commit()
    await db.refresh(project)
    
    return CommunityProjectResponse(
        id=project.id,
        uuid=project.uuid,
        title=project.title,
        description=project.description,
        difficulty_level=project.difficulty_level,
        tech_stack=project.tech_stack or [],
        tags=project.tags or [],
        looking_for_collaborators=project.looking_for_collaborators,
        max_team_size=project.max_team_size,
        current_members=1,
        owner_name=current_user.name or current_user.email,
        owner_email=current_user.email,
        created_at=project.created_at.isoformat() if project.created_at else ""
    )


@router.get("/projects", response_model=CommunityProjectsListResponse)
async def get_community_projects(
    difficulty: Optional[str] = Query(None, description="Filter by difficulty level"),
    tech_stack: Optional[str] = Query(None, description="Filter by technology"),
    looking_for_collaborators: Optional[bool] = Query(None, description="Filter by collaboration status"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=50, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all published community projects with optional filtering and pagination.
    """
    # Build query
    query = select(Project).where(Project.is_published == True).options(
        selectinload(Project.owner),
        selectinload(Project.collaborators)
    )
    
    # Apply filters
    if difficulty:
        query = query.where(Project.difficulty_level.ilike(f"%{difficulty}%"))
    
    if looking_for_collaborators is not None:
        query = query.where(Project.looking_for_collaborators == looking_for_collaborators)
    
    if search:
        query = query.where(
            or_(
                Project.title.ilike(f"%{search}%"),
                Project.description.ilike(f"%{search}%")
            )
        )
    
    # Order by newest first
    query = query.order_by(Project.created_at.desc())
    
    # Get total count
    count_result = await db.execute(
        select(Project.id).where(Project.is_published == True)
    )
    total = len(count_result.all())
    
    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    # Filter by tech_stack (JSON field - need to check after fetch)
    if tech_stack:
        projects = [
            p for p in projects 
            if p.tech_stack and any(
                tech_stack.lower() in t.lower() for t in p.tech_stack
            )
        ]
    
    # Build response
    project_responses = []
    for project in projects:
        project_responses.append(CommunityProjectResponse(
            id=project.id,
            uuid=project.uuid,
            title=project.title,
            description=project.description,
            difficulty_level=project.difficulty_level,
            tech_stack=project.tech_stack or [],
            tags=project.tags or [],
            looking_for_collaborators=project.looking_for_collaborators,
            max_team_size=project.max_team_size,
            current_members=len(project.collaborators) + 1,
            owner_name=project.owner.name or project.owner.email if project.owner else "Unknown",
            owner_email=project.owner.email if project.owner else "",
            created_at=project.created_at.isoformat() if project.created_at else ""
        ))
    
    return CommunityProjectsListResponse(
        projects=project_responses,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/projects/{project_uuid}", response_model=CommunityProjectResponse)
async def get_project(
    project_uuid: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific community project by UUID.
    """
    result = await db.execute(
        select(Project)
        .where(Project.uuid == project_uuid, Project.is_published == True)
        .options(selectinload(Project.owner), selectinload(Project.collaborators))
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return CommunityProjectResponse(
        id=project.id,
        uuid=project.uuid,
        title=project.title,
        description=project.description,
        difficulty_level=project.difficulty_level,
        tech_stack=project.tech_stack or [],
        tags=project.tags or [],
        looking_for_collaborators=project.looking_for_collaborators,
        max_team_size=project.max_team_size,
        current_members=len(project.collaborators) + 1,
        owner_name=project.owner.name or project.owner.email if project.owner else "Unknown",
        owner_email=project.owner.email if project.owner else "",
        created_at=project.created_at.isoformat() if project.created_at else ""
    )


@router.post("/projects/{project_uuid}/join")
async def join_project(
    project_uuid: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Request to join a community project.
    Requires authentication.
    """
    result = await db.execute(
        select(Project)
        .where(Project.uuid == project_uuid)
        .options(selectinload(Project.collaborators))
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.looking_for_collaborators:
        raise HTTPException(status_code=400, detail="Project is not looking for collaborators")
    
    current_members = len(project.collaborators) + 1
    if current_members >= project.max_team_size:
        raise HTTPException(status_code=400, detail="Project team is full")
    
    # Check if already a member
    if current_user.id == project.owner_id:
        raise HTTPException(status_code=400, detail="You are the owner of this project")
    
    if any(c.id == current_user.id for c in project.collaborators):
        raise HTTPException(status_code=400, detail="You are already a member of this project")
    
    # Add user as collaborator
    project.collaborators.append(current_user)
    await db.commit()
    
    return {
        "message": f"Successfully joined project: {project.title}",
        "current_members": current_members + 1
    }


@router.post("/projects/{project_uuid}/leave")
async def leave_project(
    project_uuid: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Leave a community project.
    """
    result = await db.execute(
        select(Project)
        .where(Project.uuid == project_uuid)
        .options(selectinload(Project.collaborators))
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.id == project.owner_id:
        raise HTTPException(status_code=400, detail="Owner cannot leave the project. Delete it instead.")
    
    if not any(c.id == current_user.id for c in project.collaborators):
        raise HTTPException(status_code=400, detail="You are not a member of this project")
    
    # Remove user from collaborators
    project.collaborators = [c for c in project.collaborators if c.id != current_user.id]
    await db.commit()
    
    return {"message": f"Successfully left project: {project.title}"}


@router.post("/linkedin-post")
async def generate_linkedin_post_endpoint(request: LinkedInPostRequest):
    """
    Generate a LinkedIn post for sharing a project start.
    """
    post_content = generate_linkedin_post(
        project_title=request.project_title,
        tech_stack=request.tech_stack,
        student_name=request.student_name,
        difficulty_level=request.difficulty_level
    )
    return {"post_content": post_content}
