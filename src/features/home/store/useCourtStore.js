import { create } from 'zustand';
import * as courtService from '../../../api/courtService';

/**
 * Court Store - Manages courts/fields data
 * 
 * This store handles:
 * - Fetching and displaying available courts
 * - Searching courts by location/date/time
 * - Managing favorite courts
 * - Court availability
 * 
 * EASY API MIGRATION:
 * When backend is ready, just toggle USE_MOCK_DATA in courtService.js
 */
const useCourtStore = create((set, get) => ({
    // State
    courts: [],
    favoriteCourts: [],
    searchResults: [],
    selectedCourt: null,
    availability: [],
    isLoading: false,
    isSearching: false,
    error: null,
    lastFetch: null,

    // ============================================
    // FETCH COURTS
    // ============================================

    /**
     * Fetch all available courts
     */
    fetchCourts: async () => {
        set({ isLoading: true, error: null });
        try {
            const courts = await courtService.fetchCourts();
            set({
                courts,
                isLoading: false,
                lastFetch: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to fetch courts:', error);
            set({
                error: error.message || 'Failed to load courts',
                isLoading: false
            });
        }
    },

    /**
     * Fetch court by ID
     */
    fetchCourtById: async (courtId) => {
        set({ isLoading: true, error: null });
        try {
            const court = await courtService.fetchCourtById(courtId);
            set({
                selectedCourt: court,
                isLoading: false
            });
            return court;
        } catch (error) {
            console.error('Failed to fetch court:', error);
            set({
                error: error.message || 'Failed to load court details',
                isLoading: false
            });
            throw error;
        }
    },

    // ============================================
    // SEARCH
    // ============================================

    /**
     * Search courts
     * @param {Object} searchParams - Search parameters
     */
    searchCourts: async (searchParams) => {
        set({ isSearching: true, error: null });
        try {
            const results = await courtService.searchCourts(searchParams);
            set({
                searchResults: results,
                isSearching: false
            });
            return results;
        } catch (error) {
            console.error('Failed to search courts:', error);
            set({
                error: error.message || 'Search failed',
                isSearching: false,
                searchResults: []
            });
            throw error;
        }
    },

    /**
     * Clear search results
     */
    clearSearch: () => set({ searchResults: [], isSearching: false }),

    // ============================================
    // AVAILABILITY
    // ============================================

    /**
     * Fetch court availability for a date
     */
    fetchAvailability: async (courtId, date) => {
        set({ isLoading: true, error: null });
        try {
            const availability = await courtService.fetchCourtAvailability(courtId, date);
            set({
                availability,
                isLoading: false
            });
            return availability;
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            set({
                error: error.message || 'Failed to load availability',
                isLoading: false
            });
            throw error;
        }
    },

    // ============================================
    // FAVORITES
    // ============================================

    /**
     * Fetch user's favorite courts
     */
    fetchFavorites: async () => {
        set({ isLoading: true, error: null });
        try {
            const favorites = await courtService.fetchFavoriteCourts();
            set({
                favoriteCourts: favorites,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            set({
                error: error.message || 'Failed to load favorites',
                isLoading: false
            });
        }
    },

    /**
     * Toggle court favorite status
     */
    toggleFavorite: async (courtId) => {
        const isFavorite = get().favoriteCourts.some(c => c.id === courtId);
        const newStatus = !isFavorite;

        try {
            await courtService.toggleCourtFavorite(courtId, newStatus);

            if (newStatus) {
                // Add to favorites
                const court = get().courts.find(c => c.id === courtId) ||
                    get().searchResults.find(c => c.id === courtId);
                if (court) {
                    set(state => ({
                        favoriteCourts: [...state.favoriteCourts, court]
                    }));
                }
            } else {
                // Remove from favorites
                set(state => ({
                    favoriteCourts: state.favoriteCourts.filter(c => c.id !== courtId)
                }));
            }

            return newStatus;
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            throw error;
        }
    },

    /**
     * Check if court is favorited
     */
    isFavorite: (courtId) => {
        return get().favoriteCourts.some(c => c.id === courtId);
    },

    // ============================================
    // SELECTION & UI STATE
    // ============================================

    /**
     * Select a court
     */
    selectCourt: (court) => set({ selectedCourt: court }),

    /**
     * Clear selected court
     */
    clearSelectedCourt: () => set({ selectedCourt: null }),

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),

    /**
     * Reset store
     */
    reset: () => set({
        courts: [],
        favoriteCourts: [],
        searchResults: [],
        selectedCourt: null,
        availability: [],
        isLoading: false,
        isSearching: false,
        error: null,
        lastFetch: null,
    }),
}));

export default useCourtStore;
