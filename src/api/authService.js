import { mockUser } from '../../mock-data/user';
import client from './client';
import { ENDPOINTS } from './endpoints';

// ============================================
// TOGGLE THIS FLAG TO SWITCH BETWEEN MOCK AND REAL API
// ============================================
const USE_MOCK_DATA = true;

/**
 * Auth Service
 * Handles all authentication-related API calls
 * In mock mode: any email/password will work for login
 */

export const authService = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} - { user, accessToken, refreshToken }
     */
    login: async (credentials) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 800));
            // In demo mode, any email/password works
            // Use the email typed as the user's email for a personal feel
            const demoUser = {
                ...mockUser,
                email: credentials.email || mockUser.email,
            };
            return {
                user: demoUser,
                accessToken: 'mock-access-token-demo',
                refreshToken: 'mock-refresh-token-demo',
            };
        }
        try {
            const response = await client.post(ENDPOINTS.LOGIN, credentials);
            return response.data;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    /**
     * Register new user
     * @param {Object} userData - { email, password, firstName, lastName, phoneNumber }
     * @returns {Promise<Object>} - { user, accessToken, refreshToken }
     */
    register: async (userData) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In demo mode, registration always succeeds
            const newUser = {
                ...mockUser,
                firstName: userData.firstName || mockUser.firstName,
                lastName: userData.lastName || mockUser.lastName,
                email: userData.email || mockUser.email,
                phoneNumber: userData.phoneNumber || mockUser.phoneNumber,
            };
            return {
                user: newUser,
                accessToken: 'mock-access-token-demo',
                refreshToken: 'mock-refresh-token-demo',
            };
        }
        try {
            const response = await client.post(ENDPOINTS.REGISTER, userData);
            return response.data;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    /**
     * Update user profile
     * @param {Object} userData - User data to update
     * @returns {Promise<Object>} - Updated user object
     */
    updateProfile: async (userData) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 600));
            // In demo mode, profile updates succeed locally
            return { ...mockUser, ...userData };
        }
        try {
            const response = await client.put(ENDPOINTS.USER_PROFILE, userData);
            return response.data;
        } catch (error) {
            throw handleAuthError(error);
        }
    },

    /**
     * Logout user (optional - if backend requires logout endpoint)
     */
    logout: async () => {
        try {
            // Uncomment if your backend has a logout endpoint
            // await client.post(ENDPOINTS.LOGOUT);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Still return success even if API call fails
            return { success: true };
        }
    },
};

/**
 * Handle authentication errors and format them for UI display
 */
const handleAuthError = (error) => {
    if (error.response) {
        // Server responded with error
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return new Error(data.message || 'Invalid request. Please check your input.');
            case 401:
                return new Error(data.message || 'Invalid credentials. Please try again.');
            case 409:
                return new Error(data.message || 'An account with this email already exists.');
            case 422:
                return new Error(data.message || 'Validation failed. Please check your input.');
            case 500:
                return new Error('Server error. Please try again later.');
            default:
                return new Error(data.message || 'Something went wrong. Please try again.');
        }
    } else if (error.request) {
        // Request made but no response
        return new Error('Network error. Please check your connection.');
    } else {
        // Something else happened
        return new Error(error.message || 'An unexpected error occurred.');
    }
};
