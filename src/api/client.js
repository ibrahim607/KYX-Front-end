import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { tokenManager } from './tokenManager';

const API_BASE_URL = 'https://api.example.com'; // TODO: Replace with your actual API URL

/**
 * API Client with Auto-Refresh Token Interceptors
 * 
 * Features:
 * - Automatically adds access token to all requests (from Zustand for speed)
 * - Intercepts 401 errors and refreshes tokens
 * - Retries failed requests after token refresh
 * - Handles concurrent requests during refresh
 */

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// REQUEST INTERCEPTOR
// Adds access token to every request (from Zustand - FAST!)
// ============================================
client.interceptors.request.use(
    (config) => {
        // Get token from Zustand (synchronous, fast!)
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// Auto-refresh tokens on 401 errors
// ============================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject immediately
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return client(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = await tokenManager.getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Store new access token (and new refresh token if provided)
            if (newRefreshToken) {
                const user = await tokenManager.getUser();
                await tokenManager.setTokens(accessToken, newRefreshToken, user);
            } else {
                await tokenManager.updateAccessToken(accessToken);
            }

            // Update Zustand state immediately for fast access
            // Note: updateTokens now throws on failure, so this only runs if storage succeeded
            await useAuthStore.getState().updateTokens(accessToken);

            // Process queued requests with new token
            processQueue(null, accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);

        } catch (refreshError) {
            // Refresh failed - clear tokens and logout
            processQueue(refreshError, null);

            // Clear both storage and in-memory state
            // Note: clearAuth handles errors internally and always clears in-memory state
            await useAuthStore.getState().clearAuth();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default client;
