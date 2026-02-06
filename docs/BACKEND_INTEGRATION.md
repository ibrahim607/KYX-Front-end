# Backend Integration Guide

This document provides comprehensive instructions for integrating the KYX mobile app with your backend API.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Environment Configuration](#environment-configuration)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Authentication Flow](#authentication-flow)
5. [Request/Response Formats](#requestresponse-formats)
6. [Error Handling](#error-handling)
7. [Testing](#testing)

---

## Quick Start

### Step 1: Configure Your API URL

1. Open `app.json` and add your API configuration:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-url.com",
      "apiTimeout": 10000
    }
  }
}
```

2. For local development, you can use:
   - `http://localhost:3000` (if using Android emulator with backend on same machine)
   - `http://10.0.2.2:3000` (Android emulator accessing host machine)
   - `http://YOUR_LOCAL_IP:3000` (for physical devices)

### Step 2: Verify Endpoints

All API endpoints are defined in `src/api/endpoints.js`. Ensure these match your backend routes.

### Step 3: Test the Connection

Run the app and try logging in. Check the network tab in React Native Debugger to verify requests are being sent to the correct URL.

---

## Environment Configuration

The app uses a centralized configuration system located in `src/config/environment.js`.

### Configuration Structure

```javascript
{
  env: 'development' | 'staging' | 'production',
  api: {
    baseURL: string,
    timeout: number
  },
  features: {
    socialLogin: boolean,
    pushNotifications: boolean
  }
}
```

### Changing Environments

- **Development**: Automatically detected when `__DEV__` is true
- **Production**: Set when building for production

---

## API Endpoints Reference

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/login` | POST | User login | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| `/auth/register` | POST | User registration | `{ email, password, firstName, lastName, phoneNumber }` | `{ user, accessToken, refreshToken }` |
| `/auth/refresh` | POST | Refresh access token | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `/users/profile` | GET | Get user profile | - | `{ user }` |
| `/users/profile` | PUT | Update user profile | `{ firstName, lastName, phoneNumber, gender }` | `{ user }` |

### Booking Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/bookings` | GET | Get all bookings | - | `{ bookings: [] }` |
| `/bookings` | POST | Create booking | `{ fieldId, courtId, date, startTime, endTime, duration }` | `{ booking }` |
| `/bookings/upcoming` | GET | Get upcoming bookings | - | `{ bookings: [] }` |
| `/bookings/history` | GET | Get booking history | - | `{ bookings: [] }` |

### Field/Court Endpoints

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|--------------|----------|
| `/fields` | GET | Get all fields | - | `{ fields: [] }` |
| `/fields/search` | GET | Search fields | `location, date, sport` | `{ fields: [] }` |
| `/fields/:id` | GET | Get field details | - | `{ field }` |
| `/courts` | GET | Get courts for a field | `fieldId` | `{ courts: [] }` |

### Location Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/locations` | GET | Get all locations | `{ locations: [] }` |

---

## Authentication Flow

### 1. Token Management

The app uses a dual-token system:
- **Access Token**: Stored in-memory (Zustand store), short-lived
- **Refresh Token**: Stored in secure storage (expo-secure-store), long-lived

### 2. Login Flow

```
User enters credentials
    ↓
POST /auth/login
    ↓
Receive { user, accessToken, refreshToken }
    ↓
Store accessToken in Zustand (memory)
Store refreshToken in SecureStore
Store user data in AsyncStorage
    ↓
Navigate to App
```

### 3. Token Refresh Flow

```
API request with expired token
    ↓
Receive 401 Unauthorized
    ↓
Interceptor catches 401
    ↓
POST /auth/refresh with refreshToken
    ↓
Receive new { accessToken, refreshToken }
    ↓
Update tokens in storage
    ↓
Retry original request
```

### 4. Session Restoration

```
App launches
    ↓
Check for refreshToken in SecureStore
    ↓
If exists: POST /auth/refresh
    ↓
If successful: Restore session
If failed: Navigate to Login
```

---

## Request/Response Formats

### Authentication Requests

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response
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
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register Request
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### Booking Requests

#### Create Booking Request
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

#### Create Booking Response
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

### Field/Court Responses

#### Field Object
```json
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
  "sport": "football",
  "facilities": ["parking", "changing_rooms", "cafe"]
}
```

#### Court Object
```json
{
  "id": "court-id",
  "fieldId": "field-id",
  "name": "Court 1",
  "type": "indoor",
  "surface": "artificial_grass",
  "size": "5v5",
  "pricePerHour": 50,
  "availability": [
    {
      "date": "2026-02-15",
      "slots": [
        { "startTime": "09:00", "endTime": "11:00", "available": true },
        { "startTime": "11:00", "endTime": "13:00", "available": false }
      ]
    }
  ]
}
```

---

## Error Handling

### Error Response Format

All errors should follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

### HTTP Status Codes

| Status Code | Meaning | App Behavior |
|-------------|---------|--------------|
| 400 | Bad Request | Show error message to user |
| 401 | Unauthorized | Attempt token refresh, then logout if fails |
| 403 | Forbidden | Show "Access denied" message |
| 404 | Not Found | Show "Resource not found" message |
| 409 | Conflict | Show error (e.g., "Email already exists") |
| 422 | Validation Error | Show validation errors on form fields |
| 500 | Server Error | Show "Server error, please try again" |

### Error Handling in Services

All service methods use a centralized error handler that:
1. Catches network errors
2. Formats error messages
3. Provides user-friendly error text

Example from `authService.js`:
```javascript
try {
  const response = await client.post(ENDPOINTS.LOGIN, credentials);
  return response.data;
} catch (error) {
  throw handleAuthError(error);
}
```

---

## Testing

### 1. Mock Data

The app currently uses mock data located in:
- `mock-data/fields.js` - Sample field and court data
- Service files contain mock implementations

### 2. Switching from Mock to Real API

To switch from mock data to real API:

1. **Update environment config** in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "https://your-real-api.com"
       }
     }
   }
   ```

2. **Remove mock data usage** in services:
   - Open each service file (e.g., `src/api/courtService.js`)
   - Remove or comment out mock data imports
   - Uncomment the actual API calls

3. **Test each endpoint**:
   - Login/Register
   - Fetch fields
   - Create booking
   - Update profile

### 3. Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Register new user
- [ ] Register with existing email (should show error)
- [ ] Fetch user profile
- [ ] Update user profile
- [ ] Search for fields
- [ ] View field details
- [ ] Check court availability
- [ ] Create a booking
- [ ] View upcoming bookings
- [ ] View booking history
- [ ] Token refresh on 401 error
- [ ] Session restoration on app restart
- [ ] Logout

### 4. Network Debugging

Use React Native Debugger to inspect network requests:

1. Install React Native Debugger
2. Enable network inspection
3. Monitor all API calls
4. Verify request/response formats

---

## Additional Notes

### CORS Configuration

If testing with a web-based backend, ensure CORS is properly configured:

```javascript
// Example Express.js CORS config
app.use(cors({
  origin: '*', // In production, specify your domain
  credentials: true
}));
```

### Rate Limiting

Consider implementing rate limiting on your backend to prevent abuse.

### Data Validation

The app uses `react-hook-form` for client-side validation, but always validate on the backend as well.

### Image Uploads

For profile pictures or field images, you'll need to:
1. Implement multipart/form-data support
2. Add image upload endpoints
3. Update the corresponding services

---

## Support

For issues or questions:
1. Check the API documentation
2. Review the service files in `src/api/`
3. Check the Zustand store in `src/store/`
4. Review the authentication flow in `src/navigation/RootNavigator.js`

---

**Last Updated**: February 6, 2026
