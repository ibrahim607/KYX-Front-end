# Authentication Implementation Guide

## 📋 Overview
Complete authentication system with Login and Register screens using React Hook Form, Zustand state management, and Axios for API calls.

## ✅ What's Been Set Up

### 1. **Dependencies Installed**
- ✅ `react-hook-form` - Form validation and management
- ✅ `axios` - HTTP client (already installed)
- ✅ `zustand` - State management (already installed)
- ✅ `@react-navigation/native` - Navigation (already installed)

### 2. **Files Created**

#### **API Layer**
- `src/api/authService.js` - Authentication API service with login/register methods
- `src/api/client.js` - Axios client with interceptors (already existed)
- `src/api/endpoints.js` - API endpoint constants (already existed)

#### **Components**
- `src/features/auth/components/FormInput.js` - Reusable form input with validation

#### **Screens**
- `src/features/auth/screens/LoginScreen.js` - Complete login screen
- `src/features/auth/screens/RegisterScreen.js` - Complete registration screen

#### **Utilities**
- `src/features/auth/utils/validationRules.js` - Form validation rules

## 🔧 Configuration Required

### **Step 1: Update API Base URL**

Open `src/api/client.js` and update line 5:

```javascript
const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL
```

### **Step 2: Verify API Response Format**

The auth service expects the following response format from your backend:

#### **Login Response** (`POST /auth/login`)
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Register Response** (`POST /auth/register`)
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Step 3: Customize Response Handling (if needed)**

If your API returns a different format, update `src/api/authService.js`:

```javascript
// Example: If your API wraps data in a 'data' property
login: async (credentials) => {
    const response = await client.post(ENDPOINTS.LOGIN, credentials);
    return response.data.data; // Adjust based on your API
},
```

## 📝 Form Fields

### **Login Screen**
- Email (validated)
- Password (minimum 8 characters)

### **Register Screen**
- First Name (minimum 2 characters)
- Last Name (minimum 2 characters)
- Email (validated)
- Phone Number (10-15 digits)
- Password (minimum 8 characters)
- Confirm Password (must match)

## 🎨 Features Implemented

### **Form Validation**
- ✅ Real-time validation with error messages
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Password confirmation matching
- ✅ Phone number format validation

### **User Experience**
- ✅ Loading states with spinner
- ✅ Keyboard-aware scrolling
- ✅ Error handling with alerts
- ✅ Disabled submit during loading
- ✅ Navigation between Login/Register

### **State Management**
- ✅ Zustand store integration
- ✅ AsyncStorage persistence
- ✅ Automatic navigation after auth
- ✅ Token management with refresh

### **Security**
- ✅ Secure password input
- ✅ Token storage in AsyncStorage
- ✅ Automatic token refresh on 401
- ✅ Request/response interceptors

## 🔐 How Authentication Flow Works

1. **User submits form** → Form validation runs
2. **If valid** → API call to backend
3. **On success** → Store tokens and user data in:
   - Zustand store (in-memory)
   - AsyncStorage (persistent)
4. **RootNavigator** → Automatically switches to AppStack
5. **Subsequent requests** → Include Bearer token automatically

## 🛠️ Customization Options

### **Change Validation Rules**
Edit `src/features/auth/utils/validationRules.js`:

```javascript
export const validationRules = {
    password: {
        required: 'Password is required',
        minLength: {
            value: 12, // Change minimum length
            message: 'Password must be at least 12 characters',
        },
    },
};
```

### **Add More Fields**
1. Add field to `validationRules.js`
2. Add `FormInput` to screen
3. Include in API call payload

### **Customize Styling**
All styles are in the `StyleSheet.create()` section of each screen. Colors use the theme from `src/assets/theme/colors.js`.

## 🧪 Testing

### **Test with Mock Data**
You can test the forms before connecting to your API by temporarily modifying `authService.js`:

```javascript
login: async (credentials) => {
    // Mock response for testing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                user: { id: '1', email: credentials.email, firstName: 'Test' },
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            });
        }, 1000);
    });
},
```

## 📱 Navigation Flow

```
OnboardingScreen (page 4)
  ├─ "Sign Up" button → RegisterScreen
  └─ "Sign In" button → LoginScreen
      └─ "Sign Up" link → RegisterScreen
          └─ "Sign In" link → LoginScreen
```

After successful auth → Automatically navigates to AppStack

## ⚠️ Important Notes

1. **API URL**: Must be updated in `src/api/client.js`
2. **Response Format**: Verify your backend matches expected format
3. **Error Handling**: Customize error messages in `authService.js`
4. **Token Refresh**: Already configured in `client.js` interceptors
5. **Logout**: Handled by `useAuthStore.clearAuth()`

## 🚀 Next Steps

1. Update `API_BASE_URL` in `src/api/client.js`
2. Test with your backend API
3. Customize validation rules if needed
4. Add forgot password functionality (optional)
5. Add social login handlers (optional)

## 📞 Need Help?

If your API has a different structure or you need to customize the flow, the main files to modify are:
- `src/api/authService.js` - API calls
- `src/features/auth/screens/LoginScreen.js` - Login UI
- `src/features/auth/screens/RegisterScreen.js` - Register UI
- `src/features/auth/utils/validationRules.js` - Validation
