# Modern Authentication Flow - How Big Apps Do It

## 🎯 The Problem

**Bad Approach (Don't Do This):**
```
User logs in → Store token → Token expires after 15 minutes → User has to login again ❌
```

**Good Approach (Industry Standard):**
```
User logs in → Store access token + refresh token → Access token expires → 
Auto-refresh with refresh token → Get new access token → User stays logged in ✅
```

---

## 🔑 Two-Token System

### **Access Token** (Short-lived)
- **Lifespan**: 15 minutes - 1 hour
- **Purpose**: Used for API requests
- **Storage**: Memory or AsyncStorage
- **Security**: Short expiry = less risk if stolen

### **Refresh Token** (Long-lived)
- **Lifespan**: 7-30 days (or longer)
- **Purpose**: Get new access tokens
- **Storage**: Secure storage (AsyncStorage + encryption)
- **Security**: Only used to refresh, not for API calls

---

## 🔄 How It Works

### Initial Login Flow:

```
1. User enters email/password
   ↓
2. POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend returns:
   {
     "accessToken": "eyJhbGc...",  // Expires in 15 min
     "refreshToken": "dGhpcyBp...", // Expires in 30 days
     "user": { id, name, email }
   }
   ↓
5. App stores BOTH tokens in AsyncStorage
   ↓
6. User is logged in!
```

### Making API Requests:

```
1. App makes API call with access token
   ↓
   GET /api/bookings
   Headers: { Authorization: "Bearer eyJhbGc..." }
   ↓
2. Backend validates access token
   ↓
   ┌─────────────┴─────────────┐
   │                           │
   Valid                    Expired (401)
   ↓                           ↓
   Return data          Trigger refresh flow
```

### Auto-Refresh Flow (The Magic):

```
1. API call fails with 401 Unauthorized
   ↓
2. App intercepts the error
   ↓
3. POST /api/auth/refresh
   Headers: { Authorization: "Bearer <refreshToken>" }
   ↓
4. Backend validates refresh token
   ↓
   ┌─────────────┴─────────────┐
   │                           │
   Valid                    Expired
   ↓                           ↓
   Return new tokens      Force logout
   {
     accessToken: "new...",
     refreshToken: "new..." (optional)
   }
   ↓
5. Store new tokens
   ↓
6. Retry original API call
   ↓
7. Success! User never noticed anything
```

---

## 🏗️ Implementation Architecture

### File Structure:
```
src/
├── api/
│   ├── client.js              # Axios instance with interceptors
│   ├── endpoints.js           # API endpoints
│   └── tokenManager.js        # Token storage & refresh logic
├── store/
│   └── useAuthStore.js        # Auth state management
└── navigation/
    └── RootNavigator.js       # Auth initialization
```

---

## 💻 Code Implementation

### 1. Token Manager (`src/api/tokenManager.js`)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

export const tokenManager = {
  // Store tokens
  async setTokens(accessToken, refreshToken) {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  },

  // Get access token
  async getAccessToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  // Get refresh token
  async getRefreshToken() {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Clear all tokens (logout)
  async clearTokens() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },

  // Check if tokens exist
  async hasTokens() {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  },
};
```

### 2. API Client with Auto-Refresh (`src/api/client.js`)

```javascript
import axios from 'axios';
import { tokenManager } from './tokenManager';
import { useAuthStore } from '../store';

const API_BASE_URL = 'https://your-api.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - Add access token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Auto-refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        await tokenManager.setTokens(accessToken, newRefreshToken || refreshToken);

        // Update auth store
        useAuthStore.getState().updateTokens(accessToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        await tokenManager.clearTokens();
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Updated Auth Store (`src/store/useAuthStore.js`)

```javascript
import { create } from 'zustand';
import { tokenManager } from '../api/tokenManager';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  // Login - Store user and tokens
  setAuth: async (user, accessToken, refreshToken) => {
    await tokenManager.setTokens(accessToken, refreshToken);
    set({
      user,
      token: accessToken,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  // Update access token (after refresh)
  updateTokens: (accessToken) => {
    set({ token: accessToken });
  },

  // Logout - Clear everything
  clearAuth: async () => {
    await tokenManager.clearTokens();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // Restore session on app startup
  restoreSession: async () => {
    try {
      const accessToken = await tokenManager.getAccessToken();
      
      if (accessToken) {
        // Optionally validate token with backend
        // const user = await apiClient.get('/auth/me');
        
        set({
          token: accessToken,
          // user: user.data,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      await tokenManager.clearTokens();
      set({ isInitialized: true });
    }
  },

  setInitialized: (val) => set({ isInitialized: val }),
}));

export default useAuthStore;
```

### 4. Updated RootNavigator (`src/navigation/RootNavigator.js`)

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const RootNavigator = () => {
  const { isAuthenticated, isInitialized, restoreSession } = useAuthStore();

  // Restore session on app startup
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Show loading while checking for saved session
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
```

### 5. Login Screen Usage

```javascript
import { useState } from 'react';
import apiClient from '../../../api/client';
import { useAuthStore } from '../../../store';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user - this triggers navigation to AppStack
      await setAuth(user, accessToken, refreshToken);
      
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your login UI
  );
};
```

---

## 🎯 How Big Apps Do It

### Examples:

**Instagram/Facebook:**
- Access token: 1 hour
- Refresh token: 60 days
- Auto-refresh in background
- You stay logged in for 60 days

**Gmail/Google:**
- Access token: 1 hour
- Refresh token: Indefinite (until revoked)
- You stay logged in forever (until you logout)

**Banking Apps:**
- Access token: 15 minutes
- Refresh token: 7 days
- Re-authentication required after 7 days (security)

---

## 🔒 Security Best Practices

### 1. **Token Storage**
```javascript
// ✅ Good - Use AsyncStorage (encrypted on iOS)
await AsyncStorage.setItem('@token', token);

// ❌ Bad - Don't store in plain state
const [token, setToken] = useState(token); // Lost on app close

// 🔥 Best - Use react-native-keychain for sensitive data
import * as Keychain from 'react-native-keychain';
await Keychain.setGenericPassword('token', accessToken);
```

### 2. **Token Expiry**
```javascript
// Backend should return expiry time
{
  "accessToken": "...",
  "expiresIn": 900, // 15 minutes in seconds
  "refreshToken": "..."
}

// Client can proactively refresh before expiry
if (Date.now() >= tokenExpiry - 60000) { // 1 min before
  await refreshTokens();
}
```

### 3. **Logout Everywhere**
```javascript
// Backend should track refresh tokens
// When user logs out, invalidate all refresh tokens
POST /api/auth/logout
{
  "refreshToken": "..."
}

// Backend marks this refresh token as revoked
// User is logged out on all devices
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    APP STARTUP                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
         Check AsyncStorage
                  │
        ┌─────────┴─────────┐
        │                   │
    Has Tokens          No Tokens
        │                   │
        ▼                   ▼
  Restore Session      Show Login
        │
        ▼
  Validate Token (optional)
        │
   ┌────┴────┐
   │         │
 Valid    Invalid
   │         │
   ▼         ▼
Show App  Show Login


┌─────────────────────────────────────────────────────────┐
│                   MAKING API CALLS                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
    Add access token to request
                  │
                  ▼
            Send request
                  │
        ┌─────────┴─────────┐
        │                   │
    Success (200)      Error (401)
        │                   │
        ▼                   ▼
   Return data      Token expired!
                            │
                            ▼
                  Use refresh token
                            │
                  ┌─────────┴─────────┐
                  │                   │
              Success             Failed
                  │                   │
                  ▼                   ▼
         Get new tokens         Force logout
                  │
                  ▼
         Retry original request
                  │
                  ▼
            Return data
```

---

## 🚀 Implementation Checklist

- [ ] Install AsyncStorage: `npx expo install @react-native-async-storage/async-storage`
- [ ] Create `tokenManager.js`
- [ ] Update `client.js` with interceptors
- [ ] Update `useAuthStore.js` with token methods
- [ ] Update `RootNavigator.js` to restore session
- [ ] Update `LoginScreen.js` to store both tokens
- [ ] Test login flow
- [ ] Test token refresh flow
- [ ] Test logout flow

---

## 💡 Key Takeaways

1. **Always use two tokens**: Access (short) + Refresh (long)
2. **Auto-refresh transparently**: User never knows tokens expired
3. **Store tokens securely**: AsyncStorage minimum, Keychain better
4. **Restore session on startup**: Check for tokens before showing login
5. **Handle refresh failures**: Logout user if refresh token expired

This is exactly how Instagram, Gmail, Spotify, and all major apps work! 🎉
