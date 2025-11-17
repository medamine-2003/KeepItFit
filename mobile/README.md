# Mobile App Documentation

## Overview

The keepItFit mobile application is built with React Native and Expo, providing a cross-platform fitness companion with AI-powered features. The app follows a modern, user-friendly design with comprehensive health tracking capabilities.

## Project Structure

```
mobile/
├── app/                    # App screens and routing
│   ├── (authenticated)/    # Protected screens (requires login)
│   │   ├── _layout.tsx     # Authenticated layout with tabs
│   │   ├── activity.tsx    # Activity tracking features
│   │   ├── home.tsx        # Home dashboard
│   │   ├── insights.tsx    # Progress insights and charts
│   │   ├── plan.tsx        # Meal and workout plans
│   │   └── profile.tsx     # User profile management
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Entry point
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Signup screen
│   └── welcome.tsx         # Welcome screen
├── components/             # Reusable UI components
├── utils/                  # Utility functions and helpers
├── assets/                 # Images and static assets
└── constants/              # Application constants
```

## Key Components

### Authentication Flow

The app implements a complete authentication system with:
- Welcome screen introducing the app
- Login screen for existing users
- Signup screen with comprehensive profile collection
- Secure token storage using Expo SecureStore
- Automatic token refresh and validation

### Navigation

The app uses Expo Router with tab-based navigation for authenticated users:
- Home tab: Dashboard with wellness score
- Plan tab: Personalized meal and workout plans
- Activity tab: Meal analyzer and recipe generator
- Insights tab: Progress tracking with charts
- Profile tab: User settings and management

### State Management

The app uses React Context for:
- Authentication state (`AuthContext`)
- Language preferences (`LanguageContext`)
- Global UI components (alerts, loading states)

### UI Components

#### Custom Components
- `ThemedText`: Consistent text styling
- `ThemedView`: Consistent view styling
- `CustomAlert`: Customizable alert dialogs
- `ChatAssistant`: AI chat interface

#### Third-Party Components
- `react-native-chart-kit`: Data visualization
- `expo-image-picker`: Image selection
- `@expo/vector-icons`: Icon library
- `react-native-calendars`: Calendar components

## Features Implementation

### Language Support

The app supports both English and Arabic with:
- Full translation system using `LanguageContext`
- RTL (Right-to-Left) layout support for Arabic
- Language persistence using Expo SecureStore
- Easy language switching in profile settings

### Profile Management

Users can:
- View and edit personal information
- Upload profile pictures
- Switch languages
- Sign out securely

### Meal Planning

The app provides:
- AI-generated 7-day meal plans
- Mediterranean/Tunisian cuisine focus
- Meal names only (no recipes) for simplicity
- Personalization based on user profile

### Activity Tracking

Features include:
- Meal image analysis using Gemini AI
- Recipe generation from available ingredients
- Activity logging and tracking
- Historical insights with charts

### AI Integration

The app integrates with multiple AI services:
- Google Gemini for chat, meal analysis, and recipe generation
- OpenAI for additional AI features
- Error handling with fallback models

## Styling and Theming

The app uses a consistent design system with:
- Custom color palette (`#38b386` - primary green, `#0d265c` - dark blue)
- Responsive layouts for different screen sizes
- Consistent spacing and typography
- Platform-specific adaptations

## API Integration

The app communicates with the backend API through:
- Axios for HTTP requests
- Custom API client with error handling
- Authentication interceptors
- Request/response logging in development

### Base URL Configuration

The API base URL is configured in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://192.168.1.122:8000"
    }
  }
}
```

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android/iOS emulator or physical device

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npx expo start
```

### Development Scripts
- `npm start`: Start development server
- `npm run android`: Run on Android
- `npm run ios`: Run on iOS
- `npm run web`: Run on web
- `npm run lint`: Run ESLint

## Environment Configuration

The app uses environment variables through Expo's `extra` configuration in `app.json`. For development, update the `apiBaseUrl` to match your backend IP address.

## Testing

### Unit Testing
The app uses Jest for unit testing:
```bash
npm test
```

### Component Testing
Components can be tested using React Native Testing Library:
```bash
npm run test:components
```

### End-to-End Testing
E2E tests can be implemented with Detox:
```bash
npm run test:e2e
```

## Building for Production

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

### Web
```bash
npx expo build:web
```

## Deployment

### App Store Deployment
1. Create builds using Expo's build service
2. Submit to respective app stores
3. Configure app store listings

### OTA Updates
The app supports Over-The-Air updates through Expo:
```bash
npx expo publish
```

## Performance Optimization

### Image Optimization
- Use `expo-image` for efficient image loading
- Implement lazy loading for lists
- Compress images before upload

### Network Optimization
- Implement request caching
- Use pagination for large datasets
- Optimize API response sizes

### Memory Management
- Clean up subscriptions and timers
- Use `React.memo` for component optimization
- Implement virtualized lists for large datasets

## Error Handling

The app implements comprehensive error handling:
- Network error detection and user feedback
- API error parsing and display
- Graceful degradation for offline scenarios
- Logging in development mode

## Security

### Data Protection
- Secure storage for authentication tokens
- Encryption for sensitive user data
- Proper handling of personal information

### Network Security
- HTTPS communication with backend
- Certificate pinning for critical requests
- Input validation and sanitization

## Accessibility

The app follows accessibility best practices:
- Proper contrast ratios
- Screen reader support
- Keyboard navigation
- Dynamic text sizing

## Internationalization

### Adding New Languages
1. Add translations to `utils/translations.ts`
2. Update the `LanguageContext` if needed
3. Test RTL layout behavior
4. Verify all text is properly translated

### RTL Support
- Automatic layout mirroring for RTL languages
- Proper text alignment
- Icon positioning adjustments

## Troubleshooting

### Common Issues

#### Network Errors
- Verify backend is running
- Check IP address configuration
- Ensure device and backend are on same network

#### Image Upload Issues
- Check MinIO configuration
- Verify network connectivity
- Confirm file size limits

#### Authentication Problems
- Clear app data and cache
- Verify JWT secret configuration
- Check token expiration settings

### Debugging
- Use React DevTools for component inspection
- Enable remote debugging in Expo
- Check console logs for errors
- Use Expo's debugging tools

## Contributing

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Maintain consistent component structure
- Write clear, descriptive commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Write tests if applicable
5. Submit pull request with description

## Dependencies

### Core Dependencies
- React Native and Expo
- Axios for HTTP requests
- React Navigation for routing
- Charting libraries for data visualization

### Development Dependencies
- TypeScript for type safety
- ESLint for code linting
- Jest for testing
- Expo CLI for development tools

## Future Enhancements

### Planned Features
- Integration with health tracking platforms
- Social features for community support
- Advanced workout plan generation
- Nutritional deficiency tracking
- Voice command support

### Performance Improvements
- Code splitting for faster initial load
- Image caching optimization
- Database query optimization
- Memory usage reduction

## Support

For issues and feature requests, please create an issue on GitHub with:
- Device information
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable