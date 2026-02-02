import json
from typing import List
from openai import OpenAI
from anthropic import Anthropic
from ..config import settings
from ..models.survey import SurveyResponse, ProjectRecommendation, ProjectRoadmapWeek, RecommendationResponse

SYSTEM_PROMPT = """You are an expert AI career counselor and project recommendation engine for the SanaPath AI platform, serving 60,000 students in the AI-Sana ecosystem.

Your role is to analyze student profiles and recommend personalized AI/ML project ideas that match their skills, interests, and career goals.

For each recommendation, you must provide:
1. A compelling project title
2. A detailed description (2-3 sentences)
3. Difficulty level (Beginner, Intermediate, Advanced, Expert)
4. Complete tech stack (programming languages, frameworks, tools)
5. Estimated duration
6. Key learning outcomes (3-5 bullet points)
7. A detailed 4-week implementation roadmap with specific tasks and deliverables
8. Relevant tags for discoverability

IMPORTANT: Your response must be valid JSON matching this exact structure:
{
    "recommendations": [
        {
            "title": "Project Title",
            "description": "Detailed description...",
            "difficulty_level": "Intermediate",
            "tech_stack": ["Python", "TensorFlow", "FastAPI"],
            "estimated_duration": "4 weeks",
            "learning_outcomes": ["outcome1", "outcome2", "outcome3"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: Foundation",
                    "tasks": ["task1", "task2"],
                    "deliverables": ["deliverable1"]
                }
            ],
            "tags": ["NLP", "Deep Learning", "Healthcare"]
        }
    ],
    "personalization_summary": "Summary of why these projects match the student..."
}

Generate exactly 5 unique project recommendations tailored to the student's profile."""


def build_user_prompt(survey: SurveyResponse) -> str:
    return f"""
Student Profile:
- Name: {survey.name}
- University: {survey.university or 'Not specified'}
- Programming Languages: {', '.join(survey.programming_languages)}
- Skill Level: {survey.skill_level}
- AI/ML Experience: {survey.ai_ml_experience}
- Interest Areas: {', '.join(survey.interest_areas)}
- Preferred Project Type: {survey.preferred_project_type}
- Industries of Interest: {', '.join(survey.industry_interest)}
- Career Goal: {survey.career_goal}
- Learning Style: {survey.learning_style}
- Time Commitment: {survey.time_commitment}
- Preferred Duration: {survey.project_duration}
- Team Preference: {survey.team_preference}
- Collaboration Tools: {', '.join(survey.collaboration_tools)}

Based on this comprehensive profile, generate 5 personalized AI project recommendations with detailed 4-week roadmaps. Ensure projects align with the student's skill level, interests, and career goals.
"""


async def get_recommendations_openai(survey: SurveyResponse) -> RecommendationResponse:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(survey)}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=4000
    )
    
    result = json.loads(response.choices[0].message.content)
    
    recommendations = []
    for rec in result["recommendations"]:
        roadmap = [ProjectRoadmapWeek(**week) for week in rec["roadmap"]]
        recommendations.append(ProjectRecommendation(
            title=rec["title"],
            description=rec["description"],
            difficulty_level=rec["difficulty_level"],
            tech_stack=rec["tech_stack"],
            estimated_duration=rec["estimated_duration"],
            learning_outcomes=rec["learning_outcomes"],
            roadmap=roadmap,
            tags=rec["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=result["personalization_summary"]
    )


async def get_recommendations_anthropic(survey: SurveyResponse) -> RecommendationResponse:
    client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": build_user_prompt(survey)}
        ]
    )
    
    result = json.loads(response.content[0].text)
    
    recommendations = []
    for rec in result["recommendations"]:
        roadmap = [ProjectRoadmapWeek(**week) for week in rec["roadmap"]]
        recommendations.append(ProjectRecommendation(
            title=rec["title"],
            description=rec["description"],
            difficulty_level=rec["difficulty_level"],
            tech_stack=rec["tech_stack"],
            estimated_duration=rec["estimated_duration"],
            learning_outcomes=rec["learning_outcomes"],
            roadmap=roadmap,
            tags=rec["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=result["personalization_summary"]
    )


async def get_recommendations(survey: SurveyResponse) -> RecommendationResponse:
    if settings.AI_PROVIDER == "anthropic":
        return await get_recommendations_anthropic(survey)
    return await get_recommendations_openai(survey)


def generate_linkedin_post(project_title: str, tech_stack: List[str], student_name: str, difficulty_level: str) -> str:
    tech_tags = " ".join([f"#{tech.replace(' ', '').replace('.', '')}" for tech in tech_stack[:5]])
    
    post = f"""🚀 Excited to announce that I'm starting a new AI project!

📌 Project: {project_title}
🎯 Difficulty: {difficulty_level}
💻 Tech Stack: {', '.join(tech_stack)}

I'm embarking on this journey through the SanaPath AI platform, joining 60,000+ students in the AI-Sana ecosystem who are building real-world AI solutions.

Looking forward to sharing my progress and connecting with fellow AI enthusiasts!

{tech_tags} #AI #MachineLearning #SanaPathAI #AISana #BuildInPublic #LearningInPublic

---
🔗 Discover your personalized AI project at SanaPath AI"""
    
    return post
