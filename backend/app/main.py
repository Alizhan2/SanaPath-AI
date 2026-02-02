from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import survey, community

app = FastAPI(
    title="SanaPath AI API",
    description="Career & Project Matching Platform for AI-Sana Ecosystem",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(survey.router)
app.include_router(community.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to SanaPath AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "ecosystem": "AI-Sana",
        "students": "60,000+"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "sanapath-ai"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
