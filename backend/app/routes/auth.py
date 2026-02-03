from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
import httpx

from ..config import settings
from ..database import get_db
from ..models.user import User
from ..services.auth import create_access_token, get_current_user
from ..services.oauth import oauth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/login/github")
async def login_github(request: Request):
    """Redirect to GitHub OAuth"""
    redirect_uri = f"{settings.BACKEND_URL}/api/auth/callback/github"
    return await oauth.github.authorize_redirect(request, redirect_uri)


@router.get("/login/google")
async def login_google(request: Request):
    """Redirect to Google OAuth"""
    redirect_uri = f"{settings.BACKEND_URL}/api/auth/callback/google"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback/github")
async def callback_github(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle GitHub OAuth callback"""
    try:
        token = await oauth.github.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")
    
    # Get user info from GitHub
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {token['access_token']}"}
        )
        github_user = resp.json()
        
        # Get email (might need separate request if private)
        email = github_user.get("email")
        if not email:
            resp = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {token['access_token']}"}
            )
            emails = resp.json()
            primary_email = next((e for e in emails if e.get("primary")), None)
            email = primary_email["email"] if primary_email else f"{github_user['id']}@github.local"
    
    # Find or create user
    result = await db.execute(
        select(User).where(User.provider == "github", User.provider_id == str(github_user["id"]))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        # Check if email already exists with different provider
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            # Link accounts - update provider info
            existing_user.provider = "github"
            existing_user.provider_id = str(github_user["id"])
            existing_user.avatar_url = github_user.get("avatar_url")
            user = existing_user
        else:
            # Create new user
            user = User(
                email=email,
                name=github_user.get("name") or github_user.get("login"),
                avatar_url=github_user.get("avatar_url"),
                provider="github",
                provider_id=str(github_user["id"])
            )
            db.add(user)
        
        await db.commit()
        await db.refresh(user)
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.uuid, "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Redirect to frontend with token
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
    )


@router.get("/callback/google")
async def callback_google(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")
    
    # Get user info from token (Google includes it in the id_token)
    user_info = token.get("userinfo")
    if not user_info:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token['access_token']}"}
            )
            user_info = resp.json()
    
    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")
    
    # Find or create user
    result = await db.execute(
        select(User).where(User.provider == "google", User.provider_id == str(google_id))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        # Check if email already exists
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            existing_user.provider = "google"
            existing_user.provider_id = str(google_id)
            existing_user.avatar_url = picture
            user = existing_user
        else:
            user = User(
                email=email,
                name=name,
                avatar_url=picture,
                provider="google",
                provider_id=str(google_id)
            )
            db.add(user)
        
        await db.commit()
        await db.refresh(user)
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.uuid, "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Redirect to frontend with token
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
    )


@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    """Get current user info"""
    if not user:
        return {"user": None}
    
    return {
        "user": {
            "id": user.uuid,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url,
            "provider": user.provider,
            "is_profile_complete": user.is_profile_complete,
            "university": user.university,
            "skill_level": user.skill_level,
            "career_goal": user.career_goal,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }


@router.post("/logout")
async def logout():
    """Logout (client should remove the token)"""
    return {"message": "Logged out successfully"}
