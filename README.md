# keepItFit - Personal Fitness Companion

A comprehensive mobile fitness application with AI-powered meal planning, workout recommendations, and health tracking features. Built with React Native (Expo) for the frontend and FastAPI for the backend.

## 🌟 Features

### User Management
- **Authentication**: Secure signup and login with JWT tokens
- **Profile Management**: Complete user profile with age, weight, height, fitness goals, diet preferences, and activity level
- **Profile Picture**: Upload and display profile pictures using MinIO storage

### AI-Powered Health Features
- **Personalized Meal Plans**: AI-generated 7-day Mediterranean/Tunisian cuisine meal plans based on user profile
- **Meal Image Analysis**: Upload meal photos for nutritional analysis using Gemini AI
- **Recipe Generator**: Create healthy recipes from available ingredients
- **AI Chat Assistant**: Personal fitness coach powered by Gemini AI
- **Wellness Scoring**: Track overall health and fitness progress

### Activity Tracking
- **Meal Analyzer**: Analyze nutritional content of meals through image recognition
- **Recipe Generator**: Generate healthy recipes from user-provided ingredients
- **Progress Insights**: Visualize fitness journey with charts and statistics

### Localization
- **Multi-language Support**: Full English and Arabic language support with RTL layout
- **Language Switching**: Easy toggle between languages in user profile

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication with password hashing
- **Storage**: MinIO for image storage
- **AI Integration**: 
  - Google Gemini API for chat, meal analysis, and recipe generation
  - OpenAI API for additional AI features
- **Containerization**: Docker and Docker Compose for easy deployment

### Mobile App (React Native/Expo)
- **Framework**: React Native with Expo Router
- **State Management**: Context API for authentication and language
- **Navigation**: Bottom tab navigation with custom headers
- **UI Components**: Custom theming and responsive design
- **Image Handling**: Expo Image Picker for photo uploads
- **Networking**: Axios for API communication
- **Storage**: Expo SecureStore for sensitive data

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v18 or higher)
- npm or yarn
- Python 3.11 (for local development)
- Expo CLI

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure environment variables**:
   Update the `.env` file with your API keys and configuration:
   ```env
   DATABASE_URL=postgresql://user:password@db:5432/techheal_db
   JWT_SECRET=your-super-secret-jwt-key
   MINIO_ENDPOINT=minio:9000
   MINIO_ACCESS_KEY=admin
   MINIO_SECRET_KEY=12345678
   MINIO_BUCKET=uploads
   MINIO_PUBLIC_ENDPOINT=192.168.1.122:9000
   GEMINI_API_KEY=your-gemini-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Start services with Docker**:
   ```bash
   docker-compose up --build
   ```

### Mobile App Setup

1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Update API URL** (if needed):
   In `app.json`, update the `extra.apiBaseUrl` to match your backend IP:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "http://YOUR_IP:8000"
       }
     }
   }
   ```

4. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**:
   - Scan QR code with Expo Go app
   - Or use `npx expo start --android` / `npx expo start --ios`

## 📱 Key Screens

### Authentication Flow
- **Welcome Screen**: Introduction to the app
- **Login Screen**: Email/password authentication
- **Signup Screen**: Complete profile creation with all fitness details

### Main App
- **Home**: Dashboard with wellness score and recent activities
- **My Plan**: Personalized 7-day meal and workout plans
- **Activity**: Meal analyzer and recipe generator
- **Insights**: Progress tracking and health statistics
- **Profile**: User settings, language selection, and profile management

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/update-profile` - Update user profile
- `GET /auth/me` - Get current user info
- `POST /auth/upload-profile-picture` - Upload profile picture

### Meal Planning
- `POST /plan/generate` - Generate personalized meal plan
- `POST /plan/generate-recipe` - Generate recipe from ingredients

### Activity Tracking
- `POST /activity/meal-analysis` - Analyze meal from image
- `GET /activity/meal-insights` - Get meal analysis history
- `POST /activity/log` - Log fitness activity
- `GET /activity/logs` - Get activity history

### AI Features
- `POST /chat/message` - Chat with AI assistant

## 🌍 Localization

The app supports both English and Arabic languages with full RTL (Right-to-Left) support for Arabic. Users can switch languages in their profile settings.

### Adding New Languages
1. Add translations to `mobile/utils/translations.ts`
2. Use the `t()` function from LanguageContext in components
3. Test RTL layout behavior

## 🛠️ Development

### Backend Development
```bash
# Run backend locally (outside Docker)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Mobile Development
```bash
# Start Expo development server
cd mobile
npx expo start

# Start with reset cache
npx expo start -c
```

### Testing
```bash
# Backend tests (if available)
cd backend
python -m pytest

# Mobile linting
cd mobile
npm run lint
```

## 📦 Dependencies

### Backend
- FastAPI - Web framework
- SQLAlchemy - ORM
- PostgreSQL - Database
- MinIO - Object storage
- Pydantic - Data validation
- JWT - Authentication
- Google Gemini API - AI services
- OpenAI API - Additional AI services

### Mobile
- React Native - Mobile framework
- Expo - Development platform
- Axios - HTTP client
- React Navigation - Navigation
- React Native Chart Kit - Data visualization
- Expo Image Picker - Image selection
- Expo SecureStore - Secure data storage

## 🌐 Network Configuration

### Development IPs
- **Backend API**: `http://192.168.1.122:8000`
- **MinIO Storage**: `http://192.168.1.122:9000`
- **PostgreSQL**: `localhost:5432` (within Docker network)

### Docker Services
- **API Service**: Port 8000
- **Database**: Port 5432
- **MinIO**: Ports 9000 (API) and 9090 (Console)

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- API keys stored in environment variables
- CORS configured for secure cross-origin requests
- Secure storage for sensitive user data on device

## 📈 Future Enhancements

- Integration with fitness trackers (Fitbit, Apple Health)
- Social features for community support
- Advanced workout plan generation
- Nutritional deficiency tracking
- Integration with grocery delivery services
- Voice commands for hands-free interaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- OpenAI for additional AI services
- MinIO for object storage
- Expo for mobile development tools
- All open-source libraries and frameworks used

## 🆘 Support

For issues and feature requests, please create an issue on GitHub.