# Production Deployment Checklist

This checklist ensures your KYX app is production-ready before deployment.

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] **Update API URL in `app.json`**
  ```json
  {
    "expo": {
      "extra": {
        "apiBaseUrl": "https://api.yourdomain.com",
        "apiTimeout": 10000
      }
    }
  }
  ```

- [ ] **Verify all endpoints** in `src/api/endpoints.js` match your backend
- [ ] **Test API connectivity** with production backend
- [ ] **Remove all mock data** or ensure it's not used in production

### 2. Authentication & Security

- [ ] **Verify token storage** is using expo-secure-store for refresh tokens
- [ ] **Test token refresh flow** with production backend
- [ ] **Verify session restoration** works correctly
- [ ] **Test logout** clears all stored data
- [ ] **Ensure sensitive data** is not logged in production

### 3. API Services

- [ ] **Remove console.log statements** from production code
- [ ] **Verify error handling** for all API calls
- [ ] **Test network error scenarios** (no internet, timeout, etc.)
- [ ] **Verify all API endpoints** are working
- [ ] **Test rate limiting** if implemented

### 4. App Configuration

- [ ] **Update app.json** with production values:
  - App name
  - Bundle identifier (iOS)
  - Package name (Android)
  - Version number
  - Build number
  - App icon
  - Splash screen

- [ ] **Configure app permissions** in app.json:
  ```json
  {
    "expo": {
      "android": {
        "permissions": [
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION"
        ]
      },
      "ios": {
        "infoPlist": {
          "NSLocationWhenInUseUsageDescription": "We need your location to find nearby fields"
        }
      }
    }
  }
  ```

### 5. Performance Optimization

- [ ] **Optimize images** (compress, use appropriate formats)
- [ ] **Enable Hermes** (JavaScript engine) in app.json:
  ```json
  {
    "expo": {
      "jsEngine": "hermes"
    }
  }
  ```
- [ ] **Test app performance** on low-end devices
- [ ] **Monitor memory usage**
- [ ] **Test with slow network** conditions

### 6. Testing

- [ ] **Test on iOS devices** (if deploying to iOS)
- [ ] **Test on Android devices** (if deploying to Android)
- [ ] **Test on different screen sizes**
- [ ] **Test all user flows**:
  - Onboarding → Login → Home → Booking → Profile
  - Registration flow
  - Password reset flow
  - Booking creation and cancellation
- [ ] **Test error scenarios**:
  - Invalid credentials
  - Network errors
  - Server errors
  - Validation errors

### 7. Analytics & Monitoring (Optional)

- [ ] **Set up crash reporting** (e.g., Sentry)
- [ ] **Set up analytics** (e.g., Google Analytics, Mixpanel)
- [ ] **Configure error logging**

### 8. Legal & Compliance

- [ ] **Add privacy policy** link
- [ ] **Add terms of service** link
- [ ] **Ensure GDPR compliance** (if applicable)
- [ ] **Add data deletion** functionality

---

## Build & Deployment

### For Expo Go (Development/Testing)

```bash
# Start the development server
npm start
```

### For Production Build

#### Option 1: EAS Build (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure EAS**:
   ```bash
   eas build:configure
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**:
   ```bash
   eas build --platform android
   ```

6. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

7. **Submit to Google Play**:
   ```bash
   eas submit --platform android
   ```

#### Option 2: Local Build

1. **Prebuild native projects**:
   ```bash
   npx expo prebuild
   ```

2. **Build for Android**:
   ```bash
   npm run android -- --variant=release
   ```

3. **Build for iOS**:
   ```bash
   npm run ios -- --configuration Release
   ```

---

## Post-Deployment

### 1. Monitoring

- [ ] **Monitor crash reports**
- [ ] **Monitor API errors**
- [ ] **Monitor user feedback**
- [ ] **Track key metrics** (DAU, retention, etc.)

### 2. Updates

- [ ] **Set up OTA updates** with Expo Updates:
  ```bash
  eas update --branch production
  ```

### 3. Support

- [ ] **Set up support channel** (email, in-app chat, etc.)
- [ ] **Create FAQ** document
- [ ] **Monitor app store reviews**

---

## Environment-Specific Configurations

### Development
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:3000",
      "environment": "development"
    }
  }
}
```

### Staging
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://staging-api.yourdomain.com",
      "environment": "staging"
    }
  }
}
```

### Production
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://api.yourdomain.com",
      "environment": "production"
    }
  }
}
```

---

## Common Issues & Solutions

### Issue: API requests failing in production

**Solution**: 
- Verify API URL is correct
- Check CORS configuration on backend
- Ensure SSL certificate is valid
- Check network permissions in app.json

### Issue: Token refresh not working

**Solution**:
- Verify refresh token endpoint is correct
- Check token expiration times
- Ensure refresh token is stored in SecureStore
- Test with production backend

### Issue: App crashes on startup

**Solution**:
- Check crash reports
- Verify all required dependencies are installed
- Test on clean device/emulator
- Check for missing environment variables

---

## Security Best Practices

1. **Never commit sensitive data** to version control
2. **Use environment variables** for API keys and secrets
3. **Implement certificate pinning** for API requests (advanced)
4. **Validate all user inputs** on backend
5. **Use HTTPS** for all API requests
6. **Implement proper session management**
7. **Regular security audits**

---

## Version Management

### Semantic Versioning

Follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Update app.json for each release:
```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Guidelines](https://play.google.com/about/developer-content-policy/)

---

**Last Updated**: February 6, 2026
