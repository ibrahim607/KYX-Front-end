# KYX - Football Field Booking App

A production-ready React Native mobile application for booking football fields, built with Expo, React Navigation, and Zustand.

## 🚀 Features

- **Beautiful Onboarding**: Animated onboarding flow with smooth transitions
- **Authentication**: Complete auth flow with login, register, and password reset
- **Field Booking**: Browse and book football fields with real-time availability
- **User Profile**: Manage user profile and view booking history
- **Production Ready**: Configured for easy backend integration

## 📁 Project Structure

```
/src
├── api/                 # API services and Axios client
│   ├── client.js       # Configured Axios instance with interceptors
│   ├── endpoints.js    # API endpoint constants
│   ├── authService.js  # Authentication APIs
│   ├── bookingService.js
│   ├── courtService.js
│   └── ...
├── assets/             # Images, fonts, icons, and theme
├── config/             # Environment configuration
├── features/           # Feature-based modules
│   ├── auth/
│   ├── booking/
│   ├── home/
│   ├── onboarding/
│   └── profile/
├── navigation/         # Navigation stacks
├── shared/             # Shared components, hooks, and utilities
└── store/              # Zustand state management
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KYX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (Optional for development)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## 🔧 Backend Integration

### Quick Setup

1. **Update API URL in `app.json`**:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "https://your-api-url.com"
       }
     }
   }
   ```

2. **Verify endpoints** in `src/api/endpoints.js` match your backend

3. **Test the connection** by attempting to login

### Detailed Documentation

For comprehensive backend integration instructions, see:
- **[Backend Integration Guide](./docs/BACKEND_INTEGRATION.md)** - Complete API documentation, authentication flow, and request/response formats
- **[API Services Guide](./docs/API_SERVICES_GUIDE.md)** - Quick reference for all API services
- **[Production Checklist](./docs/PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist and deployment guide

## 📚 Documentation

- **[Backend Integration Guide](./docs/BACKEND_INTEGRATION.md)** - How to connect to your backend API
- **[API Services Guide](./docs/API_SERVICES_GUIDE.md)** - API service usage and patterns
- **[Production Checklist](./docs/PRODUCTION_CHECKLIST.md)** - Deployment preparation
- **[Navigation Guide](./src/navigation/NAVIGATION_GUIDE.md)** - Navigation structure and usage

## 🏗️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Native Reanimated** - Animations
- **Expo Secure Store** - Secure token storage

## 🔐 Authentication

The app implements a secure authentication system with:
- **Access tokens** stored in-memory (Zustand)
- **Refresh tokens** stored in Expo Secure Store
- **Automatic token refresh** on 401 errors
- **Session restoration** on app restart

## 🎨 UI/UX Features

- Smooth animations with React Native Reanimated
- Custom alert modals
- Responsive design for all screen sizes
- Dark mode support (theme ready)
- Safe area handling for iOS notch

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📱 Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

See [Production Checklist](./docs/PRODUCTION_CHECKLIST.md) for complete deployment instructions.

## ⚡ Performance Optimizations

The project uses several performance optimizations:

1. **Hermes** - JavaScript engine for faster startup
2. **React Native Reanimated** - UI thread animations
3. **Expo Image** - Optimized image loading and caching
4. **Code splitting** - Feature-based architecture

### Recommended Additional Libraries

- **@shopify/flash-list** - Faster list rendering
  ```bash
  npx expo install @shopify/flash-list
  ```

- **react-native-mmkv** - Faster storage (alternative to AsyncStorage)
  ```bash
  npx expo install react-native-mmkv
  ```

## 🔄 Environment Configuration

The app supports multiple environments (development, staging, production):

```json
// app.json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://api.yourdomain.com",
      "environment": "production"
    }
  }
}
```

## 🐛 Debugging

- Use React Native Debugger for network inspection
- Enable network logging in development
- Check console logs for API errors

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]

## 📞 Support

For issues or questions, please refer to the documentation or create an issue.

---

**Last Updated**: February 6, 2026

