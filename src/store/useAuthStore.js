import { create } from 'zustand';
import { authService } from '../api/authService';
import { tokenManager } from '../api/tokenManager';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: true,
    isInitialized: true,

    //set is auth and is init to false after development 

    // Login and store tokens (only refresh token persists)
    setAuth: async (user, accessToken, refreshToken) => {
        try {
            await tokenManager.setTokens(refreshToken, user);
            set({
                user,
                token: accessToken,
                isAuthenticated: true,
                isInitialized: true,
            });
        } catch (error) {
            console.error('Failed to set auth:', error);
            throw error;
        }
    },

    // Update access token (in-memory only)
    updateTokens: async (accessToken) => {
        // No storage update for access token
        set({ token: accessToken });
    },

    // Logout - always clears state even if storage fails
    clearAuth: async () => {
        let storageError = null;

        try {
            await tokenManager.clearTokens();
        } catch (error) {
            console.error('Failed to clear tokens from storage:', error);
            storageError = error;
        }

        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });

        if (storageError) {
            throw storageError;
        }
    },

    // Update user profile
    updateUser: async (userData) => {
        const currentUser = get().user;
        const updatedUser = currentUser ? { ...currentUser, ...userData } : userData;

        const accessToken = get().token;
        const isAuthenticated = get().isAuthenticated;

        if (!isAuthenticated || !accessToken) {
            throw new Error('Cannot update user: user is not authenticated.');
        }

        const refreshToken = await tokenManager.getRefreshToken();

        if (!refreshToken) {
            throw new Error('Cannot update user: refresh token is missing.');
        }

        try {
            // Call API to update user profile
            // import { authService } from '../api/authService'; <-- Need to ensure this is imported
            // Actually, we need to import it at the top of the file
            const updatedProfile = await authService.updateProfile(userData);

            // Merge returned data with existing user data
            const newUserData = { ...currentUser, ...updatedProfile };

            await tokenManager.setTokens(refreshToken, newUserData);
            set({ user: newUserData });
        } catch (error) {
            console.error('Failed to update user profile:', error);
            throw error;
        }
    },

    // Restore session on app startup
    restoreSession: async () => {
        try {
            const { refreshToken, user } = await tokenManager.getAllAuthData();

            if (refreshToken) {
                try {
                    console.log('Restoring session, refreshing token...');

                    // PLACEHOLDER: Call your actual refresh endpoint here
                    const response = await axios.post('YOUR_API_URL/auth/refresh', { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;


                    // Example Implementation:
                    const newAccessToken = accessToken;
                    // If you get a new refresh token, update it:
                    await tokenManager.setTokens(newRefreshToken, user);

                    set({
                        user,
                        token: newAccessToken,
                        isAuthenticated: true,
                        isInitialized: true,
                    });


                    // For now, just marking initialized, user stays logged out until you implement the call above.
                    // If you want "auto-login" to work, you MUST implement the fetch above.
                    set({
                        user, // We set the user so UI might show "Welcome back" or similar while loading?
                        isInitialized: true
                    });

                } catch (refreshError) {
                    console.error('Session restore failed (refresh):', refreshError);
                    await tokenManager.clearTokens();
                    set({ isInitialized: true, user: null, isAuthenticated: false });
                }
            } else {
                set({ isInitialized: true });
                console.log('No session to restore');
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
            await tokenManager.clearTokens();
            set({ isInitialized: true });
        }
    },

    setInitialized: (val) => set({ isInitialized: val }),
}));

export default useAuthStore;
