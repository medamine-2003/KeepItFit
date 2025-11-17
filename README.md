# keepItFit - Personal Fitness Companion

AI-powered fitness app with personalized meal planning, workout recommendations, and health tracking. Built with React Native (Expo) and FastAPI.

## Features

- **AI Meal Planning**: 7-day meal plans tailored to your profile (with a touch of Mediterranean/Tunisian cuisine)
- **Meal Analysis**: Snap photos of meals for instant nutritional insights
- **Recipe Generator**: Create healthy recipes from your ingredients
- **AI Fitness Coach**: Chat assistant for personalized guidance
- **Progress Tracking**: Visualize your fitness journey with insights and charts
- **Multi-language**: Full English and Arabic support with RTL layout

## Tech Stack

**Backend**: FastAPI, PostgreSQL, MinIO, Google Gemini AI  
**Mobile**: React Native, Expo Router, Context API  
**Auth**: JWT tokens with secure password hashing

## Quick Start

### Backend Setup

```bash
cd backend
# Update .env with your API keys
docker-compose up --build
```

### Mobile Setup

```bash
cd mobile
npm install
# Update apiBaseUrl in app.json to your backend IP
npx expo start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@db:5432/techheal_db
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=12345678
```

## Key Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /plan/generate` - Generate meal plan
- `POST /activity/meal-analysis` - Analyze meal image
- `POST /chat/message` - AI chat assistant

## Development

```bash
# Backend (local)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Mobile (with cache reset)
cd mobile
npx expo start -c
```

## Support

Create an issue on GitHub for bugs or feature requests.
