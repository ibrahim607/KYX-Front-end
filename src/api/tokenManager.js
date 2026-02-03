import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'auth_refresh_token';
// Note: SecureStore keys should not typically start with @ like AsyncStorage keys, 
// though it works. I removed the @ to be cleaner, but it's optional.
const USER_KEY = '@auth_user';

export const tokenManager = {
    async setTokens(refreshToken, user = null) {
        try {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

            if (user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error storing tokens:', error);
            throw error;
        }
    },

    async getRefreshToken() {
        try {
            return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    },

    async getUser() {
        try {
            const userJson = await AsyncStorage.getItem(USER_KEY);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    async clearTokens() {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY)
            ]);
        } catch (error) {
            console.error('Error clearing tokens:', error);
            throw error;
        }
    },

    async hasTokens() {
        try {
            const refreshToken = await this.getRefreshToken();
            return !!refreshToken;
        } catch (error) {
            console.error('Error checking tokens:', error);
            return false;
        }
    },

    async getAllAuthData() {
        try {
            const [refreshToken, user] = await Promise.all([
                this.getRefreshToken(),
                this.getUser(),
            ]);

            return {
                accessToken: null,
                refreshToken,
                user,
            };
        } catch (error) {
            console.error('Error getting auth data:', error);
            return {
                accessToken: null,
                refreshToken: null,
                user: null,
            };
        }
    },
};

export default tokenManager;
