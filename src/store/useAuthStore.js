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
     * @throws {Error} If token update fails
     */
    updateTokens: async (accessToken) => {
        // Update persistent storage first
        await tokenManager.updateAccessToken(accessToken);

        // Only update in-memory state if persistence succeeded
        set({ token: accessToken });
    },

    /**
     * Logout - Clear all auth data
     * Note: Always clears in-memory state, even if storage clear fails
     * @throws {Error} If storage clear fails (after state is cleared)
     */
    clearAuth: async () => {
        let storageError = null;

        try {
            // Try to clear persistent storage
            await tokenManager.clearTokens();
        } catch (error) {
            // Log and save error, but continue to clear in-memory state
            console.error('Failed to clear tokens from storage:', error);
            storageError = error;
        }

        // Always clear in-memory state (logout should always work)
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });

        // Re-throw storage error after state is cleared
        if (storageError) {
            throw storageError;
        }
    },

    /**
     * Update user profile data
     * @param {object} userData - Partial user data to update
     * @throws {Error} If user update fails or user is not authenticated
     */
    updateUser: async (userData) => {
        const currentUser = get().user;
        const updatedUser = currentUser ? { ...currentUser, ...userData } : userData;

        // Use in-memory state as source of truth for access token
        const accessToken = get().token;
        const isAuthenticated = get().isAuthenticated;

        // Validate user is authenticated
        if (!isAuthenticated || !accessToken) {
            throw new Error('Cannot update user: user is not authenticated.');
        }

        // Read refresh token from storage (not kept in memory)
        const refreshToken = await tokenManager.getRefreshToken();

        // Validate refresh token exists
        if (!refreshToken) {
            throw new Error('Cannot update user: refresh token is missing.');
        }

        // Update user in storage with validated tokens
        await tokenManager.setTokens(accessToken, refreshToken, updatedUser);

        // Only update in-memory state if persistence succeeded
        set({ user: updatedUser });
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
