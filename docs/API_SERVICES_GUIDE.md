# API Services Quick Reference

This document provides a quick reference for all API services in the KYX app.

## Service Files Location

All API services are located in `src/api/`:

```
src/api/
├── client.js           # Axios client with interceptors
├── endpoints.js        # API endpoint constants
├── tokenManager.js     # Token storage management
├── authService.js      # Authentication APIs
├── bookingService.js   # Booking APIs
├── courtService.js     # Court/Field APIs
├── locationService.js  # Location APIs
└── searchService.js    # Search APIs
```

---

## How to Add a New API Endpoint

### Step 1: Add endpoint to `endpoints.js`

```javascript
export const ENDPOINTS = {
  // ... existing endpoints
  NEW_ENDPOINT: '/new/endpoint',
};
```

### Step 2: Create or update service file

```javascript
import client from './client';
import { ENDPOINTS } from './endpoints';

export const newService = {
  getData: async () => {
    try {
      const response = await client.get(ENDPOINTS.NEW_ENDPOINT);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    // Handle different status codes
    return new Error(data.message || 'An error occurred');
  } else if (error.request) {
    return new Error('Network error. Please check your connection.');
  } else {
    return new Error(error.message || 'An unexpected error occurred.');
  }
};
```

### Step 3: Use in component

```javascript
import { newService } from '../api/newService';

const MyComponent = () => {
  const fetchData = async () => {
    try {
      const data = await newService.getData();
      // Handle success
    } catch (error) {
      // Handle error
      console.error(error.message);
    }
  };

  // ...
};
```

---

## Authentication Service

### Import
```javascript
import { authService } from '../api/authService';
```

### Methods

#### Login
```javascript
const { user, accessToken, refreshToken } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Register
```javascript
const { user, accessToken, refreshToken } = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890'
});
```

#### Update Profile
```javascript
const updatedUser = await authService.updateProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  phoneNumber: '+0987654321',
  gender: 'female'
});
```

#### Logout
```javascript
await authService.logout();
```

---

## Booking Service

### Import
```javascript
import { bookingService } from '../api/bookingService';
```

### Methods

#### Get All Bookings
```javascript
const bookings = await bookingService.getBookings();
```

#### Get Upcoming Bookings
```javascript
const upcomingBookings = await bookingService.getUpcomingBookings();
```

#### Get Booking History
```javascript
const history = await bookingService.getBookingHistory();
```

#### Create Booking
```javascript
const booking = await bookingService.createBooking({
  fieldId: 'field-id',
  courtId: 'court-id',
  date: '2026-02-15',
  startTime: '14:00',
  endTime: '16:00',
  duration: 2
});
```

---

## Court Service

### Import
```javascript
import { courtService } from '../api/courtService';
```

### Methods

#### Get All Fields
```javascript
const fields = await courtService.getFields();
```

#### Get Field by ID
```javascript
const field = await courtService.getFieldById('field-id');
```

#### Get Courts for Field
```javascript
const courts = await courtService.getCourts('field-id');
```

#### Get Court Availability
```javascript
const availability = await courtService.getCourtAvailability('court-id', {
  date: '2026-02-15'
});
```

---

## Location Service

### Import
```javascript
import { locationService } from '../api/locationService';
```

### Methods

#### Get All Locations
```javascript
const locations = await locationService.getLocations();
```

---

## Search Service

### Import
```javascript
import { searchService } from '../api/searchService';
```

### Methods

#### Search Fields
```javascript
const results = await searchService.searchFields({
  location: 'New York',
  date: '2026-02-15',
  sport: 'football'
});
```

---

## Token Manager

### Import
```javascript
import { tokenManager } from '../api/tokenManager';
```

### Methods

#### Set Tokens
```javascript
await tokenManager.setTokens('refresh-token', { id: 'user-id', email: 'user@example.com' });
```

#### Get Refresh Token
```javascript
const refreshToken = await tokenManager.getRefreshToken();
```

#### Get User
```javascript
const user = await tokenManager.getUser();
```

#### Clear Tokens
```javascript
await tokenManager.clearTokens();
```

---

## Axios Client

The `client.js` file provides a configured Axios instance with:

### Features
- **Base URL**: Configured from environment
- **Timeout**: 10 seconds (configurable)
- **Request Interceptor**: Automatically adds auth token to requests
- **Response Interceptor**: Handles 401 errors and token refresh

### Direct Usage (Not Recommended)
```javascript
import client from '../api/client';

// GET request
const response = await client.get('/endpoint');

// POST request
const response = await client.post('/endpoint', { data });

// PUT request
const response = await client.put('/endpoint', { data });

// DELETE request
const response = await client.delete('/endpoint');
```

**Note**: It's better to use service methods instead of direct client calls.

---

## Error Handling Pattern

All services follow this error handling pattern:

```javascript
try {
  const response = await client.method(endpoint, data);
  return response.data;
} catch (error) {
  throw handleError(error);
}
```

The `handleError` function:
1. Checks if error has a response (server error)
2. Checks if error has a request (network error)
3. Handles other errors
4. Returns user-friendly error messages

---

## Common Patterns

### Loading State
```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await service.getData();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### Error State
```javascript
const [error, setError] = useState(null);

const fetchData = async () => {
  setError(null);
  try {
    const data = await service.getData();
    // Handle success
  } catch (error) {
    setError(error.message);
  }
};
```

### With Zustand Store
```javascript
import { useAuthStore } from '../store';

const MyComponent = () => {
  const { login } = useAuthStore();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Navigation handled by store
    } catch (error) {
      // Show error to user
    }
  };
};
```

---

## Testing API Calls

### Using React Native Debugger

1. Open React Native Debugger
2. Enable Network Inspect
3. Make API calls
4. View requests/responses in Network tab

### Using Console Logs (Development Only)

```javascript
const fetchData = async () => {
  try {
    console.log('Fetching data...');
    const data = await service.getData();
    console.log('Data received:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Remember to remove console.logs before production!**

---

## Switching from Mock to Real API

### Current State
Some services use mock data for development.

### To Switch to Real API

1. **Update `app.json`** with real API URL
2. **Remove mock data imports** from service files
3. **Uncomment real API calls** in service files
4. **Test each endpoint**

Example in `courtService.js`:
```javascript
// Before (Mock)
import { fields } from '../../mock-data/fields';
export const getFields = async () => {
  return fields;
};

// After (Real API)
export const getFields = async () => {
  try {
    const response = await client.get(ENDPOINTS.FIELDS);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
```

---

## Best Practices

1. **Always use try-catch** for API calls
2. **Handle errors gracefully** with user-friendly messages
3. **Use loading states** for better UX
4. **Don't expose sensitive data** in error messages
5. **Use service methods** instead of direct client calls
6. **Keep services focused** - one service per domain
7. **Document new endpoints** in this file
8. **Test error scenarios** (network errors, 401, 500, etc.)

---

**Last Updated**: February 6, 2026
