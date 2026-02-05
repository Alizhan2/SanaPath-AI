import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # AI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")  # "openai" or "anthropic"
    AI_DEMO_MODE: bool = os.getenv("AI_DEMO_MODE", "true").lower() == "true"
    
    # Database - SQLite by default, PostgreSQL for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./sanapath.db")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sanapath-secret-key-change-in-production-2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # OAuth - GitHub
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    
    # OAuth - Google
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # OAuth - LinkedIn
    LINKEDIN_CLIENT_ID: str = os.getenv("LINKEDIN_CLIENT_ID", "")
    LINKEDIN_CLIENT_SECRET: str = os.getenv("LINKEDIN_CLIENT_SECRET", "")
    
    # URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    # Demo mode - allows login without OAuth
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, staging, production
    
settings = Settings()
