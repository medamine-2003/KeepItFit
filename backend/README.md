# keepItFit Backend API

A FastAPI-based backend for the keepItFit health and fitness application, providing personalized meal planning, activity tracking, and AI-powered nutrition analysis.

## Features

- **User Authentication** - JWT-based auth with secure password hashing
- **Personalized Meal Planning** - AI-generated 7-day meal and workout plans
- **Recipe Generation** - Create healthy recipes from available ingredients
- **Meal Analysis** - Image recognition for nutritional information
- **Activity Tracking** - Log workouts and track fitness progress
- **AI Chat Assistant** - Interactive health and fitness guidance

## Quick Start

### Prerequisites

- Python 3.9+
- PostgreSQL
- MinIO (for file storage)
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (see `.env.example`)

4. Run the application:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment

```bash
docker-compose up --build
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost/keepitfit
JWT_SECRET=your-secret-key
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=keepitfit
GEMINI_API_KEY=your-gemini-key
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Key Endpoints

- `POST /auth/register` - Create new account
- `POST /auth/login` - Get access token
- `POST /plan/generate` - Generate personalized meal plan
- `POST /activity/meal-analysis` - Analyze meal photos
- `POST /chat/message` - Chat with AI assistant

## Development

Run tests:
```bash
python -m pytest
```

Format code:
```bash
black .
```

## Security

- Bcrypt password hashing
- JWT token authentication
- CORS protection
- Environment-based secrets

## License

[Your License Here]
