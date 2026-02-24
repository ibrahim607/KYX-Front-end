# KYX — Football Field Booking App ⚽

KYX is a mobile application that makes booking football fields fast, simple, and hassle-free. Users can browse available pitches, check real-time slot availability, book a field, and manage their profile — all from their phone.

Built with **React Native** and **Expo**, the app is designed to be smooth, responsive, and ready for production.

---

## � Install on Android

You can download and install the latest Android build directly — no app store needed:

👉 **[Download APK for Android](https://expo.dev/accounts/ibrahimyasin/projects/KYX/builds/34811258-41bd-430a-a93c-80006b0288a5)**

> Open the link on your Android device, download the APK, and install it. You may need to allow installation from unknown sources in your phone's settings.

---

## ✨ Features

- **Animated Onboarding** — A smooth, animated intro experience for first-time users
- **Authentication** — Full auth flow including login, registration, and password reset
- **Field Browsing** — Explore available football pitches with details like location and amenities
- **Slot Booking** — View real-time availability and book time slots easily
- **Booking Management** — Track and manage upcoming and past bookings
- **User Profile** — View and edit profile information
- **Secure Token Handling** — Access tokens in memory, refresh tokens in secure storage

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile app framework |
| Expo | Development platform & build tools |
| React Navigation | Screen navigation |
| Zustand | Global state management |
| Axios | HTTP client for API calls |
| React Hook Form | Form handling & validation |
| React Native Reanimated | Smooth UI animations |
| Expo Secure Store | Secure refresh token storage |

---

## 📁 Project Structure

```
/src
├── api/                # Axios client, endpoints, and service files
├── assets/             # Images, fonts, icons, and theme
├── config/             # Environment configuration
├── features/           # Feature modules
│   ├── auth/           # Login, Register, Password Reset
│   ├── booking/        # Slot booking flow
│   ├── home/           # Home screen & pitch browsing
│   ├── onboarding/     # Animated onboarding screens
│   └── profile/        # User profile & edit profile
├── navigation/         # Navigation stacks & routing
├── shared/             # Reusable components, hooks, and utilities
└── store/              # Zustand stores (auth, booking, etc.)
```

---

## � Running Locally (For Developers)

### Prerequisites

- Node.js v16+
- npm
- Expo Go app on your phone (for testing on a real device)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KYX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** *(optional)*
   ```bash
   cp .env.example .env
   # Edit .env with your API URL and settings
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open on your device**
   - Scan the QR code with the **Expo Go** app (Android/iOS)
   - Press `a` to open on an Android emulator
   - Press `i` to open on an iOS simulator (Mac only)

---

## 🔧 Backend Integration

To connect to a real backend, update the API URL in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-url.com"
    }
  }
}
```

Then verify your endpoint definitions in `src/api/endpoints.js` match your backend routes.

For detailed integration docs, see:
- [Backend Integration Guide](./docs/BACKEND_INTEGRATION.md)
- [API Services Guide](./docs/API_SERVICES_GUIDE.md)

---

## � License

Private project — all rights reserved.

---

*Last Updated: February 25, 2026*
