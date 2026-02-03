import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { tokenManager } from '../tokenManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    clear: jest.fn(),
}));

// Mock Expo Secure Store
jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

describe('tokenManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('setTokens', () => {
        it('should store refresh token in SecureStore and user in AsyncStorage', async () => {
            const refreshToken = 'refresh-token';
            const user = { id: 1, name: 'Test User' };

            await tokenManager.setTokens(refreshToken, user);

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', refreshToken);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('@auth_user', JSON.stringify(user));
        });

        it('should store only refresh token if user is not provided', async () => {
            const refreshToken = 'refresh-token';

            await tokenManager.setTokens(refreshToken);

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', refreshToken);
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('getRefreshToken', () => {
        it('should return refresh token from SecureStore', async () => {
            SecureStore.getItemAsync.mockResolvedValue('refresh-token');

            const token = await tokenManager.getRefreshToken();

            expect(token).toBe('refresh-token');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        });
    });

    describe('getUser', () => {
        it('should return parsed user object from AsyncStorage', async () => {
            const user = { id: 1, name: 'Test User' };
            AsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

            const result = await tokenManager.getUser();

            expect(result).toEqual(user);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('@auth_user');
        });
    });

    describe('clearTokens', () => {
        it('should remove items from both stores', async () => {
            await tokenManager.clearTokens();

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
            expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_user');
        });
    });

    describe('getAllAuthData', () => {
        it('should return all auth data', async () => {
            const user = { id: 1, name: 'Test User' };

            SecureStore.getItemAsync.mockResolvedValue('refresh-token');
            AsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));

            const data = await tokenManager.getAllAuthData();

            expect(data).toEqual({
                accessToken: null,
                refreshToken: 'refresh-token',
                user: user,
            });
        });
    });
});
