from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
import uuid
from ..models.survey import CommunityProject, PublishProjectRequest, LinkedInPostRequest
from ..services.ai_engine import generate_linkedin_post

router = APIRouter(prefix="/api/community", tags=["Community"])

# In-memory storage (replace with database in production)
community_projects: List[CommunityProject] = []

@router.post("/publish", response_model=CommunityProject)
async def publish_project(request: PublishProjectRequest):
    """
    Publish a project to the community board for collaboration.
    """
    project = CommunityProject(
        id=str(uuid.uuid4()),
        title=request.project.title,
        description=request.project.description,
        author_name=request.author_name,
        author_email=request.author_email,
        difficulty_level=request.project.difficulty_level,
        tech_stack=request.project.tech_stack,
        tags=request.project.tags,
        looking_for_collaborators=request.looking_for_collaborators,
        max_team_size=request.max_team_size,
        current_members=1,
        created_at=datetime.now().isoformat()
    )
    community_projects.append(project)
    return project

@router.get("/projects", response_model=List[CommunityProject])
async def get_community_projects(
    difficulty: Optional[str] = None,
    tech_stack: Optional[str] = None,
    looking_for_collaborators: Optional[bool] = None
):
    """
    Get all community projects with optional filtering.
    """
    filtered = community_projects.copy()
    
    if difficulty:
        filtered = [p for p in filtered if p.difficulty_level.lower() == difficulty.lower()]
    
    if tech_stack:
        filtered = [p for p in filtered if tech_stack.lower() in [t.lower() for t in p.tech_stack]]
    
    if looking_for_collaborators is not None:
        filtered = [p for p in filtered if p.looking_for_collaborators == looking_for_collaborators]
    
    return sorted(filtered, key=lambda x: x.created_at, reverse=True)

@router.get("/projects/{project_id}", response_model=CommunityProject)
async def get_project(project_id: str):
    """
    Get a specific community project by ID.
    """
    for project in community_projects:
        if project.id == project_id:
            return project
    raise HTTPException(status_code=404, detail="Project not found")

@router.post("/projects/{project_id}/join")
async def join_project(project_id: str, member_name: str, member_email: str):
    """
    Request to join a community project.
    """
    for project in community_projects:
        if project.id == project_id:
            if not project.looking_for_collaborators:
                raise HTTPException(status_code=400, detail="Project is not looking for collaborators")
            if project.current_members >= project.max_team_size:
                raise HTTPException(status_code=400, detail="Project team is full")
            project.current_members += 1
            return {"message": f"Successfully joined project: {project.title}", "current_members": project.current_members}
    raise HTTPException(status_code=404, detail="Project not found")

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
