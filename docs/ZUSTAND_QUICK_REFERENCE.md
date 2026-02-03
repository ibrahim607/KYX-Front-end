# 📊 Zustand Implementation - Quick Reference

## 🎯 Why You Haven't Used Zustand Until Now

You **set up Zustand** back in December 2025, but you were only using it for authentication. Here's why:

### ❌ **Before This Refactor**
- Components imported mock data directly
- No centralized state management
- No reactive updates
- Hard to switch to real API
- Duplicate logic across components

### ✅ **After This Refactor**
- All data flows through Zustand stores
- Centralized business logic
- Reactive UI updates
- One-flag API migration
- Clean separation of concerns

---

## 🗺️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      COMPONENTS                          │
│  (BookingScreen, HomeScreen, ProfileScreen)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   ZUSTAND STORES                         │
│  • useBookingStore  • useCourtStore  • useAuthStore     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                          │
│  • bookingService.js  • courtService.js                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  USE_MOCK_DATA = true/false  ← Toggle here!     │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  MOCK DATA   │          │   REAL API   │
│  (Dev Mode)  │          │  (Production)│
└──────────────┘          └──────────────┘
```

---

## 📦 What Each Store Does

### **1. useBookingStore**
**Location:** `src/features/booking/store/useBookingStore.js`

**Manages:**
- User's bookings list
- Booking creation
- Booking cancellation
- Loading states

**Used in:**
- `BookingScreen.js`

**Key Actions:**
```javascript
fetchBookings()      // Load all bookings
cancelBooking(id)    // Cancel a booking
createBooking(data)  // Create new booking
refreshBookings()    // Force refresh
```

---

### **2. useCourtStore**
**Location:** `src/features/home/store/useCourtStore.js`

**Manages:**
- Available courts/fields
- Search results
- Favorite courts
- Court availability

**Used in:**
- `HomeScreen.js`

**Key Actions:**
```javascript
fetchCourts()              // Load all courts
searchCourts(params)       // Search courts
toggleFavorite(courtId)    // Like/unlike
isFavorite(courtId)        // Check if liked
fetchAvailability(id, date) // Get time slots
```

---

### **3. useAuthStore** (Already existed)
**Location:** `src/store/useAuthStore.js`

**Manages:**
- User authentication
- User profile data
- Access tokens
- Session persistence

**Used in:**
- `ProfileScreen.js`
- All authenticated screens

**Key Actions:**
```javascript
setAuth(user, token)    // Login
clearAuth()             // Logout
updateUser(data)        // Update profile
restoreSession()        // Restore on app start
```

---

## 🔄 How to Switch to Real API

### **Step 1: Update Service Files**

**For Bookings:**
```javascript
// src/api/bookingService.js
const USE_MOCK_DATA = false; // ← Change this
```

**For Courts:**
```javascript
// src/api/courtService.js
const USE_MOCK_DATA = false; // ← Change this
```

### **Step 2: Update API Base URL**
```javascript
// src/api/client.js
const API_BASE_URL = 'https://your-api.com'; // ← Update this
```

### **Step 3: Test!**
That's it! All components automatically use real API.

---

## 📝 Code Examples

### **Example 1: Using Booking Store**
```javascript
import useBookingStore from '../store/useBookingStore';

const BookingScreen = () => {
    const { 
        bookings,           // Current bookings
        isLoading,          // Loading state
        fetchBookings,      // Fetch function
        cancelBooking       // Cancel function
    } = useBookingStore();
    
    // Fetch on mount
    useEffect(() => {
        fetchBookings();
    }, []);
    
    // Cancel booking
    const handleCancel = async (id) => {
        await cancelBooking(id);
        // UI updates automatically!
    };
    
    return (
        <View>
            {isLoading && <LoadingSpinner />}
            {bookings.map(b => <BookingCard booking={b} />)}
        </View>
    );
};
```

### **Example 2: Using Court Store**
```javascript
import useCourtStore from '../store/useCourtStore';

const HomeScreen = () => {
    const { 
        courts,             // All courts
        searchResults,      // Search results
        isSearching,        // Search loading
        searchCourts,       // Search function
        toggleFavorite      // Like/unlike
    } = useCourtStore();
    
    // Search courts
    const handleSearch = async (location) => {
        await searchCourts({ location });
        // Results in searchResults automatically
    };
    
    // Toggle favorite
    const handleLike = async (courtId) => {
        await toggleFavorite(courtId);
        // UI updates automatically!
    };
    
    return (
        <View>
            {isSearching && <LoadingSpinner />}
            {(searchResults.length > 0 ? searchResults : courts)
                .map(c => <CourtCard court={c} onLike={handleLike} />)}
        </View>
    );
};
```

### **Example 3: Using Auth Store**
```javascript
import { useAuthStore } from '../../../store';

const ProfileScreen = () => {
    const { user, clearAuth } = useAuthStore();
    
    const handleLogout = async () => {
        await clearAuth();
        // User logged out, navigation handled automatically
    };
    
    return (
        <View>
            <Text>{user?.firstName} {user?.lastName}</Text>
            <Button onPress={handleLogout}>Logout</Button>
        </View>
    );
};
```

---

## 🎨 Benefits You Get

### **1. Reactive Updates**
```javascript
// Cancel booking
await cancelBooking(id);
// ✅ Booking disappears from UI instantly
// ✅ No manual state updates needed
// ✅ No page refresh required
```

### **2. Centralized Logic**
```javascript
// All booking logic in one place
// ✅ Easy to test
// ✅ Easy to maintain
// ✅ Consistent across app
```

### **3. Easy API Migration**
```javascript
// Change one flag
USE_MOCK_DATA = false;
// ✅ Entire app uses real API
// ✅ No component changes needed
```

### **4. Better Performance**
```javascript
// Components only re-render when their data changes
// ✅ No unnecessary re-renders
// ✅ Optimized state updates
```

---

## 🚀 What's Different Now

| Feature | Before | After |
|---------|--------|-------|
| **Data Source** | Direct mock imports | Zustand stores |
| **State Updates** | Manual | Automatic/Reactive |
| **Loading States** | Manual tracking | Built-in |
| **Error Handling** | Per component | Centralized |
| **API Migration** | Change every file | Change one flag |
| **Testing** | Mock components | Mock stores |
| **Performance** | Unnecessary re-renders | Optimized |

---

## 📚 Files Changed

### **New Files Created**
- ✅ `src/api/bookingService.js`
- ✅ `src/api/courtService.js`
- ✅ `src/features/home/store/useCourtStore.js`
- ✅ `docs/API_MIGRATION.md`
- ✅ `docs/ZUSTAND_REFACTOR.md`

### **Files Refactored**
- ✅ `src/features/booking/store/useBookingStore.js`
- ✅ `src/features/booking/screens/BookingScreen.js`
- ✅ `src/features/home/screens/HomeScreen.js`
- ✅ `src/features/home/components/SearchSection.js`
- ✅ `src/features/profile/screens/ProfileScreen.js`
- ✅ `src/api/endpoints.js`

---

## 🎯 Next Steps

1. **Test Everything** - Verify all features work with mock data
2. **Backend Integration** - When ready, toggle `USE_MOCK_DATA = false`
3. **Add More Features** - Use the same pattern for other features
4. **Optimize** - Add caching, optimistic updates, etc.

---

## 💡 Pro Tips

### **Tip 1: Debugging**
```javascript
// Add this to see store state
const store = useBookingStore();
console.log('Store:', store);
```

### **Tip 2: Selective Subscriptions**
```javascript
// Only subscribe to what you need
const bookings = useBookingStore(state => state.bookings);
// Component only re-renders when bookings change
```

### **Tip 3: Actions Outside Components**
```javascript
// You can call store actions anywhere
import useBookingStore from './store/useBookingStore';

const refreshData = () => {
    useBookingStore.getState().fetchBookings();
};
```

---

**You're now using Zustand properly across your entire app! 🎉**
