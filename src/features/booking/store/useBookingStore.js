import { create } from 'zustand';
import { BOOKING_STATUS } from '../constants/bookingStatus';

/**
 * Booking Store - Feature specific
 * Handles current booking draft, selected dates, and car selection.
 */
const useBookingStore = create((set) => ({
    selectedCar: null,
    pickupDate: null,
    returnDate: null,
    status: BOOKING_STATUS.IDLE,

    // Actions
    selectCar: (car) => set({ selectedCar: car }),
    setDates: (pickup, returnDate) => set({ pickupDate: pickup, returnDate }),
    resetBooking: () => set({
        selectedCar: null,
        pickupDate: null,
        returnDate: null,
        status: BOOKING_STATUS.IDLE
    }),

    setStatus: (status) => set({ status }),
}));

export default useBookingStore;
