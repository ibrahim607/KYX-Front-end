import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import { tokenManager } from '../tokenManager';

// Mock dependencies
jest.mock('axios');
jest.mock('../../store/useAuthStore');
jest.mock('../tokenManager');

// RE-STRATEGY:
// Because `client.js` creates a singleton instance on load, mocking `axios.create` correctly is key.
// We will define the mock for axios.create BEFORE importing the client.
// Since we are inside the test file, we can do this with jest.mock factory.

const mockAxiosInstance = {
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
    },
    post: jest.fn(), // internal axios call for refresh
    get: jest.fn(),
    defaults: { headers: { common: {} } }
};

// We also need it to be callable like client(config) -> Promise
const mockAxiosFunction = jest.fn((config) => Promise.resolve({ data: {} }));
Object.assign(mockAxiosFunction, mockAxiosInstance);

// Setup the mock
axios.create.mockReturnValue(mockAxiosFunction);
axios.post = jest.fn(); // For the direct axios.post call in refresh logic

describe('client.js logic', () => {
    let handlers = {
        req: null,
        res: null,
        resError: null
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // We need to reset modules to ensure client is re-evaluated and interceptors registered again
        jest.isolateModules(() => {
            const clientModule = require('../client');

            // Capture the handlers registered
            // request.use(success, fail)
            handlers.req = mockAxiosFunction.interceptors.request.use.mock.calls[0][0];

            // response.use(success, fail)
            handlers.res = mockAxiosFunction.interceptors.response.use.mock.calls[0][0];
            handlers.resError = mockAxiosFunction.interceptors.response.use.mock.calls[0][1];
        });
    });

    describe('Request Interceptor', () => {
        it('should attach Authorization header if token exists', () => {
            useAuthStore.getState.mockReturnValue({ token: 'test-token' });

            const config = { headers: {} };
            const result = handlers.req(config);

            expect(result.headers.Authorization).toBe('Bearer test-token');
        });

        it('should not attach Authorization header if token is missing', () => {
            useAuthStore.getState.mockReturnValue({ token: null });

            const config = { headers: {} };
            const result = handlers.req(config);

            expect(result.headers.Authorization).toBeUndefined();
        });
    });

    describe('Response Interceptor (Error Handling)', () => {
        it('should pass through non-401 errors', async () => {
            const error = { response: { status: 500 }, config: {} };

            await expect(handlers.resError(error)).rejects.toBe(error);
        });

        it('should try to refresh token on 401', async () => {
            const error = {
                response: { status: 401 },
                config: { headers: {} } // Original request
            };

            // Mock dependencies
            tokenManager.getRefreshToken.mockResolvedValue('refresh-token');
            axios.post.mockResolvedValue({
                data: { accessToken: 'new-access', refreshToken: 'new-refresh' }
            });
            tokenManager.getUser.mockResolvedValue({});

            // Mock store update
            useAuthStore.getState.mockReturnValue({
                updateTokens: jest.fn(),
                clearAuth: jest.fn()
            });

            // Call the error handler
            await handlers.resError(error);

            // Verify refresh flow
            expect(tokenManager.getRefreshToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/refresh'), { refreshToken: 'refresh-token' });

            // Should call setTokens with newRefreshToken and user (no access token)
            expect(tokenManager.setTokens).toHaveBeenCalledWith('new-refresh', {});

            // Verify original request retried with new token
            // The client (mockAxiosFunction) should be called with updated config
            expect(mockAxiosFunction).toHaveBeenCalled();
            const retryConfig = mockAxiosFunction.mock.calls[0][0];
            expect(retryConfig.headers.Authorization).toBe('Bearer new-access');
        });

        it('should logout if refresh fails', async () => {
            const error = {
                response: { status: 401 },
                config: { headers: {} }
            };

            tokenManager.getRefreshToken.mockResolvedValue('refresh-token');
            axios.post.mockRejectedValue(new Error('Refresh failed'));

            const clearAuthMock = jest.fn();
            useAuthStore.getState.mockReturnValue({
                clearAuth: clearAuthMock
            });

            await expect(handlers.resError(error)).rejects.toThrow('Refresh failed');

            expect(clearAuthMock).toHaveBeenCalled();
        });

        it('should logout if no refresh token available', async () => {
            const error = {
                response: { status: 401 },
                config: { headers: {} }
            };

            tokenManager.getRefreshToken.mockResolvedValue(null);

            const clearAuthMock = jest.fn();
            useAuthStore.getState.mockReturnValue({
                clearAuth: clearAuthMock
            });

            await expect(handlers.resError(error)).rejects.toThrow('No refresh token available');
            expect(clearAuthMock).toHaveBeenCalled();
        });
    });
});
