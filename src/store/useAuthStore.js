import { create } from 'zustand';
import { tokenManager } from '../api/tokenManager';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false,

    // Login and store tokens
    setAuth: async (user, accessToken, refreshToken) => {
        try {
            await tokenManager.setTokens(accessToken, refreshToken, user);
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

    // Update access token after refresh
    updateTokens: async (accessToken) => {
        await tokenManager.updateAccessToken(accessToken);
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

        await tokenManager.setTokens(accessToken, refreshToken, updatedUser);
        set({ user: updatedUser });
    },

    // Restore session on app startup
    restoreSession: async () => {
        try {
            const { accessToken, refreshToken, user } = await tokenManager.getAllAuthData();

            if (accessToken && refreshToken) {
                set({
                    user,
                    token: accessToken,
                    isAuthenticated: true,
                    isInitialized: true,
                });

                console.log('Session restored successfully');
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
