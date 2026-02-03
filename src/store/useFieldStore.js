import { create } from 'zustand';
import { courtService } from '../api/courtService';

/**
 * Store for managing fields, court details, search results, and favorites.
 */
const useFieldStore = create((set, get) => ({
    fields: [],           // List of fields (search results)
    featuredFields: [],   // List of fields to show on home screen
    selectedField: null,  // Detailed view of a specific field
    favorites: [],        // User's favorite fields/courts
    isLoading: false,
    error: null,

    // Search filters state
    filters: {
        location: null,
        date: null,
        sportType: null,
        priceRange: null,
    },

    // Actions

    // Fetch fields based on current filters or default
    fetchFields: async (searchParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            // Merge current filters with new params if needed, or just use params
            const fields = await courtService.searchCourts(searchParams);
            set({ fields, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch fields:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch details for a single field
    fetchFieldDetails: async (fieldId) => {
        set({ isLoading: true, error: null, selectedField: null });
        try {
            const field = await courtService.fetchCourtById(fieldId);
            set({ selectedField: field, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch field details:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch available time slots for the selected field on a specific date
    fetchFieldAvailability: async (fieldId, date) => {
        // This might update the selectedField object or a separate state
        set({ isLoading: true, error: null });
        try {
            const availability = await courtService.fetchCourtAvailability(fieldId, date);

            // Update the selectedField with availability data if it exists
            const currentField = get().selectedField;
            if (currentField && currentField.id === fieldId) {
                set({
                    selectedField: { ...currentField, availability },
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Toggle favorite status
    toggleFavorite: async (fieldId) => {
        const isFavorite = get().favorites.some(f => f.id === fieldId);

        try {
            // Optimistic update
            const newFavorites = isFavorite
                ? get().favorites.filter(f => f.id !== fieldId)
                : [...get().favorites, { id: fieldId }]; // In read app, you'd add the full object or refetch

            set({ favorites: newFavorites });

            await courtService.toggleCourtFavorite(fieldId, !isFavorite);

            // Ideally refetch favorites to ensure sync
            get().fetchFavorites();
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert on error
            // set({ favorites: ... }) 
        }
    },

    fetchFavorites: async () => {
        try {
            const favorites = await courtService.fetchFavoriteCourts();
            set({ favorites });
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    },

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    clearFilters: () => set({
        filters: { location: null, date: null, sportType: null, priceRange: null }
    }),
}));

export default useFieldStore;
