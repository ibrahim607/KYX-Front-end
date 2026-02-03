import { create } from 'zustand';
import {
    cancelBooking as apiCancelBooking,
    createBooking as apiCreateBooking,
    fetchUpcomingBookings,
    fetchUserBookings
} from '../api/bookingService';

/**
 * Store for managing user bookings and the booking creation flow (cart/draft).
 */
const useBookingStore = create((set, get) => ({
    upcomingBookings: [],
    historyBookings: [],
    currentBooking: null,  // Details of a specific booking being viewed

    // Booking Draft (The "Cart" state)
    bookingDraft: {
        fieldId: null,
        fieldName: null,
        date: null,
        timeSlot: null,
        price: 0,
    },

    isLoading: false,
    error: null,

    // Actions

    // Fetch all user bookings
    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const bookings = await fetchUserBookings();

            // Separate into upcoming and history (assuming backend returns a flat list, 
            // or we could use specific endpoints if available)
            const now = new Date();
            const upcoming = bookings.filter(b => new Date(b.date) >= now);
            const history = bookings.filter(b => new Date(b.date) < now);

            set({
                upcomingBookings: upcoming,
                historyBookings: history,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    fetchUpcomingOnly: async () => {
        set({ isLoading: true, error: null });
        try {
            const upcoming = await fetchUpcomingBookings();
            set({ upcomingBookings: upcoming, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Helper to start a booking flow
    initBooking: (field) => {
        set({
            bookingDraft: {
                fieldId: field.id,
                fieldName: field.name,
                price: field.pricePerHour1 || 0, // Fallback
                date: null,
                timeSlot: null,
            },
            error: null,
        });
    },

    updateBookingDraft: (data) => {
        set((state) => ({
            bookingDraft: { ...state.bookingDraft, ...data }
        }));
    },

    clearBookingDraft: () => {
        set({
            bookingDraft: {
                fieldId: null,
                fieldName: null,
                date: null,
                timeSlot: null,
                price: 0,
            }
        });
    },

    // Confirm/Submit the booking
    submitBooking: async () => {
        const { bookingDraft } = get();
        if (!bookingDraft.fieldId || !bookingDraft.date || !bookingDraft.timeSlot) {
            set({ error: "Incomplete booking details" });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            await apiCreateBooking(bookingDraft);
            set({ isLoading: false });
            // Refresh bookings to show the new one
            await get().fetchUpcomingOnly();
            // Clear draft
            get().clearBookingDraft();
            return true; // Success
        } catch (error) {
            console.error('Failed to create booking:', error);
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    // Cancel a booking
    cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
            await apiCancelBooking(bookingId);
            // Refresh list
            await get().fetchUpcomingOnly();
            set({ isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));

export default useBookingStore;
