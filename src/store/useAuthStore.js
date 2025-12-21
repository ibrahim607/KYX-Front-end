import { create } from 'zustand';
import { tokenManager } from '../api/tokenManager';

/**
 * Authentication Store
 * Handles user session, profile data, and login/logout logic with token management.
 */
const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false,

    /**
     * Login - Store user and tokens
     * @param {object} user - User data
     * @param {string} accessToken - JWT access token
     * @param {string} refreshToken - JWT refresh token
     */
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

    /**
     * Update access token (called after refresh)
     * @param {string} accessToken - New JWT access token
     */
    updateTokens: async (accessToken) => {
        try {
            await tokenManager.updateAccessToken(accessToken);
            set({ token: accessToken });
        } catch (error) {
            console.error('Failed to update token:', error);
        }
    },

    /**
     * Logout - Clear all auth data
     */
    clearAuth: async () => {
        try {
            await tokenManager.clearTokens();
            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Failed to clear auth:', error);
        }
    },

    /**
     * Update user profile data
     * @param {object} userData - Partial user data to update
     */
    updateUser: async (userData) => {
        const currentUser = get().user;
        const updatedUser = currentUser ? { ...currentUser, ...userData } : userData;

        try {
            // Update user in storage
            const accessToken = await tokenManager.getAccessToken();
            const refreshToken = await tokenManager.getRefreshToken();
            await tokenManager.setTokens(accessToken, refreshToken, updatedUser);

            set({ user: updatedUser });
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    },

    /**
     * Restore session from stored tokens (called on app startup)
     */
    restoreSession: async () => {
        try {
            const { accessToken, refreshToken, user } = await tokenManager.getAllAuthData();

            if (accessToken && refreshToken) {
                // Tokens exist - restore session
                set({
                    user,
                    token: accessToken,
                    isAuthenticated: true,
                    isInitialized: true,
                });

                console.log('Session restored successfully');
            } else {
                // No tokens - user needs to login
                set({ isInitialized: true });
                console.log('No session to restore');
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
            // Clear potentially corrupted data
            await tokenManager.clearTokens();
            set({ isInitialized: true });
        }
    },

    /**
     * Set initialized flag manually
     * @param {boolean} val - Initialized state
     */
    setInitialized: (val) => set({ isInitialized: val }),
}));

export default useAuthStore;
