# 🚀 Деплой SanaPath AI

## Шаг 1: Подготовка GitHub репозитория

```bash
cd "c:\Users\Admin\Desktop\Carerr Ai"
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Шаг 2: Деплой Backend на Render (Бесплатно)

### 2.1. Создать аккаунт
1. Перейти на https://render.com
2. "Sign up with GitHub"

### 2.2. Создать Web Service
1. Dashboard → "New" → "Web Service"
2. Подключить GitHub репозиторий `SanaPath-AI`
3. Настройки:
   - **Name:** `sanapath-api`
   - **Region:** Frankfurt (EU)
   - **Branch:** `main`
   - **Root Directory:** (оставить пустым)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

### 2.3. Environment Variables (в Render)
```
SECRET_KEY = (нажать Generate)
GEMINI_API_KEY = AIzaSyBh2WvKx4Fte6q6UUU4YAElvQWtlrH5pto
CORS_ORIGINS = https://sanapath-ai.vercel.app
ENVIRONMENT = production
DEMO_MODE = true
AI_DEMO_MODE = true
```

### 2.4. Нажать "Create Web Service"
- Подождать 5-10 минут для билда
- URL будет: `https://sanapath-api.onrender.com`

---

## Шаг 3: Деплой Frontend на Vercel (Бесплатно)

### 3.1. Создать аккаунт
1. Перейти на https://vercel.com
2. "Sign up with GitHub"

### 3.2. Import Project
1. "Add New" → "Project"
2. Выбрать репозиторий `SanaPath-AI`
3. Настройки:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3. Environment Variables (в Vercel)
```
VITE_API_URL = https://sanapath-api.onrender.com
VITE_FIREBASE_API_KEY = AIzaSyAYOURKEY
VITE_FIREBASE_AUTH_DOMAIN = sanapath-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = sanapath-ai
```

### 3.4. Нажать "Deploy"
- Подождать 2-3 минуты
- URL будет: `https://sanapath-ai.vercel.app`

---

## Шаг 4: Проверка

### Тестовые URLs:
| Сервис | URL |
|--------|-----|
| Frontend | https://sanapath-ai.vercel.app |
| Backend API | https://sanapath-api.onrender.com |
| API Docs | https://sanapath-api.onrender.com/docs |
| Health Check | https://sanapath-api.onrender.com/health |

### Проверить:
1. Открыть https://sanapath-ai.vercel.app
2. Попробовать Demo Login
3. Пройти Survey
4. Проверить Dashboard

---

## 🔧 Troubleshooting

### Backend не запускается
```bash
# Проверить логи в Render Dashboard
# Убедиться что requirements.txt корректный
```

### CORS ошибки
1. В Render добавить переменную:
   ```
   CORS_ORIGINS = https://your-app.vercel.app
   ```
2. Redeploy backend

### Frontend не подключается к API
1. В Vercel проверить переменную:
   ```
   VITE_API_URL = https://sanapath-api.onrender.com
   ```
2. Redeploy frontend

---

## 💰 Бесплатные лимиты

### Render (Free tier):
- 750 часов/месяц
- Засыпает после 15 мин неактивности
- Первый запрос после сна ~30 сек

### Vercel (Hobby):
- 100 GB bandwidth
- Unlimited deployments
- Automatic HTTPS

---

## 🎉 Готово!

После деплоя твой проект будет доступен по адресу:
**https://sanapath-ai.vercel.app**

Поделись ссылкой для тестирования! 🚀
