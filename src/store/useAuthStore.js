import { create } from 'zustand';

/**
 * Authentication Store
 * Handles user session, profile data, and login/logout logic.
 */
const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false,

    // Actions
    setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: !!user,
        isInitialized: true
    }),

    clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false
    }),

    updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : userData
    })),

    setInitialized: (val) => set({ isInitialized: val }),
}));

export default useAuthStore;
