/**
 * Environment Configuration
 * 
 * This file manages environment-specific configurations for the application.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a .env file in the root directory (it's gitignored)
 * 2. Add your environment variables:
 *    API_BASE_URL=https://your-api-url.com
 *    API_TIMEOUT=10000
 * 3. For Expo projects, use expo-constants to access these values
 * 
 * PRODUCTION DEPLOYMENT:
 * - Set environment variables in your deployment platform (Vercel, Netlify, etc.)
 * - Update the API_BASE_URL to your production backend URL
 */

import Constants from 'expo-constants';

// Environment types
export const ENV = {
    DEV: 'development',
    STAGING: 'staging',
    PROD: 'production',
};

// Get current environment
const getCurrentEnv = () => {
    if (__DEV__) {
        return ENV.DEV;
    }
    // You can add more logic here to differentiate between staging and production
    return ENV.PROD;
};

// Configuration object
const config = {
    // Current environment
    env: getCurrentEnv(),

    // API Configuration
    api: {
        // TODO: Replace with your actual backend URL
        // For development, you might use: http://localhost:3000 or your local IP
        // For production: https://api.yourdomain.com
        baseURL: Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.example.com',
        timeout: Constants.expoConfig?.extra?.apiTimeout || 10000,
    },

    // Feature flags (useful for gradual rollouts)
    features: {
        socialLogin: false, // Enable when social login is implemented
        pushNotifications: false, // Enable when push notifications are set up
    },

    // App metadata
    app: {
        name: Constants.expoConfig?.name || 'KYX',
        version: Constants.expoConfig?.version || '1.0.0',
    },
};

// Helper functions
export const isProduction = () => config.env === ENV.PROD;
export const isDevelopment = () => config.env === ENV.DEV;
export const isStaging = () => config.env === ENV.STAGING;

export default config;
