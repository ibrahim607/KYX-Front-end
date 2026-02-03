import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { tokenManager } from './tokenManager';

const API_BASE_URL = 'https://api.example.com'; // TODO: Update with actual API URL

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add auth token to all requests
client.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh on 401
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

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Queue concurrent requests during refresh
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return client(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = await tokenManager.getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Update storage with new tokens
            if (newRefreshToken) {
                const user = await tokenManager.getUser();
                await tokenManager.setTokens(newRefreshToken, user);
            }
            // Access token is only updated in-memory via store below

            // Update in-memory state
            await useAuthStore.getState().updateTokens(accessToken);

            // Retry queued requests
            processQueue(null, accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            await useAuthStore.getState().clearAuth();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default client;
