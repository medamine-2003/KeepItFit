# Backend API Documentation

## Overview

The keepItFit backend is built with FastAPI, providing a RESTful API for the mobile application. It handles user authentication, meal planning, activity tracking, and AI-powered features.

## API Endpoints

### Authentication

#### `POST /auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "age": 0,
  "weight": 0,
  "height": 0,
  "goal": "string",
  "diet": "string",
  "activity_level": "string",
  "health_conditions": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "string"
}
```

#### `POST /auth/login`
Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "string"
}
```

#### `POST /auth/update-profile`
Update the authenticated user's profile information.

**Request Body:**
```json
{
  "age": 0,
  "weight": 0,
  "height": 0,
  "goal": "string",
  "diet": "string",
  "activity_level": "string",
  "health_conditions": "string"
}
```

**Response:**
```json
{
  "id": 0,
  "username": "string",
  "email": "string",
  "age": 0,
  "weight": 0,
  "height": 0,
  "goal": "string",
  "diet": "string",
  "activity_level": "string",
  "health_conditions": "string",
  "profile_picture": "string"
}
```

#### `GET /auth/me`
Get the authenticated user's profile information.

**Response:**
```json
{
  "id": 0,
  "username": "string",
  "email": "string",
  "age": 0,
  "weight": 0,
  "height": 0,
  "goal": "string",
  "diet": "string",
  "activity_level": "string",
  "health_conditions": "string",
  "profile_picture": "string"
}
```

#### `POST /auth/upload-profile-picture`
Upload a profile picture for the authenticated user.

**Request:**
- Multipart form data with file attachment

**Response:**
```json
{
  "profile_picture": "string"
}
```

### Meal Planning

#### `POST /plan/generate`
Generate a personalized 7-day meal plan based on user profile.

**Response:**
```json
{
  "meal_plan": [
    {
      "day": 0,
      "breakfast": "string",
      "lunch": "string",
      "dinner": "string"
    }
  ],
  "workout_plan": [
    {
      "day": 0,
      "workout": "string"
    }
  ]
}
```

#### `POST /plan/generate-recipe`
Generate a healthy recipe from a list of ingredients.

**Request Body:**
```json
{
  "ingredients": "string"
}
```

**Response:**
```json
{
  "recipe_name": "string",
  "cuisine": "string",
  "prep_time": "string",
  "cook_time": "string",
  "servings": 0,
  "ingredients": ["string"],
  "instructions": ["string"],
  "nutrition": {
    "calories": 0,
    "protein": "string",
    "carbs": "string",
    "fat": "string"
  },
  "health_benefits": ["string"]
}
```

### Activity Tracking

#### `POST /activity/meal-analysis`
Analyze a meal image and provide nutritional information.

**Request:**
- Multipart form data with image file and optional prompt

**Response:**
```json
{
  "analysis": "string"
}
```

#### `GET /activity/meal-insights`
Get historical meal analysis data.

**Response:**
```json
[
  {
    "id": 0,
    "user_id": 0,
    "image_url": "string",
    "analysis": "string",
    "created_at": "string"
  }
]
```

#### `POST /activity/log`
Log a fitness activity.

**Request Body:**
```json
{
  "activity_type": "string",
  "duration": 0,
  "calories_burned": 0,
  "notes": "string"
}
```

**Response:**
```json
{
  "id": 0,
  "user_id": 0,
  "activity_type": "string",
  "duration": 0,
  "calories_burned": 0,
  "notes": "string",
  "created_at": "string"
}
```

#### `GET /activity/logs`
Get historical activity logs.

**Response:**
```json
[
  {
    "id": 0,
    "user_id": 0,
    "activity_type": "string",
    "duration": 0,
    "calories_burned": 0,
    "notes": "string",
    "created_at": "string"
  }
]
```

### Chat

#### `POST /chat/message`
Send a message to the AI chat assistant.

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "response": "string"
}
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "detail": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Exceeding the limit will result in a 429 status code.

## Data Models

### User
```json
{
  "id": 0,
  "username": "string",
  "email": "string",
  "age": 0,
  "weight": 0,
  "height": 0,
  "goal": "string",
  "diet": "string",
  "activity_level": "string",
  "health_conditions": "string",
  "profile_picture": "string"
}
```

### Activity Log
```json
{
  "id": 0,
  "user_id": 0,
  "activity_type": "string",
  "duration": 0,
  "calories_burned": 0,
  "notes": "string",
  "created_at": "string"
}
```

### Meal Insight
```json
{
  "id": 0,
  "user_id": 0,
  "image_url": "string",
  "analysis": "string",
  "created_at": "string"
}
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL database connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `MINIO_ENDPOINT`: MinIO server endpoint
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key
- `MINIO_BUCKET`: MinIO bucket name
- `MINIO_PUBLIC_ENDPOINT`: Public endpoint for MinIO access
- `GEMINI_API_KEY`: Google Gemini API key
- `OPENAI_API_KEY`: OpenAI API key (optional)

## Deployment

### Docker Deployment

The recommended way to deploy the backend is using Docker Compose:

```bash
docker-compose up --build
```

### Manual Deployment

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables

3. Run the application:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## Development

### Running Tests

```bash
python -m pytest
```

### Code Formatting

```bash
black .
```

### Type Checking

```bash
mypy .
```

## Monitoring

The API includes health check endpoints:

- `GET /`: API status and welcome message
- `GET /docs`: Interactive API documentation (Swagger UI)
- `GET /redoc`: Alternative API documentation (ReDoc)

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is configured for secure cross-origin requests
- API keys are stored as environment variables
- Input validation is performed on all endpoints