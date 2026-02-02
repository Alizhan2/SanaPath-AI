from fastapi import APIRouter, HTTPException
from ..models.survey import SurveyResponse, RecommendationResponse
from ..services.ai_engine import get_recommendations

router = APIRouter(prefix="/api/survey", tags=["Survey"])

@router.post("/submit", response_model=RecommendationResponse)
async def submit_survey(survey: SurveyResponse):
    """
    Submit the 15-question survey and receive 5 personalized AI project recommendations.
    """
    try:
        recommendations = await get_recommendations(survey)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/questions")
async def get_survey_questions():
    """
    Get the list of survey questions for the multi-step form.
    """
    questions = {
        "steps": [
            {
                "id": 1,
                "title": "Personal Information",
                "description": "Let's start with some basics",
                "questions": [
                    {"id": "name", "type": "text", "label": "What's your name?", "required": True},
                    {"id": "email", "type": "email", "label": "Your email address", "required": True},
                    {"id": "university", "type": "text", "label": "University/Institution (optional)", "required": False}
                ]
            },
            {
                "id": 2,
                "title": "Technical Skills",
                "description": "Tell us about your programming background",
                "questions": [
                    {
                        "id": "programming_languages",
                        "type": "multiselect",
                        "label": "Which programming languages do you know?",
                        "options": ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "R", "SQL", "Other"],
                        "required": True
                    },
                    {
                        "id": "skill_level",
                        "type": "select",
                        "label": "What's your overall programming skill level?",
                        "options": ["beginner", "intermediate", "advanced", "expert"],
                        "required": True
                    },
                    {
                        "id": "ai_ml_experience",
                        "type": "select",
                        "label": "Describe your AI/ML experience",
                        "options": [
                            "No experience - just getting started",
                            "Basic - completed tutorials/courses",
                            "Intermediate - built small projects",
                            "Advanced - deployed production models",
                            "Expert - research/published work"
                        ],
                        "required": True
                    }
                ]
            },
            {
                "id": 3,
                "title": "Interests & Focus",
                "description": "What excites you in AI?",
                "questions": [
                    {
                        "id": "interest_areas",
                        "type": "multiselect",
                        "label": "Select your areas of interest in AI",
                        "options": [
                            "Natural Language Processing",
                            "Computer Vision",
                            "Reinforcement Learning",
                            "Generative AI",
                            "MLOps & Deployment",
                            "Data Engineering",
                            "Robotics & Automation",
                            "Healthcare AI",
                            "Finance & Trading AI",
                            "Conversational AI"
                        ],
                        "required": True
                    },
                    {
                        "id": "preferred_project_type",
                        "type": "select",
                        "label": "What type of project appeals to you?",
                        "options": [
                            "Research-focused (papers, experiments)",
                            "Product-focused (build & ship)",
                            "Open-source contribution",
                            "Startup/entrepreneurial",
                            "Social impact & non-profit"
                        ],
                        "required": True
                    },
                    {
                        "id": "industry_interest",
                        "type": "multiselect",
                        "label": "Which industries interest you?",
                        "options": [
                            "Healthcare & Biotech",
                            "Finance & Fintech",
                            "Education & EdTech",
                            "E-commerce & Retail",
                            "Gaming & Entertainment",
                            "Climate & Sustainability",
                            "Transportation & Logistics",
                            "Manufacturing & Industry 4.0"
                        ],
                        "required": True
                    }
                ]
            },
            {
                "id": 4,
                "title": "Goals & Learning",
                "description": "Where do you want to go?",
                "questions": [
                    {
                        "id": "career_goal",
                        "type": "select",
                        "label": "What's your primary career goal?",
                        "options": [
                            "ML Engineer at a tech company",
                            "Data Scientist",
                            "AI Researcher (academia)",
                            "Startup Founder",
                            "Full-stack AI Developer",
                            "AI Product Manager",
                            "Freelance AI Consultant"
                        ],
                        "required": True
                    },
                    {
                        "id": "learning_style",
                        "type": "select",
                        "label": "How do you prefer to learn?",
                        "options": [
                            "Learning by doing (build first)",
                            "Theory first, then practice",
                            "Video tutorials & courses",
                            "Reading documentation & papers",
                            "Peer learning & collaboration"
                        ],
                        "required": True
                    }
                ]
            },
            {
                "id": 5,
                "title": "Time & Collaboration",
                "description": "Let's plan your journey",
                "questions": [
                    {
                        "id": "time_commitment",
                        "type": "select",
                        "label": "How many hours per week can you dedicate?",
                        "options": [
                            "Less than 5 hours",
                            "5-10 hours",
                            "10-20 hours",
                            "20-30 hours",
                            "Full-time (30+ hours)"
                        ],
                        "required": True
                    },
                    {
                        "id": "project_duration",
                        "type": "select",
                        "label": "Preferred project duration",
                        "options": [
                            "1-2 weeks (quick win)",
                            "3-4 weeks (standard)",
                            "1-2 months (substantial)",
                            "3+ months (long-term)"
                        ],
                        "required": True
                    },
                    {
                        "id": "team_preference",
                        "type": "select",
                        "label": "Do you prefer working solo or in a team?",
                        "options": [
                            "Solo - I like independence",
                            "Small team (2-3 people)",
                            "Larger team (4-6 people)",
                            "Flexible - depends on the project"
                        ],
                        "required": True
                    },
                    {
                        "id": "collaboration_tools",
                        "type": "multiselect",
                        "label": "Which tools are you comfortable with?",
                        "options": ["Git/GitHub", "Slack", "Discord", "Notion", "Jira", "Linear", "Google Workspace", "VS Code Live Share"],
                        "required": True
                    }
                ]
            }
        ],
        "total_questions": 15
    }
    return questions
