import { tokenManager } from '../../api/tokenManager';
import useAuthStore from '../useAuthStore';

// Mock tokenManager
jest.mock('../../api/tokenManager', () => ({
    tokenManager: {
        setTokens: jest.fn(),
        updateAccessToken: jest.fn(),
        clearTokens: jest.fn(),
        getRefreshToken: jest.fn(),
        getAllAuthData: jest.fn(),
    },
}));

describe('useAuthStore', () => {
    const initialState = useAuthStore.getState();

    beforeEach(() => {
        useAuthStore.setState(initialState, true); // Reset store
        jest.clearAllMocks();
    });

    describe('setAuth', () => {
        it('should set user and token, and persist refresh token/user', async () => {
            const user = { id: 1, name: 'Test User' };
            const accessToken = 'access-token';
            const refreshToken = 'refresh-token';

            await useAuthStore.getState().setAuth(user, accessToken, refreshToken);

            const state = useAuthStore.getState();
            expect(state.user).toEqual(user);
            expect(state.token).toBe(accessToken);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isInitialized).toBe(true);
            expect(tokenManager.setTokens).toHaveBeenCalledWith(
                refreshToken,
                user
            );
        });
    });

    describe('clearAuth', () => {
        it('should clear user and token, and remove from storage', async () => {
            // Setup initial state
            useAuthStore.setState({
                user: { id: 1 },
                token: 'token',
                isAuthenticated: true,
            });

            await useAuthStore.getState().clearAuth();

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.token).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(tokenManager.clearTokens).toHaveBeenCalled();
        });
    });

    describe('updateTokens', () => {
        it('should update access token in state only', async () => {
            const newAccessToken = 'new-token';

            await useAuthStore.getState().updateTokens(newAccessToken);

            const state = useAuthStore.getState();
            expect(state.token).toBe(newAccessToken);
            // Verify no storage call exists for access token (could check mock not called if it existed, but we just verify state)
        });
    });

    describe('updateUser', () => {
        it('should update user in state and storage if authenticated', async () => {
            const initialUser = { id: 1, name: 'Old Name' };
            const updates = { name: 'New Name' };
            const accessToken = 'token';
            const refreshToken = 'refresh-token';

            useAuthStore.setState({
                user: initialUser,
                token: accessToken,
                isAuthenticated: true,
            });

            tokenManager.getRefreshToken.mockResolvedValue(refreshToken);

            await useAuthStore.getState().updateUser(updates);

            const state = useAuthStore.getState();
            expect(state.user).toEqual({ ...initialUser, ...updates });
            expect(tokenManager.setTokens).toHaveBeenCalledWith(
                refreshToken,
                { ...initialUser, ...updates }
            );
        });
    });

    describe('restoreSession', () => {
        it('should restore user and initialized if refresh token exists (but not auth)', async () => {
            const user = { id: 1, name: 'Restored User' };
            const refreshToken = 'restored-refresh-token';

            tokenManager.getAllAuthData.mockResolvedValue({
                accessToken: null,
                refreshToken,
                user,
            });

            await useAuthStore.getState().restoreSession();

            const state = useAuthStore.getState();
            expect(state.user).toEqual(user);
            expect(state.token).toBeNull();
            // Should NOT be authenticated purely on refresh token existence
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
        });

        it('should set initialized true if no tokens', async () => {
            tokenManager.getAllAuthData.mockResolvedValue({
                accessToken: null,
                refreshToken: null,
                user: null,
            });

            await useAuthStore.getState().restoreSession();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
        });
    });
});
