# Navigation Architecture Explained

## 📁 Overview

Your app uses a **3-tier navigation architecture** that separates concerns and provides a clean, scalable structure:

```
RootNavigator (Top Level)
    ├── AuthStack (Unauthenticated Users)
    │   ├── SplashScreen
    │   ├── OnboardingScreen
    │   ├── LoginScreen
    │   └── RegisterScreen
    │
    └── AppStack (Authenticated Users)
        └── BookingScreen
```

---

## 🎯 The Three Navigation Files

### 1. **RootNavigator.js** - The Traffic Controller

**Purpose**: Decides which navigation stack to show based on authentication state.

**Location**: `src/navigation/RootNavigator.js`

#### How It Works:

```javascript
const RootNavigator = () => {
    const { isAuthenticated, isInitialized, setInitialized } = useAuthStore();
    
    // 1. Initialize auth state on app startup
    useEffect(() => {
        const initializeAuth = async () => {
            // Check for stored auth token
            // Validate and restore user session
            setInitialized(true);
        };
        initializeAuth();
    }, [setInitialized]);
    
    // 2. Show loading while initializing
    const isLoading = !isInitialized;
    if (isLoading) {
        return <ActivityIndicator />;
    }
    
    // 3. Route to correct stack based on auth status
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
```

#### The Logic Flow:

1. **App Starts** 
   - `isInitialized = false` (from Zustand store)
   - Shows loading spinner

2. **useEffect Runs**
   - Checks if user has saved credentials (TODO: AsyncStorage)
   - Sets `isInitialized = true`

3. **Conditional Rendering**
   - If `isAuthenticated = true` → Show `AppStack` (main app)
   - If `isAuthenticated = false` → Show `AuthStack` (login/signup)

#### Key Responsibilities:
- ✅ Wraps everything in `NavigationContainer` (required by React Navigation)
- ✅ Manages app-level loading state
- ✅ Routes users to correct flow based on auth status
- ✅ Prevents navigation from rendering before auth state is ready

---

### 2. **AuthStack.js** - The Onboarding & Login Flow

**Purpose**: Handles all screens for **unauthenticated users** (before login).

**Location**: `src/navigation/AuthStack.js`

#### How It Works:

```javascript
const AuthStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{ headerShown: false }} 
            initialRouteName="Splash"
        >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};
```

#### Screen Flow:

```
1. SplashScreen (2 seconds)
   ↓ (auto-navigates)
2. OnboardingScreen (3 slides)
   ↓ (user clicks "Get Started" or "Skip")
3. LoginScreen
   ↓ (user clicks "Sign Up")
4. RegisterScreen
```

#### Configuration Details:

| Option | Value | Why? |
|--------|-------|------|
| `screenOptions={{ headerShown: false }}` | Hides header on all screens | Clean, custom UI |
| `initialRouteName="Splash"` | Starts at SplashScreen | Shows branded splash first |
| `options={{ animation: 'none' }}` on Onboarding | No transition animation | Smooth UX after splash |

#### Navigation Methods Used:

```javascript
// In SplashScreen.js
navigation.replace('Onboarding'); // Replace (can't go back)

// In OnboardingScreen.js
navigation.navigate('Login'); // Navigate (can go back)

// In LoginScreen.js
navigation.navigate('Register'); // Navigate to signup
```

---

### 3. **AppStack.js** - The Main Application Flow

**Purpose**: Handles all screens for **authenticated users** (after login).

**Location**: `src/navigation/AppStack.js`

#### How It Works:

```javascript
const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Booking" component={BookingScreen} />
        </Stack.Navigator>
    );
};
```

#### Current State:
- Currently only has `BookingScreen`
- This is where you'll add more screens as you build features

#### Future Expansion Example:

```javascript
const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
};
```

---

## 🔄 Complete User Journey

### Scenario 1: First-Time User

```
1. App Opens
   → RootNavigator checks auth
   → isAuthenticated = false
   → Shows AuthStack

2. AuthStack Loads
   → Starts at SplashScreen (initialRouteName)
   → Animated logo appears

3. After 2.2 seconds
   → SplashScreen navigates to OnboardingScreen

4. User sees 3 onboarding slides
   → Clicks "Get Started"
   → Navigates to LoginScreen

5. User clicks "Sign Up"
   → Navigates to RegisterScreen

6. User registers successfully
   → useAuthStore.setAuth(user, token) is called
   → isAuthenticated becomes true

7. RootNavigator Re-renders
   → Sees isAuthenticated = true
   → Switches from AuthStack to AppStack
   → User sees BookingScreen
```

### Scenario 2: Returning User (with saved token)

```
1. App Opens
   → RootNavigator checks auth
   → useEffect runs initializeAuth()
   → Finds saved token in AsyncStorage (TODO)
   → Validates token
   → setAuth(user, token)
   → isAuthenticated = true

2. RootNavigator Renders
   → Shows AppStack directly
   → User sees BookingScreen
   → No splash/onboarding needed!
```

---

## 🏗️ Architecture Benefits

### 1. **Separation of Concerns**
- **RootNavigator**: Auth routing logic
- **AuthStack**: Pre-login screens
- **AppStack**: Post-login screens

### 2. **Scalability**
Easy to add new screens:
```javascript
// Add to AuthStack
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

// Add to AppStack
<Stack.Screen name="Profile" component={ProfileScreen} />
```

### 3. **Security**
- Unauthenticated users can't access AppStack screens
- Authenticated users skip AuthStack entirely

### 4. **Clean State Management**
- Single source of truth: `useAuthStore`
- Navigation responds to auth state changes automatically

---

## 🔑 Key Concepts

### Stack Navigator
```javascript
const Stack = createNativeStackNavigator();
```
- Creates a stack of screens (like a deck of cards)
- New screens push on top, back button pops them off
- Native performance (uses native navigation APIs)

### Navigation Container
```javascript
<NavigationContainer>
    {/* All navigation must be inside here */}
</NavigationContainer>
```
- Required wrapper for React Navigation
- Manages navigation state and deep linking
- Only used once at the root level

### Screen Options
```javascript
screenOptions={{ headerShown: false }}
```
- Applied to all screens in the stack
- Can be overridden per-screen with `options` prop

---

## 📝 Navigation Methods Cheat Sheet

### In Your Screens:

```javascript
// Navigate to a screen
navigation.navigate('Login');

// Replace current screen (can't go back)
navigation.replace('Onboarding');

// Go back to previous screen
navigation.goBack();

// Go back to first screen in stack
navigation.popToTop();

// Pass parameters
navigation.navigate('Profile', { userId: 123 });

// Access parameters
const { userId } = route.params;
```

---

## 🎨 Visual Diagram

```
┌─────────────────────────────────────────┐
│         RootNavigator.js                │
│  (Checks: isAuthenticated?)             │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ AuthStack│  │ AppStack │
└──────────┘  └──────────┘
      │             │
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ Splash   │  │ Booking  │
│ Onboard  │  │ (More    │
│ Login    │  │  screens │
│ Register │  │  to come)│
└──────────┘  └──────────┘
```

---

## 🚀 Next Steps / TODOs

1. **Add Persistent Auth** (RootNavigator.js, lines 15-21)
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   const token = await AsyncStorage.getItem('authToken');
   ```

2. **Expand AppStack** (AppStack.js)
   - Add Home screen
   - Add Profile screen
   - Add Settings screen

3. **Add Tab Navigation** (Optional)
   ```javascript
   import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
   ```

4. **Add Drawer Navigation** (Optional)
   ```javascript
   import { createDrawerNavigator } from '@react-navigation/drawer';
   ```

---

## 💡 Pro Tips

1. **Always use `navigation.replace()` for one-way flows**
   - Splash → Onboarding (can't go back to splash)
   - Login → Home (can't go back to login after auth)

2. **Use `navigation.navigate()` for reversible flows**
   - Login ↔ Register (can go back and forth)
   - Home → Profile (can go back)

3. **Keep stacks focused**
   - AuthStack = Everything before login
   - AppStack = Everything after login
   - Don't mix them!

4. **Use TypeScript for type-safe navigation** (Future enhancement)
   ```typescript
   type AuthStackParamList = {
     Splash: undefined;
     Onboarding: undefined;
     Login: undefined;
     Register: undefined;
   };
   ```

---

This architecture gives you a solid foundation that's easy to understand, maintain, and scale! 🎉
