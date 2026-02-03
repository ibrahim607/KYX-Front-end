# 🔄 API Migration Guide

This guide explains how to switch from **mock data** to **real API endpoints** in the KYX app.

---

## 📋 Current Architecture

The app uses a **service layer pattern** that makes API migration seamless:

```
Component (BookingScreen)
    ↓
Zustand Store (useBookingStore)
    ↓
Service Layer (bookingService.js) ← Toggle mock/real here
    ↓
Mock Data OR Real API
```

---

## 🚀 How to Switch to Real API

### **Step 1: Toggle the Mock Flag**

Open `src/api/bookingService.js` and change:

```javascript
// Change this from true to false
const USE_MOCK_DATA = false;
```

That's it! 🎉

---

## ✅ What Happens Automatically

When you set `USE_MOCK_DATA = false`:

1. ✅ All components automatically use real API calls
2. ✅ Authentication tokens are automatically attached (via axios interceptor)
3. ✅ Token refresh is handled automatically on 401 errors
4. ✅ All error handling remains the same
5. ✅ Loading states work identically

**No component code changes needed!**

---

## 🔧 Backend Requirements

Before switching to real API, ensure your backend has these endpoints:

### **Bookings Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bookings` | Get all user bookings |
| `GET` | `/bookings/upcoming` | Get upcoming bookings only |
| `GET` | `/bookings/:id` | Get single booking by ID |
| `POST` | `/bookings` | Create new booking |
| `PATCH` | `/bookings/:id` | Update booking |
| `DELETE` | `/bookings/:id` | Cancel booking |

### **Expected Response Format**

The API should return booking objects matching this structure:

```javascript
{
  id: string,
  courtId: string,
  courtName: string,
  location: string,
  date: string,           // "Jan 28, 2026 • 6:00 PM"
  duration: string,       // "2 hours"
  price: number,          // 600
  status: string,         // "Confirmed" | "Pending" | "Cancelled"
  bookingDate: string,    // "2026-01-28"
  startTime: string,      // "18:00:00"
  endTime: string,        // "20:00:00"
}
```

---

## 🧪 Testing the Migration

### **1. Test with Mock Data First**
```javascript
// In bookingService.js
const USE_MOCK_DATA = true;
```
- Verify all features work
- Test loading states
- Test error handling
- Test booking cancellation

### **2. Switch to Real API**
```javascript
const USE_MOCK_DATA = false;
```
- Ensure backend is running
- Check network requests in console
- Verify authentication tokens are sent
- Test all CRUD operations

### **3. Gradual Migration**
You can migrate feature by feature:
- Keep `USE_MOCK_DATA = true` in bookingService.js
- Set `USE_MOCK_DATA = false` in other services as they're ready

---

## 📝 Adding New Endpoints

When backend adds new endpoints:

### **1. Add to `src/api/endpoints.js`**
```javascript
export const ENDPOINTS = {
    // ... existing endpoints
    BOOKINGS_HISTORY: '/bookings/history',
    BOOKINGS_BY_DATE: '/bookings/by-date',
};
```

### **2. Add to service layer**
```javascript
// In bookingService.js
export const fetchBookingHistory = async () => {
    if (USE_MOCK_DATA) {
        // Return mock data
        return mockHistoricalBookings;
    }
    
    const response = await client.get(ENDPOINTS.BOOKINGS_HISTORY);
    return response.data;
};
```

### **3. Add to Zustand store**
```javascript
// In useBookingStore.js
fetchHistory: async () => {
    set({ isLoading: true });
    try {
        const history = await bookingService.fetchBookingHistory();
        set({ history, isLoading: false });
    } catch (error) {
        set({ error: error.message, isLoading: false });
    }
}
```

### **4. Use in component**
```javascript
const { history, fetchHistory } = useBookingStore();

useEffect(() => {
    fetchHistory();
}, []);
```

---

## 🎯 Benefits of This Architecture

✅ **Single Source of Truth** - Toggle one flag to switch entire app  
✅ **Type Safety** - All API calls go through typed service layer  
✅ **Easy Testing** - Mock data for development, real API for production  
✅ **Centralized Logic** - All booking logic in one store  
✅ **Automatic Auth** - Tokens handled by axios interceptor  
✅ **Error Handling** - Consistent error handling across app  

---

## 🔍 Debugging Tips

### **Check if using mock data:**
```javascript
// In bookingService.js, add console.log
export const fetchUserBookings = async () => {
    console.log('📊 Using mock data:', USE_MOCK_DATA);
    // ...
};
```

### **Monitor network requests:**
```javascript
// In client.js, add request logger
client.interceptors.request.use((config) => {
    console.log('🌐 API Request:', config.method.toUpperCase(), config.url);
    return config;
});
```

### **Check store state:**
```javascript
// In any component
const store = useBookingStore();
console.log('Store state:', store);
```

---

## 📚 Related Files

- `src/api/bookingService.js` - Service layer (toggle mock here)
- `src/api/endpoints.js` - API endpoint definitions
- `src/api/client.js` - Axios instance with auth interceptors
- `src/features/booking/store/useBookingStore.js` - Zustand store
- `mock-data/bookings.js` - Mock data (used when USE_MOCK_DATA = true)

---

## 🚨 Common Issues

### **Issue: "Network request failed"**
- ✅ Check if backend is running
- ✅ Verify API_BASE_URL in `client.js`
- ✅ Check CORS settings on backend

### **Issue: "401 Unauthorized"**
- ✅ Ensure user is logged in
- ✅ Check if token is in auth store
- ✅ Verify token format on backend

### **Issue: "Data format mismatch"**
- ✅ Compare API response to expected format
- ✅ Add data transformation in service layer
- ✅ Update mock data to match API format

---

**Need help?** Check the service layer code for inline comments and examples!
