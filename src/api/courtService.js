import client from './client';
import { ENDPOINTS } from './endpoints';

// ============================================
// TOGGLE THIS FLAG TO SWITCH BETWEEN MOCK AND REAL API
// ============================================
const USE_MOCK_DATA = true;

// Mock data imports
import { mockCourts } from '../../mock-data/courts';
import { mockFields } from '../../mock-data/fields';

/**
 * Court/Field Service
 * Handles all court and field-related API calls
 * 
 * EASY API MIGRATION:
 * 1. Set USE_MOCK_DATA = false
 * 2. Ensure ENDPOINTS are configured in endpoints.js
 * 3. All components using this service will automatically use real API
 */

/**
 * Get all available courts
 * @returns {Promise<Array>} List of courts
 */
export const fetchCourts = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockCourts;
    }

    const response = await client.get(ENDPOINTS.COURTS);
    return response.data;
};

/**
 * Get all available fields
 * @returns {Promise<Array>} List of fields
 */
export const fetchFields = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockFields;
    }

    const response = await client.get(ENDPOINTS.FIELDS);
    return response.data;
};

/**
 * Get court by ID
 * @param {string} courtId - Court ID
 * @returns {Promise<Object>} Court details
 */
export const fetchCourtById = async (courtId) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const court = mockCourts.find(c => c.id === courtId);
        if (!court) throw new Error('Court not found');
        return court;
    }

    const response = await client.get(`${ENDPOINTS.COURTS}/${courtId}`);
    return response.data;
};

/**
 * Search courts/fields
 * @param {Object} searchParams - Search parameters (location, date, time, etc.)
 * @returns {Promise<Array>} Search results
 */
export const searchCourts = async (searchParams) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simple mock search logic
        let results = [...mockCourts];

        if (searchParams.location) {
            results = results.filter(court =>
                court.location?.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }

        if (searchParams.date) {
            // Mock: just return all courts for any date
            // In real API, this would check availability
        }

        return results;
    }

    const response = await client.post(ENDPOINTS.FIELDS_SEARCH, searchParams);
    return response.data;
};

/**
 * Get court availability for a specific date
 * @param {string} courtId - Court ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Array>} Available time slots
 */
export const fetchCourtAvailability = async (courtId, date) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock available slots
        return [
            { id: 'slot1', startTime: '08:00', endTime: '10:00', available: true },
            { id: 'slot2', startTime: '10:00', endTime: '12:00', available: true },
            { id: 'slot3', startTime: '12:00', endTime: '14:00', available: false },
            { id: 'slot4', startTime: '14:00', endTime: '16:00', available: true },
            { id: 'slot5', startTime: '16:00', endTime: '18:00', available: true },
            { id: 'slot6', startTime: '18:00', endTime: '20:00', available: false },
            { id: 'slot7', startTime: '20:00', endTime: '22:00', available: true },
        ];
    }

    const response = await client.get(`${ENDPOINTS.COURTS}/${courtId}/availability`, {
        params: { date }
    });
    return response.data;
};

/**
 * Toggle court favorite status
 * @param {string} courtId - Court ID
 * @param {boolean} isFavorite - New favorite status
 * @returns {Promise<Object>} Updated favorite status
 */
export const toggleCourtFavorite = async (courtId, isFavorite) => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { courtId, isFavorite, success: true };
    }

    const endpoint = isFavorite
        ? `${ENDPOINTS.COURTS}/${courtId}/favorite`
        : `${ENDPOINTS.COURTS}/${courtId}/unfavorite`;

    const response = await client.post(endpoint);
    return response.data;
};

/**
 * Get user's favorite courts
 * NOTE: In mock mode, favorites are stored in-memory only
 * When backend is ready, this will fetch from API
 * @returns {Promise<Array>} List of favorite courts
 */
export const fetchFavoriteCourts = async () => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        // Return empty array - favorites are managed in store state
        return [];
    }

    const response = await client.get(`${ENDPOINTS.COURTS}/favorites`);
    return response.data;
};
