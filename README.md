# 🚀 SanaPath AI - Career & Project Matching Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi" />
  <img src="https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase" />
  <img src="https://img.shields.io/badge/AI-GPT--4o%20%7C%20Claude-purple" />
  <br/><br/>
  <strong>Career & Project Matching Platform for 60,000+ Students in the AI-Sana Ecosystem</strong>
</div>

---

## ✨ Возможности

- 🤖 **AI-рекомендации** — персонализированные проекты на основе интересов и навыков (OpenAI GPT-4o / Claude)
- 📊 **4-недельные roadmaps** — структурированные планы с задачами и deliverables
- 👥 **Сообщество** — поиск соавторов и публикация проектов
- 🔐 **Аутентификация** — Google, GitHub, LinkedIn, Email через Firebase
- 📱 **Личный кабинет** — отслеживание прогресса, streak, статистика
- 🎨 **Современный UI** — темная тема, анимации Framer Motion

---

## 🛠️ Технологии

| Frontend | Backend | Auth & AI |
|----------|---------|-----------|
| React 18 + Vite | FastAPI 0.109 | Firebase Auth |
| Tailwind CSS 3.4 | SQLAlchemy + SQLite/PostgreSQL | OpenAI GPT-4o |
| Framer Motion | Pydantic | Anthropic Claude |
| React Router 6 | JWT Tokens | OAuth 2.0 |

---

## 🚀 Быстрый старт

### Клонирование

```bash
git clone https://github.com/Alizhan2/SanaPath-AI.git
cd SanaPath-AI
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
cp .env.example .env
# Отредактируйте .env - добавьте API ключи

python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

📍 Открыть: http://localhost:5173

---

## 🌐 Production Deployment

### Backend → Railway

1. [Railway.app](https://railway.app) → New Project → GitHub repo
2. Root Directory: `backend`
3. Environment variables:
   ```
   OPENAI_API_KEY=sk-...
   SECRET_KEY=your-secret-key
   FRONTEND_URL=https://your-frontend.vercel.app
   AI_DEMO_MODE=false
   ```
4. Add PostgreSQL database (Railway auto-sets DATABASE_URL)

### Frontend → Vercel

1. [Vercel.com](https://vercel.com) → Import Project
2. Root Directory: `frontend`
3. Environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. Deploy!

### Custom Domain

```
Vercel → Settings → Domains → Add Domain
```

Configure DNS:
- A Record: `@` → Vercel IP
- CNAME: `www` → `cname.vercel-dns.com`

---

## 🔑 API Keys Setup

| Service | URL | Variable |
|---------|-----|----------|
| OpenAI | [platform.openai.com](https://platform.openai.com) | `OPENAI_API_KEY` |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | `ANTHROPIC_API_KEY` |
| Firebase | [console.firebase.google.com](https://console.firebase.google.com) | Frontend config |

---

## 📁 Project Structure

```
SanaPath-AI/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── config.py         # Settings
│   │   ├── database.py       # SQLAlchemy
│   │   ├── models/           # DB models
│   │   ├── routes/           # API routes
│   │   ├── routers/          # Additional routers
│   │   └── services/         # AI engine & logic
│   ├── requirements.txt
│   ├── railway.toml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, etc.
│   │   ├── pages/            # Home, Survey, Dashboard, etc.
│   │   ├── context/          # AuthContext
│   │   ├── config/           # Firebase
│   │   └── services/         # API client
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
└── README.md
```

---

## 🎨 Design System

- **Theme**: Futuristic Academic Dark
- **Primary**: Deep Blue `#0a1628`
- **Accent 1**: Neon Purple `#b01aff`
- **Accent 2**: Cyber Blue `#00d4ff`
- **Font**: Inter

---

## 📞 Contact

- **GitHub**: [@Alizhan2](https://github.com/Alizhan2)
- **Repository**: [SanaPath-AI](https://github.com/Alizhan2/SanaPath-AI)

---

<div align="center">
  <strong>Made with ❤️ for AI-Sana Ecosystem</strong>
  <br/>
  <sub>60,000+ students building the future of AI</sub>
</div>
