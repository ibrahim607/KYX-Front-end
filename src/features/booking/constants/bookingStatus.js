/**
 * Booking Status Constants
 * Centralized status values to avoid typos and ensure consistency
 */
export const BOOKING_STATUS = {
    IDLE: 'idle',
    SELECTING: 'selecting',
    CONFIRMING: 'confirming',
    COMPLETED: 'completed',
};

// Optional: Helper to validate status
export const isValidBookingStatus = (status) => {
    return Object.values(BOOKING_STATUS).includes(status);
};
