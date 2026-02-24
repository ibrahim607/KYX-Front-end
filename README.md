# KYX — Football Field Booking App ⚽

KYX is a mobile application that makes booking football fields fast, simple, and hassle-free. Users can browse available pitches, check real-time slot availability, book a field, and manage their profile — all from their phone.

Built with **React Native** and **Expo**, the app is production-architecture-ready, scalable, and designed with clean separation of concerns throughout the entire codebase.

---

## ⚠️ Current Status — Demo / Pre-Production

This app is **not yet in production**. It is currently running on **mock data**, meaning all screens, bookings, and user flows are simulated locally without a live backend.

This is intentional — the full backend integration logic is already built into the codebase (API services, authentication flow, token management, interceptors, etc.). Connecting to a real backend is simply a matter of pointing the app to the correct API URL once the backend is ready and deployed.

> 💡 **Want to see the onboarding animation?** Just **sign out** from the Profile screen and you'll be taken back through the full animated onboarding experience.

---

## 📲 Install on Android

You can download and install the latest Android build directly — no app store needed:

👉 **[Download APK for Android](https://expo.dev/accounts/ibrahimyasin/projects/KYX/builds/34811258-41bd-430a-a93c-80006b0288a5)**

> Open the link on your Android device, download the APK, and install it. You may need to allow installation from unknown sources in your phone's settings.

---

## ✨ Features

- **Animated Onboarding** — A smooth, physics-based animated intro experience for first-time users
- **Authentication** — Full auth flow including login, registration, and password reset with secure token management
- **Field Browsing** — Explore available football pitches with details like location and amenities
- **Slot Booking** — View real-time availability and book time slots easily
- **Booking Management** — Track and manage upcoming and past bookings
- **User Profile** — View and edit profile information
- **Secure Token Handling** — Access tokens in memory only; refresh tokens in encrypted device storage

---

## 🏗️ Architecture & Design Patterns

This project was built with scalability and maintainability in mind. Below is a breakdown of every major architectural decision made.

### 1. Feature-Based Architecture (Vertical Slicing)

The codebase is organized by **feature**, not by file type. Each feature (`auth`, `booking`, `home`, `onboarding`, `profile`) is self-contained with its own:

```
features/
└── booking/
    ├── components/     ← UI components specific to this feature
    ├── screens/        ← Screen-level components
    ├── store/          ← Local feature state (if needed)
    └── constants/      ← Feature-specific constants
```

This keeps each feature independent and avoids the common problem of deeply nested, cross-cutting imports. It also makes it easy to add, remove, or modify a feature without affecting the rest of the app.

---

### 2. Global State Management — Zustand

The app uses **Zustand** for global state management. Zustand was chosen over Redux for its simplicity, minimal boilerplate, and excellent performance in React Native contexts.

Each domain has its own dedicated store:

| Store | Responsibility |
|-------|---------------|
| `useAuthStore` | Authentication state, login/logout, session restoration |
| `useBookingStore` | Booking creation, history, upcoming bookings |
| `useFieldStore` | Football field data and search results |
| `useLocationStore` | User's current location and selected area |
| `useNotificationStore` | In-app notification state |
| `useAppStore` | Global app-level state (loading, errors) |

All stores are exported from a single `store/index.js` barrel file, keeping imports clean and consistent across the app.

---

### 3. Secure Authentication System

The authentication system follows **industry-standard token security practices**:

- **Access Token** — Stored **exclusively in-memory** (Zustand state). It is never written to disk, so it cannot be extracted from device storage. It lives only for the duration of the app session.
- **Refresh Token** — Stored in **Expo Secure Store**, which uses the device's native encrypted keychain (Keychain on iOS, Keystore on Android).
- **User Data** — Stored in `AsyncStorage` for lightweight, persistent, non-sensitive data.

This pattern ensures that even if an attacker gains access to the device storage, they cannot extract the access token.

**Token Manager (`src/api/tokenManager.js`)** — A dedicated utility that abstracts all secure storage operations behind clean, async methods: `setTokens`, `getRefreshToken`, `clearTokens`, `getAllAuthData`.

---

### 4. Axios HTTP Client with Interceptors

The entire API layer is built on a **single configured Axios instance** (`src/api/client.js`) with two interceptors:

**Request Interceptor:**
- Automatically attaches the Bearer access token to every outgoing request header
- Reads the token directly from the Zustand store (no prop drilling or context needed)

**Response Interceptor (Token Refresh + Request Queue):**
This is the most sophisticated part of the API layer. It handles the case where an access token expires mid-session:

1. If a **401 Unauthorized** response is received, the interceptor catches it before it reaches the screen
2. It pauses all other concurrent API requests and adds them to a **queue**
3. It uses the refresh token to silently request a new access token from the backend
4. Once a new token is obtained, it **retries all queued requests** with the new token automatically
5. If the refresh fails (e.g. refresh token expired), it clears all auth state and redirects to the login screen

This means the user is **never interrupted** by an expired token mid-session — it all happens silently in the background.

---

### 5. Navigation Architecture — React Navigation

Navigation is split into three distinct stacks managed by a **RootNavigator**:

```
RootNavigator
├── AuthStack        ← Shown when user is NOT authenticated
│   ├── OnboardingScreen
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
└── AppStack         ← Shown when user IS authenticated
    └── BottomTabNavigator
        ├── HomeScreen
        ├── BookingScreen
        ├── SavedScreen
        └── ProfileScreen
```

The `RootNavigator` reads `isAuthenticated` from the auth store and conditionally renders the correct stack. On app startup, it calls `restoreSession()` to check for a saved refresh token and restore the user's session without requiring them to log in again.

---

### 6. Environment Configuration

The app uses a centralized **environment configuration system** (`src/config/environment.js`) that:

- Reads API URLs and settings from `app.json` via Expo Constants
- Automatically detects the current environment (`development` / `production`) using React Native's `__DEV__` global
- Exposes **feature flags** (e.g. `socialLogin`, `pushNotifications`) to easily enable or disable features across the app without touching screen code
- Provides helper functions: `isProduction()`, `isDevelopment()`, `isStaging()`

Switching from mock data to a live backend requires only **one change** in `app.json`:
```json
"extra": {
  "apiBaseUrl": "https://your-real-api.com"
}
```

---

### 7. Centralized API Service Layer

All API calls are organized into **service files** by domain, each responsible for a specific resource:

| Service | Responsibility |
|---------|---------------|
| `authService.js` | Login, register, logout, update profile |
| `bookingService.js` | Create, fetch, and cancel bookings |
| `courtService.js` | Fetch court details and availability |
| `searchService.js` | Search and filter football fields |
| `locationService.js` | Fetch location data |

Each service uses the single shared Axios `client`, so all authentication headers and interceptor logic apply automatically to every API call across the app.

---

### 8. Reusable Shared Component Library

A set of **shared UI components** was built to ensure visual consistency across the app:

| Component | Purpose |
|-----------|---------|
| `CustomButton` | Standardized button with loading states and variants |
| `CustomInput` | Form input with built-in error display and validation styling |
| `CustomAlert` | Branded modal alert replacing the native OS alert dialog |
| `ScreenHeader` | Consistent top navigation bar with back button and title |
| `LoadingSpinner` | Unified loading indicator |
| `PaymentSuccessModal` | Post-booking success confirmation modal |

---

### 9. Form Handling — React Hook Form

All forms (login, register, edit profile, etc.) use **React Hook Form** for:
- Controlled, validated inputs with minimal re-renders
- Built-in error state management
- Easy integration with the `CustomInput` component via `Controller`

---

### 10. Animations — React Native Reanimated

The onboarding screen features a custom multi-step animation built with **React Native Reanimated v3**, running entirely on the **UI thread** (not the JS thread). This ensures 60fps animations regardless of JavaScript workload. The animation logic is extracted into a dedicated custom hook (`useOnboardingAnimations`) to keep screen components clean.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | Latest | Core mobile framework |
| Expo | SDK 52 | Development platform, native modules, and build tooling |
| React Navigation v6 | — | Stack and tab navigation |
| Zustand | — | Lightweight global state management |
| Axios | — | HTTP client with interceptor support |
| React Hook Form | — | Performant form handling and validation |
| React Native Reanimated v3 | — | UI-thread animations |
| Expo Secure Store | — | Encrypted native keychain storage for refresh tokens |
| AsyncStorage | — | Lightweight persistent storage for user data |
| Expo Constants | — | Access to app config and environment variables |

---

## 📁 Full Project Structure

```
/src
├── api/
│   ├── client.js           ← Axios instance with request/response interceptors
│   ├── endpoints.js        ← Centralized API endpoint constants
│   ├── tokenManager.js     ← Secure token storage and retrieval
│   ├── authService.js      ← Auth API calls (login, register, profile)
│   ├── bookingService.js   ← Booking API calls
│   ├── courtService.js     ← Court/field API calls
│   ├── searchService.js    ← Search API calls
│   ├── locationService.js  ← Location API calls
│   └── __tests__/          ← Unit tests for all services
│
├── config/
│   └── environment.js      ← Env detection, feature flags, API config
│
├── features/
│   ├── auth/               ← Login, Register, Forgot Password screens & components
│   ├── booking/            ← Booking flow screens, components, and store
│   ├── home/               ← Home screen and field browsing
│   ├── onboarding/         ← Animated onboarding with custom hooks
│   ├── profile/            ← User profile and edit profile
│   └── saved/              ← Saved/favourited fields
│
├── navigation/
│   ├── RootNavigator.js    ← Auth-aware root router
│   ├── AuthStack.js        ← Unauthenticated navigation stack
│   ├── AppStack.js         ← Authenticated navigation stack
│   └── BottomTabNavigator.js ← Main tab bar
│
├── shared/
│   ├── components/         ← Reusable UI components (Button, Input, Alert, etc.)
│   ├── hooks/              ← Shared custom hooks
│   └── utils/              ← Utility/helper functions
│
└── store/
    ├── index.js            ← Barrel export for all stores
    ├── useAuthStore.js     ← Auth state and session management
    ├── useBookingStore.js  ← Booking state
    ├── useFieldStore.js    ← Field/pitch data state
    ├── useLocationStore.js ← Location state
    └── useNotificationStore.js ← Notification state
```

---

## 🚀 Running Locally (For Developers)

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

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open on your device**
   - Scan the QR code with the **Expo Go** app (Android/iOS)
   - Press `a` to open on an Android emulator
   - Press `i` to open on an iOS simulator (Mac only)

---

## 🔧 Backend Integration

To switch from mock data to a real backend, update `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-url.com"
    }
  }
}
```

All API endpoint paths are defined in `src/api/endpoints.js`. Verify they match your backend routes and the app is live.

---

## 📄 License

KYX — all rights reserved.

---

*Last Updated: February 25, 2026*
