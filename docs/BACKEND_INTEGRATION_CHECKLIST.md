# ✅ Backend Integration Checklist

Use this checklist when you're ready to connect your app to the real backend API.

---

## 📋 Pre-Integration Checklist

### **1. Verify Mock Data Works**
- [ ] All bookings display correctly
- [ ] Booking cancellation works
- [ ] Courts/fields display correctly
- [ ] Search functionality works
- [ ] Favorites work
- [ ] Profile displays user data
- [ ] Loading states show correctly
- [ ] Error handling works

### **2. Get Backend Information**
- [ ] API base URL (e.g., `https://api.kyx.com`)
- [ ] API documentation/Postman collection
- [ ] Authentication method (Bearer token, etc.)
- [ ] Response format examples
- [ ] Error response format
- [ ] Rate limiting information

### **3. Verify Endpoints Match**
Check that your `src/api/endpoints.js` matches backend:

**Bookings:**
- [ ] `GET /bookings` - Get all bookings
- [ ] `GET /bookings/upcoming` - Get upcoming bookings
- [ ] `GET /bookings/:id` - Get single booking
- [ ] `POST /bookings` - Create booking
- [ ] `PATCH /bookings/:id` - Update booking
- [ ] `DELETE /bookings/:id` - Cancel booking

**Courts/Fields:**
- [ ] `GET /courts` or `/fields` - Get all courts
- [ ] `GET /courts/:id` - Get court details
- [ ] `POST /fields/search` - Search courts
- [ ] `GET /courts/:id/availability` - Get availability
- [ ] `POST /courts/:id/favorite` - Add to favorites
- [ ] `DELETE /courts/:id/favorite` - Remove from favorites

**Authentication:**
- [ ] `POST /auth/login` - Login
- [ ] `POST /auth/register` - Register
- [ ] `POST /auth/refresh` - Refresh token
- [ ] `GET /user/profile` - Get user profile
- [ ] `PATCH /user/profile` - Update profile

---

## 🔧 Integration Steps

### **Step 1: Update API Base URL**

**File:** `src/api/client.js`

```javascript
// Change this line:
const API_BASE_URL = 'https://api.example.com';

// To your actual API URL:
const API_BASE_URL = 'https://api.kyx.com'; // ← Your backend URL
```

- [ ] Updated API_BASE_URL
- [ ] Verified URL is correct (no trailing slash)
- [ ] Confirmed URL is accessible

---

### **Step 2: Update Endpoints (if needed)**

**File:** `src/api/endpoints.js`

- [ ] Verified all endpoint paths match backend
- [ ] Updated any different endpoint names
- [ ] Added any new endpoints from backend

**Example:**
```javascript
// If backend uses /api/v1/bookings instead of /bookings
BOOKINGS: '/api/v1/bookings',
```

---

### **Step 3: Toggle Mock Data Flags**

**File:** `src/api/bookingService.js`
```javascript
const USE_MOCK_DATA = false; // ← Change true to false
```
- [ ] Changed `USE_MOCK_DATA = false` in bookingService.js

**File:** `src/api/courtService.js`
```javascript
const USE_MOCK_DATA = false; // ← Change true to false
```
- [ ] Changed `USE_MOCK_DATA = false` in courtService.js

---

### **Step 4: Test Authentication First**

Before testing other features, verify auth works:

- [ ] Test login with real credentials
- [ ] Verify token is stored
- [ ] Verify token is sent in requests
- [ ] Test token refresh on 401
- [ ] Test logout

**Check in console:**
```javascript
// Should see token in requests
🌐 API Request: POST /auth/login
Authorization: Bearer eyJhbGc...
```

---

### **Step 5: Test Each Feature**

#### **Bookings**
- [ ] Fetch bookings works
- [ ] Create booking works
- [ ] Cancel booking works
- [ ] Update booking works
- [ ] Loading states work
- [ ] Error handling works

#### **Courts/Fields**
- [ ] Fetch courts works
- [ ] Search courts works
- [ ] Court details work
- [ ] Availability check works
- [ ] Favorites work

#### **Profile**
- [ ] User data loads
- [ ] Profile updates work
- [ ] Profile image works

---

### **Step 6: Handle Response Format Differences**

If backend response format differs from mock data:

**Option A: Transform in Service Layer**
```javascript
// In bookingService.js
export const fetchUserBookings = async () => {
    const response = await client.get(ENDPOINTS.BOOKINGS);
    
    // Transform backend format to app format
    return response.data.bookings.map(booking => ({
        id: booking._id,              // Backend uses _id
        courtName: booking.field.name, // Backend nests field data
        // ... transform other fields
    }));
};
```
- [ ] Added transformations if needed
- [ ] Tested transformed data displays correctly

**Option B: Update Mock Data to Match Backend**
- [ ] Updated mock data format to match backend
- [ ] Retested with mock data

---

### **Step 7: Error Handling**

Test error scenarios:

- [ ] Network error (turn off wifi)
- [ ] 401 Unauthorized (expired token)
- [ ] 404 Not Found (invalid ID)
- [ ] 500 Server Error
- [ ] Validation errors (400)

Verify:
- [ ] Error messages display to user
- [ ] App doesn't crash
- [ ] User can retry
- [ ] Loading states clear on error

---

### **Step 8: Performance Optimization**

- [ ] Add request caching if needed
- [ ] Implement pagination for large lists
- [ ] Add debouncing to search
- [ ] Optimize image loading
- [ ] Test on slow network

---

## 🐛 Common Issues & Solutions

### **Issue: "Network request failed"**
**Solutions:**
- [ ] Check API_BASE_URL is correct
- [ ] Verify backend is running
- [ ] Check CORS settings on backend
- [ ] Test API with Postman first

### **Issue: "401 Unauthorized"**
**Solutions:**
- [ ] Verify token is being sent
- [ ] Check token format (Bearer prefix)
- [ ] Verify token hasn't expired
- [ ] Test login again

### **Issue: "Data not displaying"**
**Solutions:**
- [ ] Check response format in console
- [ ] Verify data transformation
- [ ] Check for null/undefined values
- [ ] Verify store is updating

### **Issue: "Loading never stops"**
**Solutions:**
- [ ] Check for errors in console
- [ ] Verify `isLoading` is set to false
- [ ] Check try/catch blocks
- [ ] Verify finally blocks execute

---

## 📊 Testing Checklist

### **Manual Testing**
- [ ] Login/Logout flow
- [ ] View bookings
- [ ] Create booking
- [ ] Cancel booking
- [ ] Search courts
- [ ] View court details
- [ ] Add/remove favorites
- [ ] Update profile
- [ ] Pull to refresh
- [ ] Error scenarios

### **Network Testing**
- [ ] Test on WiFi
- [ ] Test on mobile data
- [ ] Test on slow 3G
- [ ] Test offline behavior

### **Edge Cases**
- [ ] Empty states (no bookings)
- [ ] Large lists (100+ items)
- [ ] Long text (court names, etc.)
- [ ] Special characters in search
- [ ] Rapid button clicks

---

## 🚀 Deployment Checklist

### **Before Deployment**
- [ ] All features tested with real API
- [ ] Error handling verified
- [ ] Loading states work correctly
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Tested on multiple devices

### **Environment Variables**
Consider using environment variables for API URL:

```javascript
// src/api/client.js
const API_BASE_URL = __DEV__ 
    ? 'http://localhost:3000'  // Development
    : 'https://api.kyx.com';   // Production
```

- [ ] Set up environment variables
- [ ] Test both dev and prod URLs

### **Final Checks**
- [ ] Remove console.logs
- [ ] Remove debug code
- [ ] Update app version
- [ ] Test production build
- [ ] Verify analytics work
- [ ] Test crash reporting

---

## 📝 Rollback Plan

If integration fails, you can quickly rollback:

### **Quick Rollback**
```javascript
// In bookingService.js and courtService.js
const USE_MOCK_DATA = true; // ← Change back to true
```

- [ ] Document rollback procedure
- [ ] Test rollback works
- [ ] Keep mock data files

---

## 🎯 Post-Integration

### **Monitoring**
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track user issues
- [ ] Monitor crash reports

### **Optimization**
- [ ] Add request caching
- [ ] Implement optimistic updates
- [ ] Add offline support
- [ ] Optimize bundle size

### **Documentation**
- [ ] Update API documentation
- [ ] Document any transformations
- [ ] Update team on changes
- [ ] Create troubleshooting guide

---

## ✅ Sign-Off

**Integration completed by:** _______________  
**Date:** _______________  
**Backend version:** _______________  
**App version:** _______________  

**Notes:**
_____________________________________
_____________________________________
_____________________________________

---

**Good luck with your backend integration! 🚀**
