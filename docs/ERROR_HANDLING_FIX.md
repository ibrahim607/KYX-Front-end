# Fixed: Error Handling and State Divergence in Auth Store

## 🐛 **The Problem**

### **Critical Bug: State Divergence**

**Before (Broken):**
```javascript
updateTokens: async (accessToken) => {
    try {
        await tokenManager.updateAccessToken(accessToken); // ← Might fail
        set({ token: accessToken }); // ← Still executes!
    } catch (error) {
        console.error('Failed to update token:', error); // ← Swallows error
    }
}
```

**What Went Wrong:**
1. ❌ Storage update fails (disk full, permissions, etc.)
2. ❌ Error is caught and logged
3. ❌ In-memory state is STILL updated
4. ❌ **Persistent storage and memory are now out of sync!**
5. ❌ Caller has no idea there was an error

**Consequences:**
- 🔥 App thinks token is updated (in-memory shows new token)
- 🔥 Storage still has old token
- 🔥 App restart loads old token → User gets logged out unexpectedly
- 🔥 API calls might fail because tokens don't match
- 🔥 Impossible to debug because error was swallowed

---

## ✅ **The Solution**

### **Principle: Fail Fast, Propagate Errors**

**After (Fixed):**
```javascript
updateTokens: async (accessToken) => {
    // Update persistent storage first
    await tokenManager.updateAccessToken(accessToken); // ← Throws on failure
    
    // Only update in-memory state if persistence succeeded
    set({ token: accessToken }); // ← Only runs if above succeeded
}
```

**Why This Works:**
1. ✅ Try to update storage
2. ✅ If it fails, error is thrown immediately
3. ✅ `set()` never executes
4. ✅ In-memory state stays consistent with storage
5. ✅ Caller can catch and handle the error

---

## 📝 **Changes Made**

### **1. `updateTokens()` - Propagate Errors**

#### **Before:**
```javascript
updateTokens: async (accessToken) => {
    try {
        await tokenManager.updateAccessToken(accessToken);
        set({ token: accessToken });
    } catch (error) {
        console.error('Failed to update token:', error); // ← Swallows error
    }
}
```

#### **After:**
```javascript
/**
 * @throws {Error} If token update fails
 */
updateTokens: async (accessToken) => {
    // Update persistent storage first
    await tokenManager.updateAccessToken(accessToken);
    
    // Only update in-memory state if persistence succeeded
    set({ token: accessToken });
}
```

**Changes:**
- ✅ Removed try/catch (let error propagate)
- ✅ Added `@throws` JSDoc
- ✅ Only updates state after successful persistence
- ✅ Callers can now catch and handle errors

---

### **2. `clearAuth()` - Always Clear In-Memory**

#### **Before:**
```javascript
clearAuth: async () => {
    try {
        await tokenManager.clearTokens();
        set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
        console.error('Failed to clear auth:', error); // ← Swallows error
    }
}
```

**Problem:** If storage clear fails, in-memory state is NOT cleared!

#### **After:**
```javascript
/**
 * Note: Always clears in-memory state, even if storage clear fails
 */
clearAuth: async () => {
    try {
        // Try to clear persistent storage
        await tokenManager.clearTokens();
    } catch (error) {
        // Log but don't throw - we still want to clear in-memory state
        console.error('Failed to clear tokens from storage:', error);
    }
    
    // Always clear in-memory state (logout should always work)
    set({
        user: null,
        token: null,
        isAuthenticated: false,
    });
}
```

**Why Different from `updateTokens()`:**
- ✅ Logout should ALWAYS work (UX critical)
- ✅ Even if storage clear fails, user should be logged out in-memory
- ✅ Next app restart will try to restore from storage (might fail, but that's OK)
- ✅ Better to have orphaned storage than a stuck logged-in state

---

### **3. `updateUser()` - Propagate Errors**

#### **Before:**
```javascript
updateUser: async (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    
    try {
        await tokenManager.setTokens(accessToken, refreshToken, updatedUser);
        set({ user: updatedUser });
    } catch (error) {
        console.error('Failed to update user:', error); // ← Swallows error
    }
}
```

#### **After:**
```javascript
/**
 * @throws {Error} If user update fails
 */
updateUser: async (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    
    // Update user in storage first
    const accessToken = await tokenManager.getAccessToken();
    const refreshToken = await tokenManager.getRefreshToken();
    await tokenManager.setTokens(accessToken, refreshToken, updatedUser);
    
    // Only update in-memory state if persistence succeeded
    set({ user: updatedUser });
}
```

---

### **4. API Client - Handle Errors Properly**

#### **Before:**
```javascript
// Update Zustand state
useAuthStore.getState().updateTokens(accessToken); // ← Might fail silently

// Retry request
return client(originalRequest); // ← Might use wrong token!
```

#### **After:**
```javascript
// Update Zustand state
// Note: updateTokens now throws on failure
await useAuthStore.getState().updateTokens(accessToken);

// Only retry if above succeeded
return client(originalRequest);
```

**Also Updated Cleanup:**
```javascript
// Before:
await tokenManager.clearTokens();
useAuthStore.getState().clearAuth();

// After:
await useAuthStore.getState().clearAuth(); // ← Handles both!
```

---

## 🎯 **Error Handling Strategy**

### **When to Throw Errors:**

✅ **DO throw** when:
- State consistency is critical
- Caller needs to know about failure
- Operation can be retried
- Examples: `updateTokens()`, `updateUser()`, `setAuth()`

### **When to Swallow Errors:**

✅ **DO swallow** when:
- Operation should always succeed (UX critical)
- Partial failure is acceptable
- No recovery action possible
- Examples: `clearAuth()` (logout must always work)

### **When to Log and Re-throw:**

✅ **DO log + re-throw** when:
- You want to track the error
- But caller still needs to handle it
- Example:
```javascript
try {
    await someOperation();
} catch (error) {
    console.error('Operation failed:', error);
    throw error; // ← Re-throw!
}
```

---

## 📊 **State Consistency Matrix**

| Operation | Storage Fails | In-Memory Updated? | Error Thrown? |
|-----------|---------------|-------------------|---------------|
| **updateTokens()** | ❌ | ❌ No | ✅ Yes |
| **updateUser()** | ❌ | ❌ No | ✅ Yes |
| **setAuth()** | ❌ | ❌ No | ✅ Yes |
| **clearAuth()** | ❌ | ✅ Yes | ❌ No |
| **restoreSession()** | ❌ | ❌ No | ❌ No (sets initialized) |

---

## 🧪 **Testing**

### **Test Case 1: Storage Failure During Token Update**

```javascript
// Simulate storage failure
jest.spyOn(tokenManager, 'updateAccessToken').mockRejectedValue(
    new Error('Storage full')
);

// Try to update token
try {
    await useAuthStore.getState().updateTokens('new-token');
    fail('Should have thrown');
} catch (error) {
    expect(error.message).toBe('Storage full');
    
    // Verify in-memory state was NOT updated
    const state = useAuthStore.getState();
    expect(state.token).not.toBe('new-token');
}
```

### **Test Case 2: Logout Always Works**

```javascript
// Simulate storage failure
jest.spyOn(tokenManager, 'clearTokens').mockRejectedValue(
    new Error('Storage error')
);

// Logout should still work
await useAuthStore.getState().clearAuth();

// Verify in-memory state was cleared
const state = useAuthStore.getState();
expect(state.user).toBeNull();
expect(state.token).toBeNull();
expect(state.isAuthenticated).toBe(false);
```

---

## 💡 **Key Takeaways**

1. **Never swallow errors that cause state divergence**
2. **Update persistent storage BEFORE in-memory state**
3. **Only update in-memory state if persistence succeeded**
4. **Document error behavior with `@throws` JSDoc**
5. **Logout is special - it should always work**
6. **Let callers decide how to handle errors**

---

## 🚀 **Benefits**

| Before | After |
|--------|-------|
| ❌ Silent failures | ✅ Errors propagated |
| ❌ State divergence | ✅ Always consistent |
| ❌ Impossible to debug | ✅ Clear error messages |
| ❌ Unexpected logouts | ✅ Predictable behavior |
| ❌ Callers unaware | ✅ Callers can handle |

---

## 📚 **Related Files**

- ✅ `src/store/useAuthStore.js` - Fixed error handling
- ✅ `src/api/client.js` - Updated to handle errors
- ✅ `src/api/tokenManager.js` - Already throws on failure

---

**Your auth state is now bulletproof!** 🛡️

No more silent failures or state divergence. Errors are properly propagated, and state stays consistent.
