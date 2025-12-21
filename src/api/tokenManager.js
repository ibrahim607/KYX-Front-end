import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';
const USER_KEY = '@auth_user';

export const tokenManager = {
    async setTokens(accessToken, refreshToken, user = null) {
        try {
            const items = [
                [TOKEN_KEY, accessToken],
                [REFRESH_TOKEN_KEY, refreshToken],
            ];

            if (user) {
                items.push([USER_KEY, JSON.stringify(user)]);
            }

            await AsyncStorage.multiSet(items);
        } catch (error) {
            console.error('Error storing tokens:', error);
            throw error;
        }
    },

    async getAccessToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    async getRefreshToken() {
        try {
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
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

    async updateAccessToken(accessToken) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, accessToken);
        } catch (error) {
            console.error('Error updating access token:', error);
            throw error;
        }
    },

    async clearTokens() {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
        } catch (error) {
            console.error('Error clearing tokens:', error);
            throw error;
        }
    },

    async hasTokens() {
        try {
            const accessToken = await this.getAccessToken();
            const refreshToken = await this.getRefreshToken();
            return !!(accessToken && refreshToken);
        } catch (error) {
            console.error('Error checking tokens:', error);
            return false;
        }
    },

    async getAllAuthData() {
        try {
            const [accessToken, refreshToken, user] = await Promise.all([
                this.getAccessToken(),
                this.getRefreshToken(),
                this.getUser(),
            ]);

            return {
                accessToken,
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
