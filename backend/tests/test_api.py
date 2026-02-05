"""
Tests for API endpoints
"""
import pytest
from httpx import AsyncClient


class TestHealthCheck:
    """Test health check endpoint"""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client: AsyncClient):
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "sanapath-ai"
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client: AsyncClient):
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "SanaPath" in data["message"]


class TestSurveyAPI:
    """Test survey endpoints"""
    
    @pytest.mark.asyncio
    async def test_get_survey_questions(self, client: AsyncClient):
        response = await client.get("/api/survey/questions")
        assert response.status_code == 200
        data = response.json()
        assert "questions" in data
        assert isinstance(data["questions"], list)
        assert len(data["questions"]) > 0
    
    @pytest.mark.asyncio
    async def test_submit_survey_valid(self, client: AsyncClient):
        survey_data = {
            "name": "Test User",
            "email": "test@example.com",
            "university": "Test University",
            "programming_languages": ["Python", "JavaScript"],
            "skill_level": "intermediate",
            "ai_ml_experience": "Some experience with ML basics",
            "interest_areas": ["NLP", "Computer Vision"],
            "preferred_project_type": "Research",
            "industry_interest": ["Tech", "Healthcare"],
            "career_goal": "ML Engineer",
            "learning_style": "Project-based",
            "time_commitment": "10-20 hours/week",
            "project_duration": "4 weeks",
            "team_preference": "solo",
            "collaboration_tools": ["GitHub", "Slack"]
        }
        
        response = await client.post("/api/survey/submit", json=survey_data)
        assert response.status_code == 200
        data = response.json()
        assert "student_name" in data
        assert "recommendations" in data
        assert len(data["recommendations"]) > 0


class TestCommunityAPI:
    """Test community endpoints"""
    
    @pytest.mark.asyncio
    async def test_get_community_projects_empty(self, client: AsyncClient):
        response = await client.get("/api/community/projects")
        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert "total" in data
        assert isinstance(data["projects"], list)
    
    @pytest.mark.asyncio
    async def test_get_community_projects_with_filters(self, client: AsyncClient):
        response = await client.get(
            "/api/community/projects",
            params={"difficulty": "Beginner", "page": 1, "per_page": 5}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 1
        assert data["per_page"] == 5
    
    @pytest.mark.asyncio
    async def test_get_project_not_found(self, client: AsyncClient):
        response = await client.get("/api/community/projects/nonexistent-uuid")
        assert response.status_code == 404


class TestAuthAPI:
    """Test authentication endpoints"""
    
    @pytest.mark.asyncio
    async def test_demo_status(self, client: AsyncClient):
        response = await client.get("/api/auth/demo/status")
        assert response.status_code == 200
        data = response.json()
        assert "demo_mode" in data
    
    @pytest.mark.asyncio
    async def test_demo_login(self, client: AsyncClient):
        response = await client.post(
            "/api/auth/demo/login",
            json={"email": "demo@test.com", "name": "Demo User"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
    
    @pytest.mark.asyncio
    async def test_get_me_unauthorized(self, client: AsyncClient):
        response = await client.get("/api/auth/me")
        assert response.status_code in [401, 403]
