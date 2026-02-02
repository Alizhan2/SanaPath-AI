# SanaPath AI 🚀

> Career & Project Matching Platform for 60,000+ Students in the AI-Sana Ecosystem

![SanaPath AI](https://img.shields.io/badge/SanaPath-AI-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?style=for-the-badge&logo=fastapi)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwindcss)

## 🌟 Features

- **Smart Onboarding**: Multi-step survey (15 questions) with beautiful progress tracking
- **AI Recommendation Engine**: GPT-4o/Claude 3.5 powered project matching
- **Personalized Roadmaps**: 4-week implementation plans for each project
- **Community Hub**: Publish projects and find collaborators
- **LinkedIn Export**: One-click "Project Started" post generation
- **Modern UI**: Dark-themed, futuristic design with smooth animations

## 🎨 Design

- **Theme**: Futuristic Academic
- **Colors**: Deep Blue (#0a1628) + Neon Purple (#b01aff) + Cyber Blue (#00d4ff)
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS 3.4
- Framer Motion
- Lucide React Icons
- React Router DOM

### Backend
- FastAPI (Python)
- OpenAI GPT-4o / Anthropic Claude 3.5
- Pydantic validation
- CORS middleware

## 📦 Project Structure

```
sanapath-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Configuration settings
│   │   ├── models/
│   │   │   └── survey.py        # Pydantic models
│   │   ├── routes/
│   │   │   ├── survey.py        # Survey endpoints
│   │   │   └── community.py     # Community endpoints
│   │   └── services/
│   │       └── ai_engine.py     # LLM integration
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Homepage
│   │   │   ├── Survey.jsx       # Multi-step form
│   │   │   ├── Recommendations.jsx
│   │   │   └── Community.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI or Anthropic API key

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your API key to .env
# OPENAI_API_KEY=sk-your-key-here
# or
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# AI_PROVIDER=openai  # or "anthropic"

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📡 API Endpoints

### Survey
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/survey/submit` | Submit survey & get recommendations |
| GET | `/api/survey/questions` | Get survey question structure |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/community/publish` | Publish project to community |
| GET | `/api/community/projects` | List all community projects |
| GET | `/api/community/projects/{id}` | Get specific project |
| POST | `/api/community/projects/{id}/join` | Join a project |
| POST | `/api/community/linkedin-post` | Generate LinkedIn post |

## 🎯 Survey Questions (15 Total)

### Step 1: Personal Information
1. Name
2. Email
3. University (optional)

### Step 2: Technical Skills
4. Programming Languages (multi-select)
5. Skill Level
6. AI/ML Experience

### Step 3: Interests & Focus
7. Interest Areas in AI (multi-select)
8. Preferred Project Type
9. Industry Interest (multi-select)

### Step 4: Goals & Learning
10. Career Goal
11. Learning Style

### Step 5: Time & Collaboration
12. Weekly Time Commitment
13. Preferred Project Duration
14. Team Preference
15. Collaboration Tools (multi-select)

## 🤖 AI Recommendation Response

Each recommendation includes:
- Project Title
- Description
- Difficulty Level (Beginner/Intermediate/Advanced/Expert)
- Tech Stack
- Estimated Duration
- Learning Outcomes
- 4-Week Roadmap with tasks & deliverables
- Tags for discoverability

## 🎨 Customization

### Colors (tailwind.config.js)
```javascript
colors: {
  'deep-blue': { /* ... */ },
  'neon-purple': { /* ... */ },
  'cyber': {
    blue: '#00d4ff',
    purple: '#b01aff',
    pink: '#ff1a75',
    green: '#00ff94',
  }
}
```

### AI Provider
Change in `.env`:
```env
AI_PROVIDER=openai   # or "anthropic"
```

## 📝 License

MIT License - Built for the AI-Sana Ecosystem

---

**Built with ❤️ for 60,000+ AI-Sana Students**
