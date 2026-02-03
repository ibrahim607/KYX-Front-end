import { create } from 'zustand';
import * as bookingService from '../../../api/bookingService';

/**
 * Booking Store - Manages all user bookings
 * 
 * This store handles:
 * - Fetching and displaying user bookings
 * - Creating new bookings
 * - Cancelling bookings
 * - Loading and error states
 * 
 * EASY API MIGRATION:
 * When backend is ready, just toggle USE_MOCK_DATA in bookingService.js
 */
const useBookingStore = create((set, get) => ({
    // State
    bookings: [],
    selectedBooking: null,
    isLoading: false,
    error: null,
    lastFetch: null,

    // ============================================
    // FETCH BOOKINGS
    // ============================================

    /**
     * Fetch all user bookings
     */
    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const bookings = await bookingService.fetchUserBookings();
            set({
                bookings,
                isLoading: false,
                lastFetch: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            set({
                error: error.message || 'Failed to load bookings',
                isLoading: false
            });
        }
    },

    /**
     * Fetch upcoming bookings only
     */
    fetchUpcomingBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const bookings = await bookingService.fetchUpcomingBookings();
            set({
                bookings,
                isLoading: false,
                lastFetch: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to fetch upcoming bookings:', error);
            set({
                error: error.message || 'Failed to load bookings',
                isLoading: false
            });
        }
    },

    /**
     * Refresh bookings (force refetch)
     */
    refreshBookings: async () => {
        await get().fetchBookings();
    },

    // ============================================
    // CREATE BOOKING
    // ============================================

    /**
     * Create a new booking
     * @param {Object} bookingData - Booking details
     */
    createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
            const newBooking = await bookingService.createBooking(bookingData);

            // Add to local state
            set(state => ({
                bookings: [...state.bookings, newBooking],
                isLoading: false
            }));

            return newBooking;
        } catch (error) {
            console.error('Failed to create booking:', error);
            set({
                error: error.message || 'Failed to create booking',
                isLoading: false
            });
            throw error;
        }
    },

    // ============================================
    // CANCEL BOOKING
    // ============================================

    /**
     * Cancel a booking
     * @param {string} bookingId - ID of booking to cancel
     */
    cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
            await bookingService.cancelBooking(bookingId);

            // Remove from local state
            set(state => ({
                bookings: state.bookings.filter(b => b.id !== bookingId),
                isLoading: false
            }));

            return true;
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            set({
                error: error.message || 'Failed to cancel booking',
                isLoading: false
            });
            throw error;
        }
    },

    // ============================================
    // UPDATE BOOKING
    // ============================================

    /**
     * Update a booking
     * @param {string} bookingId - ID of booking to update
     * @param {Object} updateData - Data to update
     */
    updateBooking: async (bookingId, updateData) => {
        set({ isLoading: true, error: null });
        try {
            const updatedBooking = await bookingService.updateBooking(bookingId, updateData);

            // Update in local state
            set(state => ({
                bookings: state.bookings.map(b =>
                    b.id === bookingId ? { ...b, ...updatedBooking } : b
                ),
                isLoading: false
            }));

            return updatedBooking;
        } catch (error) {
            console.error('Failed to update booking:', error);
            set({
                error: error.message || 'Failed to update booking',
                isLoading: false
            });
            throw error;
        }
    },

    // ============================================
    // SELECTION & UI STATE
    // ============================================

    /**
     * Select a booking for viewing details
     */
    selectBooking: (booking) => set({ selectedBooking: booking }),

    /**
     * Clear selected booking
     */
    clearSelectedBooking: () => set({ selectedBooking: null }),

    /**
     * Clear error message
     */
    clearError: () => set({ error: null }),

    /**
     * Reset entire store
     */
    reset: () => set({
        bookings: [],
        selectedBooking: null,
        isLoading: false,
        error: null,
        lastFetch: null,
    }),
}));

export default useBookingStore;
