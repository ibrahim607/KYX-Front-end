# 📸 Profile Photo Picker Implementation

## ✅ What Was Implemented

**Feature:** Users can now change their profile photo by either taking a new photo with the camera or selecting one from their gallery.

---

## 🎯 How It Works

### **User Flow:**
1. User taps on their profile avatar
2. Alert appears with 3 options:
   - **Take Photo** - Opens camera
   - **Choose from Library** - Opens gallery
   - **Cancel** - Dismisses dialog
3. User selects/takes a photo
4. Photo is cropped to square (1:1 aspect ratio)
5. Photo is displayed immediately
6. Photo is saved to user profile in Zustand store

---

## 📦 Package Used

### **expo-image-picker**
- Official Expo package for image selection
- Supports both camera and gallery
- Built-in image editing (crop, rotate)
- Handles permissions automatically
- Works on iOS and Android

**Installation:**
```bash
npx expo install expo-image-picker
```

---

## 🔧 Implementation Details

### **File Modified: `ProfileScreen.js`**

#### **1. Imports Added**
```javascript
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
```

#### **2. State Management**
```javascript
// Get updateUser function from auth store
const { user, clearAuth, updateUser } = useAuthStore();

// Local state for immediate UI update
const [profileImage, setProfileImage] = useState(user?.profileImage || null);

// Use local state first, fallback to store
const userImage = profileImage || user?.profileImage || null;
```

**Why both local state and store?**
- **Local state (`profileImage`)**: Immediate UI update
- **Store (`updateUser`)**: Persist across app restarts
- **Fallback chain**: Local → Store → Null (default avatar)

---

### **3. Image Picker Implementation**

#### **Take Photo (Camera)**
```javascript
{
    text: 'Take Photo',
    onPress: async () => {
        // 1. Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
        }

        // 2. Launch camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,      // Enable crop/edit
            aspect: [1, 1],            // Square crop
            quality: 0.8,              // 80% quality (balance size/quality)
        });

        // 3. Update if user didn't cancel
        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setProfileImage(imageUri);           // Update UI immediately
            if (updateUser) {
                updateUser({ profileImage: imageUri });  // Persist to store
            }
        }
    }
}
```

#### **Choose from Library (Gallery)**
```javascript
{
    text: 'Choose from Library',
    onPress: async () => {
        // 1. Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Media library permission is required to choose photos.');
            return;
        }

        // 2. Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,      // Enable crop/edit
            aspect: [1, 1],            // Square crop
            quality: 0.8,              // 80% quality
        });

        // 3. Update if user didn't cancel
        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setProfileImage(imageUri);           // Update UI immediately
            if (updateUser) {
                updateUser({ profileImage: imageUri });  // Persist to store
            }
        }
    }
}
```

---

## 🔐 Permissions Handling

### **Camera Permission**
```javascript
const { status } = await ImagePicker.requestCameraPermissionsAsync();
if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
    return;
}
```

### **Media Library Permission**
```javascript
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Media library permission is required to choose photos.');
    return;
}
```

**How it works:**
1. Request permission before opening picker
2. If denied, show alert and return early
3. If granted, proceed with picker
4. Permissions are remembered by the OS

---

## ⚙️ Configuration Options

### **Image Picker Options Explained**

```javascript
{
    mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Only images (not videos)
    allowsEditing: true,                              // Show crop/edit screen
    aspect: [1, 1],                                   // Force square crop (1:1)
    quality: 0.8,                                     // 80% quality (0.0 - 1.0)
}
```

**Quality Settings:**
- `1.0` = 100% quality (large file size)
- `0.8` = 80% quality (good balance) ✅ **Recommended**
- `0.5` = 50% quality (smaller file)

**Aspect Ratio:**
- `[1, 1]` = Square (profile photos) ✅ **Used**
- `[16, 9]` = Widescreen
- `[4, 3]` = Standard photo

---

## 💾 Data Flow

### **1. User Selects Image**
```
User taps avatar
    ↓
Alert shows options
    ↓
User picks "Choose from Library"
    ↓
Permission requested
    ↓
Gallery opens
```

### **2. Image Processing**
```
User selects photo
    ↓
Crop screen appears (1:1 square)
    ↓
User crops/confirms
    ↓
Image URI returned
```

### **3. State Updates**
```
result.assets[0].uri
    ↓
setProfileImage(uri)  ← Local state (immediate UI)
    ↓
updateUser({ profileImage: uri })  ← Zustand store (persist)
    ↓
ProfileAvatar re-renders with new image
```

---

## 🎨 Image Storage

### **Where is the image stored?**

**Local URI:**
```
file:///data/user/0/host.exp.exponent/cache/ImagePicker/...
```

**What happens:**
1. Image is stored in app's cache directory
2. URI is saved to Zustand store
3. Store persists to AsyncStorage
4. Image loads from cache on app restart

**Important Notes:**
- ✅ Works offline (local file)
- ✅ Persists across app restarts
- ❌ Not synced to server (yet)
- ❌ Lost if app is uninstalled

**For Production:**
You'll want to upload to a server:
```javascript
// After getting imageUri
const formData = new FormData();
formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
});

// Upload to your backend
await fetch('https://your-api.com/upload', {
    method: 'POST',
    body: formData,
});
```

---

## 🧪 Testing Checklist

### **Camera Flow**
- [ ] Tap avatar
- [ ] Select "Take Photo"
- [ ] Grant camera permission (first time)
- [ ] Take a photo
- [ ] Crop the photo
- [ ] Confirm
- [ ] Photo appears immediately
- [ ] Close app and reopen
- [ ] Photo persists

### **Gallery Flow**
- [ ] Tap avatar
- [ ] Select "Choose from Library"
- [ ] Grant media library permission (first time)
- [ ] Select a photo
- [ ] Crop the photo
- [ ] Confirm
- [ ] Photo appears immediately
- [ ] Close app and reopen
- [ ] Photo persists

### **Permission Denied**
- [ ] Deny camera permission
- [ ] See "Permission Denied" alert
- [ ] Deny media library permission
- [ ] See "Permission Denied" alert

### **Cancel Flow**
- [ ] Tap avatar
- [ ] Select "Cancel"
- [ ] Dialog dismisses
- [ ] No changes made

---

## 🔍 Code Breakdown

### **Why `result.canceled`?**
```javascript
if (!result.canceled && result.assets[0]) {
    // User confirmed selection
}
```
- User can cancel at any point
- Check `canceled` to avoid errors
- Check `assets[0]` to ensure image exists

### **Why `async/await`?**
```javascript
const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(...);
}
```
- Image picker is asynchronous
- Need to wait for user to select image
- `async/await` makes code cleaner than promises

### **Why `updateUser` check?**
```javascript
if (updateUser) {
    updateUser({ profileImage: imageUri });
}
```
- Defensive programming
- Ensures function exists before calling
- Prevents crashes if store changes

---

## 📱 Platform Differences

### **iOS**
- Shows native iOS image picker
- Smooth crop/edit interface
- Permissions handled by iOS

### **Android**
- Shows native Android image picker
- Material Design interface
- Permissions handled by Android

### **Expo Go**
- Works in Expo Go app
- No additional configuration needed
- Permissions requested automatically

---

## 🚀 Future Enhancements

### **1. Upload to Server**
```javascript
const uploadImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
    });
    
    const response = await apiClient.post('/upload', formData);
    return response.data.url;
};
```

### **2. Image Compression**
```javascript
import * as ImageManipulator from 'expo-image-manipulator';

const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],  // Resize to 500px width
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
};
```

### **3. Remove Photo Option**
```javascript
{
    text: 'Remove Photo',
    style: 'destructive',
    onPress: () => {
        setProfileImage(null);
        updateUser({ profileImage: null });
    }
}
```

---

## ✨ Summary

### **What You Get:**
✅ **Take photos** with camera  
✅ **Select photos** from gallery  
✅ **Crop to square** automatically  
✅ **Immediate UI update**  
✅ **Persistent storage** (survives app restart)  
✅ **Permission handling** (automatic)  
✅ **Error handling** (permission denied)  
✅ **Cancel support** (user can back out)  

### **How It Works:**
1. **expo-image-picker** handles camera/gallery access
2. **Local state** updates UI immediately
3. **Zustand store** persists image across sessions
4. **ProfileAvatar** displays the image

**The profile photo picker is now fully functional!** 📸✨
