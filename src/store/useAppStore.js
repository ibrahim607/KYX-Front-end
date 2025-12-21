import { create } from 'zustand';

/**
 * Global App Store for handling general UI state, loading, and global alerts.
 */
const useAppStore = create((set) => ({
    isLoading: false,
    error: null,

    // Actions
    setLoading: (status) => set({ isLoading: status }),
    setError: (message) => set({ error: message }),
    clearError: () => set({ error: null }),

    // Complex action example
    resetAppState: () => set({ isLoading: false, error: null }),
}));

export default useAppStore;
