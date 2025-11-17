# keepItFit Mobile App

A cross-platform React Native fitness companion with AI-powered meal planning, nutrition analysis, and personalized workout tracking.

## Features

- 🔐 Secure authentication with JWT
- 🍽️ AI-generated personalized meal plans
- 📸 Meal photo analysis for nutritional insights
- 🏋️ Activity and workout tracking
- 📊 Progress visualization with charts
- 💬 AI health assistant
- 🌍 Multi-language support (English/Arabic with RTL)

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: Expo Router (file-based)
- **State**: React Context
- **API**: Axios
- **AI**: Google Gemini
- **Charts**: react-native-chart-kit

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
npm install
```

### Configuration

Update the API URL in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://YOUR_IP:8000"
    }
  }
}
```

### Run

```bash
npx expo start
```

Then press:
- `i` for iOS
- `a` for Android
- `w` for web

## Project Structure

```
mobile/
├── app/
│   ├── (authenticated)/  # Protected screens with tab navigation
│   │   ├── home.tsx      # Dashboard
│   │   ├── plan.tsx      # Meal/workout plans
│   │   ├── activity.tsx  # Tracking features
│   │   ├── insights.tsx  # Progress charts
│   │   └── profile.tsx   # Settings
│   ├── login.tsx         # Auth screens
│   └── signup.tsx
├── components/           # Reusable UI components
└── utils/               # Helpers and translations
```

## Building

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## Development

```bash
npm run lint          # Run ESLint
npm test             # Run tests
```

## Troubleshooting

**Can't connect to backend?**
- Ensure backend is running
- Use your local IP (not localhost) in `app.json`
- Check that devices are on the same network

**Images not uploading?**
- Verify MinIO configuration in backend
- Check file size limits

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]
