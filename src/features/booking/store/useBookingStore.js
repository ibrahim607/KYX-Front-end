import { create } from 'zustand';

/**
 * Booking Store - Feature specific
 * Handles current booking draft, selected dates, and car selection.
 */
const useBookingStore = create((set) => ({
    selectedCar: null,
    pickupDate: null,
    returnDate: null,
    status: 'idle', // 'idle' | 'selecting' | 'confirming' | 'completed'

    // Actions
    selectCar: (car) => set({ selectedCar: car }),
    setDates: (pickup, returnDate) => set({ pickupDate: pickup, returnDate }),
    resetBooking: () => set({
        selectedCar: null,
        pickupDate: null,
        returnDate: null,
        status: 'idle'
    }),

    setStatus: (status) => set({ status }),
}));

export default useBookingStore;
