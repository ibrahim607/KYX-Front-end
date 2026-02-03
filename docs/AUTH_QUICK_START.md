# Auth Screens Quick Reference

## 🎯 What You Need to Do

### **ONLY 1 THING TO CONFIGURE:**

Open `src/api/client.js` and change line 5:

```javascript
const API_BASE_URL = 'https://your-actual-api-url.com';
```

That's it! Everything else is ready to go.

---

## 📦 What's Included

### **Login Screen** (`src/features/auth/screens/LoginScreen.js`)
```
┌─────────────────────────────┐
│   Welcome Back              │
│   Sign in to continue       │
│                             │
│   Email                     │
│   [________________]        │
│                             │
│   Password                  │
│   [________________]        │
│                             │
│        Forgot Password?     │
│                             │
│   [    Sign In    ]         │
│                             │
│   Don't have an account?    │
│   Sign Up                   │
└─────────────────────────────┘
```

**API Call:**
```javascript
POST /auth/login
Body: { email, password }
```

---

### **Register Screen** (`src/features/auth/screens/RegisterScreen.js`)
```
┌─────────────────────────────┐
│   Create Account            │
│   Sign up to get started    │
│                             │
│   First Name   Last Name    │
│   [_______]    [_______]    │
│                             │
│   Email                     │
│   [________________]        │
│                             │
│   Phone Number              │
│   [________________]        │
│                             │
│   Password                  │
│   [________________]        │
│                             │
│   Confirm Password          │
│   [________________]        │
│                             │
│   [    Sign Up    ]         │
│                             │
│   Already have an account?  │
│   Sign In                   │
└─────────────────────────────┘
```

**API Call:**
```javascript
POST /auth/register
Body: {
  firstName,
  lastName,
  email,
  phoneNumber,
  password
}
```

---

## 🔄 Expected API Response Format

Both endpoints should return:

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## ✨ Features

✅ **Form Validation**
- Email format check
- Password min 8 characters
- Phone number 10-15 digits
- Password confirmation match
- Real-time error messages

✅ **UX**
- Loading spinner on submit
- Keyboard-aware scrolling
- Error alerts
- Disabled state during loading

✅ **State Management**
- Auto-save to AsyncStorage
- Auto-navigate after login
- Token refresh on 401

---

## 🧪 Test Before API Connection

Add this to `src/api/authService.js` to test:

```javascript
login: async (credentials) => {
    // MOCK - Remove when API is ready
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                user: { 
                    id: '1', 
                    email: credentials.email, 
                    firstName: 'Test',
                    lastName: 'User'
                },
                accessToken: 'mock-token',
                refreshToken: 'mock-refresh',
            });
        }, 1000);
    });
},
```

---

## 📁 File Structure

```
src/
├── api/
│   ├── authService.js       ← API calls (login, register)
│   ├── client.js            ← Axios config (UPDATE URL HERE)
│   └── endpoints.js         ← Endpoint constants
├── features/
│   └── auth/
│       ├── components/
│       │   └── FormInput.js ← Reusable input field
│       ├── screens/
│       │   ├── LoginScreen.js
│       │   └── RegisterScreen.js
│       └── utils/
│           └── validationRules.js
└── store/
    └── useAuthStore.js      ← Auth state management
```

---

## 🚀 Ready to Use!

1. Update API URL in `src/api/client.js`
2. Test the screens (they're already in your navigation)
3. Verify API response format matches
4. Done! 🎉
