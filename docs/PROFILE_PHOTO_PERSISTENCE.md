# 📸 Profile Photo Persistence - Explained

## ✅ **Yes, Photos ARE Saved and Persist!**

Your profile photo is saved to AsyncStorage and will survive app restarts.

---

## 🔄 **How It Works**

### **1. When You Select a Photo:**

```javascript
// ProfileScreen.js
const handleChangePhoto = async () => {
    // User selects photo...
    const imageUri = result.assets[0].uri;
    
    // 1. Update local state (immediate UI update)
    setProfileImage(imageUri);
    
    // 2. Save to Zustand store + AsyncStorage
    if (updateUser) {
        updateUser({ profileImage: imageUri });
    }
};
```

### **2. What `updateUser` Does:**

```javascript
// useAuthStore.js (line 57-76)
updateUser: async (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };  // Merge new data
    
    const accessToken = get().token;
    const refreshToken = await tokenManager.getRefreshToken();
    
    // SAVES TO ASYNCSTORAGE ✅
    await tokenManager.setTokens(accessToken, refreshToken, updatedUser);
    
    // Updates Zustand state
    set({ user: updatedUser });
}
```

### **3. On App Restart:**

```javascript
// useAuthStore.js (line 79-101)
restoreSession: async () => {
    // LOADS FROM ASYNCSTORAGE ✅
    const { accessToken, refreshToken, user } = await tokenManager.getAllAuthData();
    
    if (accessToken && refreshToken) {
        set({
            user,  // ← Includes profileImage!
            token: accessToken,
            isAuthenticated: true,
        });
        console.log('Session restored successfully');
    }
}
```

---

## 💾 **Storage Flow**

### **Save Flow:**
```
User selects photo
    ↓
imageUri = "file:///path/to/image.jpg"
    ↓
setProfileImage(imageUri)  ← Local state (immediate)
    ↓
updateUser({ profileImage: imageUri })
    ↓
tokenManager.setTokens(..., updatedUser)
    ↓
AsyncStorage.setItem('user', JSON.stringify(updatedUser))
    ↓
✅ SAVED TO DEVICE STORAGE
```

### **Restore Flow:**
```
App starts
    ↓
restoreSession() called
    ↓
tokenManager.getAllAuthData()
    ↓
AsyncStorage.getItem('user')
    ↓
user = { ..., profileImage: "file:///path/to/image.jpg" }
    ↓
set({ user })
    ↓
✅ PHOTO RESTORED
```

---

## 📂 **Where Is It Stored?**

### **AsyncStorage Location:**
```javascript
// Keys used:
'@auth_access_token'   // Your access token
'@auth_refresh_token'  // Your refresh token
'@auth_user'           // Your user data (includes profileImage!)
```

### **Image File Location:**
```
file:///data/user/0/host.exp.exponent/cache/ImagePicker/...
```

**Important:**
- ✅ Image URI is saved to AsyncStorage
- ✅ Image file is in app's cache directory
- ✅ Both persist across app restarts
- ❌ Lost if app is uninstalled (normal behavior)

---

## 🧪 **Test It Yourself**

### **Test Persistence:**
1. Select a profile photo
2. **Close the app completely** (swipe away)
3. **Reopen the app**
4. ✅ Photo should still be there!

### **What Happens:**
```javascript
// App.js or RootNavigator.js
useEffect(() => {
    restoreSession();  // Called on app start
}, []);
```

This automatically loads your photo from AsyncStorage.

---

## 🎯 **Summary**

### **Your Questions Answered:**

**Q: "Why isn't the photo saved to the data?"**  
**A:** It IS saved! To AsyncStorage via `tokenManager.setTokens()`.

**Q: "Or does the data itself all vanish on reload?"**  
**A:** No! The data persists. `restoreSession()` loads it back on app restart.

**Q: "If that's the case then it's fine"**  
**A:** It's better than fine - it's fully persistent! ✅

---

## 📊 **Data Persistence Summary**

| Data | Persists? | Where? |
|------|-----------|--------|
| Profile Image URI | ✅ Yes | AsyncStorage (`@auth_user`) |
| Image File | ✅ Yes | App cache directory |
| User Data | ✅ Yes | AsyncStorage |
| Auth Tokens | ✅ Yes | AsyncStorage |
| Survives App Restart | ✅ Yes | - |
| Survives App Uninstall | ❌ No | Normal behavior |

---

## 🔧 **Sign Out Button Color**

**Changed from red to black as requested!**

```javascript
// Before
backgroundColor: colors.red,  ❌

// After
backgroundColor: colors.black,  ✅
```

---

## ✨ **Everything Works!**

- ✅ **Profile photo persists** across app restarts
- ✅ **Sign out button is black**
- ✅ **Data is saved to AsyncStorage**
- ✅ **Session restoration works automatically**

**Your profile photo will stay saved until you sign out or uninstall the app!** 📸💾
