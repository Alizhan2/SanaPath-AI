import json
from typing import List
from openai import OpenAI
from anthropic import Anthropic
import google.generativeai as genai
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


async def get_recommendations_gemini(survey: SurveyResponse) -> RecommendationResponse:
    """Get recommendations using Google Gemini AI"""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""{SYSTEM_PROMPT}

{build_user_prompt(survey)}

IMPORTANT: Respond ONLY with valid JSON, no additional text or markdown."""
    
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=4000,
        )
    )
    
    # Extract JSON from response
    response_text = response.text
    # Clean up if wrapped in markdown code block
    if "```json" in response_text:
        response_text = response_text.split("```json")[1].split("```")[0]
    elif "```" in response_text:
        response_text = response_text.split("```")[1].split("```")[0]
    
    result = json.loads(response_text.strip())
    
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


def generate_demo_recommendations(survey: SurveyResponse) -> RecommendationResponse:
    """Generate smart demo recommendations based on user interests without API"""
    
    # Map interests to project templates
    project_templates = {
        "Computer Vision": {
            "title": "🎯 Smart Object Detection System",
            "description": "Build a real-time object detection system using YOLO and OpenCV. Create an application that can identify and track multiple objects in video streams with high accuracy.",
            "tech_stack": ["Python", "PyTorch", "YOLO", "OpenCV", "Streamlit"],
            "tags": ["Computer Vision", "Deep Learning", "Real-time AI"]
        },
        "NLP": {
            "title": "💬 AI-Powered Sentiment Analyzer",
            "description": "Develop a sentiment analysis tool using transformer models that analyzes text from social media, reviews, and customer feedback to extract emotional insights.",
            "tech_stack": ["Python", "Hugging Face", "BERT", "FastAPI", "React"],
            "tags": ["NLP", "Transformers", "Text Analysis"]
        },
        "Machine Learning": {
            "title": "📊 Predictive Analytics Dashboard",
            "description": "Create a machine learning pipeline that predicts trends from historical data. Build an interactive dashboard for data visualization and model insights.",
            "tech_stack": ["Python", "Scikit-learn", "Pandas", "Plotly", "Streamlit"],
            "tags": ["ML", "Data Science", "Analytics"]
        },
        "Data Science": {
            "title": "🔍 Automated Data Pipeline & EDA Tool",
            "description": "Build an automated data exploration and cleaning pipeline that generates insights, visualizations, and data quality reports from any dataset.",
            "tech_stack": ["Python", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
            "tags": ["Data Science", "EDA", "Automation"]
        },
        "Generative AI": {
            "title": "🎨 AI Content Generator Studio",
            "description": "Create a multi-modal AI content generation platform using LLMs and diffusion models. Generate text, images, and code based on natural language prompts.",
            "tech_stack": ["Python", "OpenAI API", "LangChain", "Stable Diffusion", "React"],
            "tags": ["GenAI", "LLMs", "Creative AI"]
        },
        "Robotics": {
            "title": "🤖 Autonomous Robot Navigator",
            "description": "Develop a robot navigation system using ROS2 and computer vision. Implement path planning, obstacle avoidance, and SLAM algorithms.",
            "tech_stack": ["Python", "ROS2", "OpenCV", "TensorFlow", "Gazebo"],
            "tags": ["Robotics", "Autonomous Systems", "Navigation"]
        },
        "Reinforcement Learning": {
            "title": "🎮 Game-Playing AI Agent",
            "description": "Train an AI agent to master complex games using deep reinforcement learning. Implement DQN, PPO, or A3C algorithms from scratch.",
            "tech_stack": ["Python", "PyTorch", "OpenAI Gym", "Stable-Baselines3", "Weights & Biases"],
            "tags": ["RL", "Deep Learning", "Game AI"]
        },
        "MLOps": {
            "title": "🚀 End-to-End MLOps Pipeline",
            "description": "Build a complete ML pipeline with automated training, testing, deployment, and monitoring. Implement CI/CD for machine learning models.",
            "tech_stack": ["Python", "MLflow", "Docker", "Kubernetes", "GitHub Actions"],
            "tags": ["MLOps", "DevOps", "Deployment"]
        }
    }
    
    # Default projects for any interest
    default_projects = [
        {
            "title": "🧠 Personal AI Assistant",
            "description": "Build your own AI assistant using LLMs that can answer questions, summarize documents, and help with daily tasks. Integrate with APIs for real-world functionality.",
            "tech_stack": ["Python", "LangChain", "OpenAI API", "FastAPI", "React"],
            "tags": ["LLMs", "Chatbots", "Personal AI"]
        },
        {
            "title": "📱 AI-Powered Mobile App",
            "description": "Create a cross-platform mobile app with integrated AI features like image recognition, voice commands, or smart recommendations.",
            "tech_stack": ["React Native", "TensorFlow Lite", "Python", "Firebase"],
            "tags": ["Mobile AI", "Edge Computing", "Apps"]
        },
        {
            "title": "🌐 AI Web Scraper & Analyzer",
            "description": "Build an intelligent web scraping system that extracts, processes, and analyzes data from websites using AI to identify patterns and insights.",
            "tech_stack": ["Python", "BeautifulSoup", "Selenium", "SpaCy", "PostgreSQL"],
            "tags": ["Web Scraping", "Data Extraction", "Automation"]
        }
    ]
    
    recommendations = []
    used_titles = set()
    
    # Generate roadmap template
    def create_roadmap(title: str):
        return [
            {
                "week": 1,
                "title": "Week 1: Setup & Research",
                "tasks": [
                    "Set up development environment",
                    "Research existing solutions and best practices",
                    "Define project scope and requirements",
                    "Create project structure"
                ],
                "deliverables": ["Project repository", "Requirements document"]
            },
            {
                "week": 2,
                "title": "Week 2: Core Development",
                "tasks": [
                    "Implement core algorithms",
                    "Build data processing pipeline",
                    "Create basic API/interface",
                    "Write unit tests"
                ],
                "deliverables": ["Working prototype", "Test suite"]
            },
            {
                "week": 3,
                "title": "Week 3: Integration & Features",
                "tasks": [
                    "Add advanced features",
                    "Integrate all components",
                    "Optimize performance",
                    "Handle edge cases"
                ],
                "deliverables": ["Feature-complete version", "Performance benchmarks"]
            },
            {
                "week": 4,
                "title": "Week 4: Polish & Deploy",
                "tasks": [
                    "Build user interface",
                    "Write documentation",
                    "Deploy to cloud",
                    "Create demo video"
                ],
                "deliverables": ["Deployed application", "Documentation", "Demo"]
            }
        ]
    
    # Select projects based on user interests
    for interest in survey.interest_areas:
        if interest in project_templates and project_templates[interest]["title"] not in used_titles:
            template = project_templates[interest]
            used_titles.add(template["title"])
            
            recommendations.append(ProjectRecommendation(
                title=template["title"],
                description=template["description"],
                difficulty_level=survey.skill_level if survey.skill_level in ["Beginner", "Intermediate", "Advanced", "Expert"] else "Intermediate",
                tech_stack=template["tech_stack"],
                estimated_duration=survey.project_duration or "4 weeks",
                learning_outcomes=[
                    f"Master {template['tech_stack'][0]} for AI development",
                    f"Build production-ready {interest.lower()} applications",
                    "Learn best practices for AI project architecture",
                    "Deploy and monitor AI systems in production",
                    "Build a portfolio-worthy project"
                ],
                roadmap=[ProjectRoadmapWeek(**week) for week in create_roadmap(template["title"])],
                tags=template["tags"]
            ))
            
            if len(recommendations) >= 5:
                break
    
    # Fill remaining slots with default projects
    for project in default_projects:
        if len(recommendations) >= 5:
            break
        if project["title"] not in used_titles:
            used_titles.add(project["title"])
            recommendations.append(ProjectRecommendation(
                title=project["title"],
                description=project["description"],
                difficulty_level=survey.skill_level if survey.skill_level in ["Beginner", "Intermediate", "Advanced", "Expert"] else "Intermediate",
                tech_stack=project["tech_stack"],
                estimated_duration=survey.project_duration or "4 weeks",
                learning_outcomes=[
                    f"Master {project['tech_stack'][0]} for AI development",
                    "Build production-ready AI applications",
                    "Learn modern AI development practices",
                    "Deploy and share your AI project",
                    "Strengthen your AI portfolio"
                ],
                roadmap=[ProjectRoadmapWeek(**week) for week in create_roadmap(project["title"])],
                tags=project["tags"]
            ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=f"Based on your interests in {', '.join(survey.interest_areas[:3])}, skill level ({survey.skill_level}), and career goal ({survey.career_goal}), we've curated these {len(recommendations)} projects to accelerate your AI journey. Each project includes a detailed 4-week roadmap tailored to your {survey.time_commitment} time commitment."
    )


async def get_recommendations(survey: SurveyResponse) -> RecommendationResponse:
    """Get AI recommendations - uses real AI if API key available, otherwise demo mode"""
    
    # Check if demo mode is enabled
    if settings.AI_DEMO_MODE:
        print("AI Demo mode enabled, using demo recommendations")
        return generate_demo_recommendations(survey)
    
    # Try Gemini first (default provider)
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            print("Using Gemini AI for recommendations...")
            return await get_recommendations_gemini(survey)
        except Exception as e:
            print(f"Gemini API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # Try Anthropic
    if settings.AI_PROVIDER == "anthropic" and settings.ANTHROPIC_API_KEY:
        try:
            return await get_recommendations_anthropic(survey)
        except Exception as e:
            print(f"Anthropic API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # Try OpenAI
    if settings.OPENAI_API_KEY:
        try:
            return await get_recommendations_openai(survey)
        except Exception as e:
            print(f"OpenAI API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # No API keys - use demo mode
    print("No AI API keys configured, using demo recommendations")
    return generate_demo_recommendations(survey)


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
