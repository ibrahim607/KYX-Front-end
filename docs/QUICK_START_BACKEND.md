# Quick Start: Connecting Your Backend

This guide will help you quickly connect your KYX mobile app to your backend API once it's ready.

## ⚡ 3-Step Quick Setup

### Step 1: Update API URL (2 minutes)

Open `app.json` and update the `apiBaseUrl`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-backend-api.com"
    }
  }
}
```

**For local development:**
- Use `http://YOUR_LOCAL_IP:PORT` (e.g., `http://192.168.1.100:3000`)
- For Android emulator: `http://10.0.2.2:PORT`

### Step 2: Verify Endpoints (5 minutes)

Open `src/api/endpoints.js` and verify these match your backend routes:

```javascript
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',              // ✓ Check this matches your backend
  REGISTER: '/auth/register',        // ✓ Check this matches your backend
  USER_PROFILE: '/users/profile',    // ✓ Check this matches your backend

  // Bookings
  BOOKINGS: '/bookings',
  BOOKINGS_UPCOMING: '/bookings/upcoming',
  BOOKINGS_HISTORY: '/bookings/history',

  // Fields
  FIELDS: '/fields',
  FIELDS_SEARCH: '/fields/search',

  // Courts
  COURTS: '/courts',

  // Locations
  LOCATIONS: '/locations',
};
```

**If your endpoints are different**, simply update them here. For example:
```javascript
LOGIN: '/api/v1/auth/login',  // If your backend uses /api/v1 prefix
```

### Step 3: Test the Connection (3 minutes)

1. **Restart your app**:
   ```bash
   npm start
   # Press 'r' to reload
   ```

2. **Try to login** with test credentials from your backend

3. **Check the network tab** in React Native Debugger to verify requests are going to the correct URL

---

## 🔍 What the App Expects from Your Backend

### Authentication Endpoints

#### POST `/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "gender": "male"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

#### POST `/auth/register`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Expected Response:** Same as login

#### POST `/auth/refresh`
**Request:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Expected Response:**
```json
{
  "accessToken": "new-jwt-access-token",
  "refreshToken": "new-jwt-refresh-token"  // Optional
}
```

### Booking Endpoints

#### GET `/bookings/upcoming`
**Expected Response:**
```json
{
  "bookings": [
    {
      "id": "booking-id",
      "fieldId": "field-id",
      "courtId": "court-id",
      "date": "2026-02-15",
      "startTime": "14:00",
      "endTime": "16:00",
      "status": "confirmed",
      "totalPrice": 100
    }
  ]
}
```

#### POST `/bookings`
**Request:**
```json
{
  "fieldId": "field-id",
  "courtId": "court-id",
  "date": "2026-02-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "duration": 2
}
```

**Expected Response:**
```json
{
  "booking": {
    "id": "booking-id",
    "fieldId": "field-id",
    "courtId": "court-id",
    "userId": "user-id",
    "date": "2026-02-15",
    "startTime": "14:00",
    "endTime": "16:00",
    "duration": 2,
    "status": "confirmed",
    "totalPrice": 100,
    "createdAt": "2026-02-06T13:47:29Z"
  }
}
```

### Field/Court Endpoints

#### GET `/fields`
**Expected Response:**
```json
{
  "fields": [
    {
      "id": "field-id",
      "name": "Downtown Sports Complex",
      "location": "123 Main St, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "rating": 4.5,
      "reviewCount": 120,
      "pricePerHour": 50,
      "imageUrl": "https://example.com/image.jpg",
      "sport": "football"
    }
  ]
}
```

#### GET `/courts?fieldId=field-id`
**Expected Response:**
```json
{
  "courts": [
    {
      "id": "court-id",
      "fieldId": "field-id",
      "name": "Court 1",
      "type": "indoor",
      "surface": "artificial_grass",
      "size": "5v5",
      "pricePerHour": 50
    }
  ]
}
```

---

## 🔧 Common Adjustments

### If Your Response Format is Different

If your backend returns data in a different format, you can adjust the service files.

**Example:** Your backend returns `{ data: { user, token } }` instead of `{ user, accessToken }`

Open `src/api/authService.js` and modify:

```javascript
login: async (credentials) => {
  try {
    const response = await client.post(ENDPOINTS.LOGIN, credentials);
    
    // Transform the response to match what the app expects
    return {
      user: response.data.data.user,
      accessToken: response.data.data.token,
      refreshToken: response.data.data.refreshToken
    };
  } catch (error) {
    throw handleAuthError(error);
  }
},
```

### If You Use Different Field Names

**Example:** Your backend uses `first_name` instead of `firstName`

You can transform the data in the service:

```javascript
login: async (credentials) => {
  try {
    const response = await client.post(ENDPOINTS.LOGIN, credentials);
    
    // Transform snake_case to camelCase
    return {
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        firstName: response.data.user.first_name,
        lastName: response.data.user.last_name,
        phoneNumber: response.data.user.phone_number,
        gender: response.data.user.gender
      },
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token
    };
  } catch (error) {
    throw handleAuthError(error);
  }
},
```

### If You Need to Add Headers

Open `src/api/client.js` and modify the request interceptor:

```javascript
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add custom headers
    config.headers['X-API-Key'] = 'your-api-key';
    config.headers['X-Client-Version'] = '1.0.0';

    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 🧪 Testing Your Integration

### 1. Test Authentication

```bash
# Start the app
npm start
```

1. Go to the onboarding screen
2. Click "Skip" or go through the onboarding
3. Try to register a new user
4. Try to login with the registered user
5. Check if you're redirected to the home screen

### 2. Test API Calls

Open React Native Debugger and check the Network tab:

1. **Verify request URL**: Should be `https://your-backend-api.com/auth/login`
2. **Check request body**: Should contain email and password
3. **Check response**: Should return user and tokens
4. **Check errors**: Try invalid credentials and verify error handling

### 3. Test Token Refresh

1. Login to the app
2. Wait for the access token to expire (or manually expire it in your backend)
3. Make an API call (e.g., fetch bookings)
4. The app should automatically refresh the token and retry the request

---

## ❌ Troubleshooting

### "Network Error" or "Connection Failed"

**Possible causes:**
1. **Wrong API URL**: Double-check the URL in `app.json`
2. **Backend not running**: Ensure your backend is running and accessible
3. **CORS issues**: If testing with web, ensure CORS is configured on backend
4. **Firewall**: Check if firewall is blocking the connection

**Solutions:**
- Test the API URL in Postman first
- For local development, use your local IP address
- Check backend logs for incoming requests

### "401 Unauthorized" on Every Request

**Possible causes:**
1. **Token not being sent**: Check request headers in Network tab
2. **Token format mismatch**: Backend expects different format
3. **Token expired immediately**: Check token expiration time

**Solutions:**
- Verify the `Authorization` header is being sent: `Bearer <token>`
- Check if your backend expects a different header name
- Increase token expiration time in backend

### "Cannot read property 'user' of undefined"

**Possible causes:**
1. **Response format mismatch**: Backend returns different structure
2. **Missing fields**: Backend doesn't return all expected fields

**Solutions:**
- Console.log the response in the service file
- Adjust the service to match your backend's response format
- Add default values for optional fields

---

## 📋 Checklist

Before going to production, ensure:

- [ ] API URL is updated in `app.json`
- [ ] All endpoints match your backend routes
- [ ] Login works correctly
- [ ] Registration works correctly
- [ ] Token refresh works correctly
- [ ] All API calls are successful
- [ ] Error handling works (try invalid credentials, network errors, etc.)
- [ ] Session restoration works (close and reopen app)
- [ ] Logout clears all data

---

## 📚 Need More Help?

- **[Backend Integration Guide](./BACKEND_INTEGRATION.md)** - Comprehensive API documentation
- **[API Services Guide](./API_SERVICES_GUIDE.md)** - Detailed service usage
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist

---

## 🎉 You're Done!

Once you've completed these steps and verified everything works, your app is ready to use with your backend!

For production deployment, see the [Production Checklist](./PRODUCTION_CHECKLIST.md).

---

**Last Updated**: February 6, 2026
