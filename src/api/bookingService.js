import client from './client';
import { ENDPOINTS } from './endpoints';

// ============================================
// TOGGLE THIS FLAG TO SWITCH BETWEEN MOCK AND REAL API
// ============================================
const USE_MOCK_DATA = true;

// Mock data imports (only used when USE_MOCK_DATA = true)
import {
    getAllBookingsWithDetails,
    getBookingById as getMockBookingById,
    getUpcomingBookings as getMockUpcomingBookings,
} from '../../mock-data/bookings';

/**
 * Booking Service
 * Handles all booking-related API calls
 * 
 * EASY API MIGRATION:
 * 1. Set USE_MOCK_DATA = false
 * 2. Ensure ENDPOINTS are configured in endpoints.js
 * 3. All components using this service will automatically use real API
 */

/**
 * Get all bookings for the current user
 * @returns {Promise<Array>} List of bookings with details
 */
export const fetchUserBookings = async () => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return getAllBookingsWithDetails();
    }

    const response = await client.get(ENDPOINTS.BOOKINGS);
    return response.data;
};

/**
 * Get upcoming bookings only
 * @returns {Promise<Array>} List of upcoming bookings
 */
export const fetchUpcomingBookings = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockUpcomingBookings();
    }

    const response = await client.get(ENDPOINTS.BOOKINGS_UPCOMING);
    return response.data;
};

/**
 * Get a single booking by ID
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object>} Booking details
 */
export const fetchBookingById = async (bookingId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const booking = getMockBookingById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        return booking;
    }

    const response = await client.get(`${ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (bookingData) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Simulate successful creation
        return {
            id: `mock-${Date.now()}`,
            ...bookingData,
            status: 'Confirmed',
            createdAt: new Date().toISOString(),
        };
    }

    const response = await client.post(ENDPOINTS.BOOKINGS, bookingData);
    return response.data;
};

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID to cancel
 * @returns {Promise<Object>} Cancellation confirmation
 */
export const cancelBooking = async (bookingId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            success: true,
            message: 'Booking cancelled successfully',
            bookingId,
        };
    }

    const response = await client.delete(`${ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
};

/**
 * Update a booking
 * @param {string} bookingId - The booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated booking
 */
export const updateBooking = async (bookingId, updateData) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return {
            id: bookingId,
            ...updateData,
            updatedAt: new Date().toISOString(),
        };
    }

    const response = await client.patch(`${ENDPOINTS.BOOKINGS}/${bookingId}`, updateData);
    return response.data;
};

/**
 * Get bookings by date range
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Bookings in date range
 */
export const fetchBookingsByDateRange = async (fromDate, toDate) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { getBookingsByDateRange } = require('../../mock-data/bookings');
        return getBookingsByDateRange(fromDate, toDate);
    }

    const response = await client.get(ENDPOINTS.BOOKINGS, {
        params: { fromDate, toDate }
    });
    return response.data;
};
