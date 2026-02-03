import axios from 'axios';

// TODO: Replace with your actual API base URL
const API_BASE_URL = 'https://your-api-url.com/api';

/**
 * Search Service
 * Handles all search-related API calls
 */
export const searchService = {
    /**
     * Search pitches with filters
     * @param {Object} params - Search parameters
     * @param {string} params.query - Search query string
     * @param {string} params.location - Location filter
     * @param {string} params.date - Date filter
     * @param {number} params.minPrice - Minimum price filter
     * @param {number} params.maxPrice - Maximum price filter
     * @param {string} params.pitchType - Type of pitch (e.g., '5v5', '7v7', '11v11')
     * @param {number} params.page - Page number for pagination
     * @param {number} params.limit - Number of results per page
     * @returns {Promise} API response with search results
     */
    searchPitches: async (params) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pitches/search`, {
                params: {
                    q: params.query,
                    location: params.location,
                    date: params.date,
                    minPrice: params.minPrice,
                    maxPrice: params.maxPrice,
                    pitchType: params.pitchType,
                    page: params.page || 1,
                    limit: params.limit || 10,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Search pitches error:', error);
            throw error;
        }
    },

    /**
     * Get search suggestions/autocomplete
     * @param {string} query - Search query string
     * @returns {Promise} API response with suggestions
     */
    getSuggestions: async (query) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pitches/suggestions`, {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error('Get suggestions error:', error);
            throw error;
        }
    },

    /**
     * Get popular/trending pitches
     * @returns {Promise} API response with popular pitches
     */
    getPopularPitches: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pitches/popular`);
            return response.data;
        } catch (error) {
            console.error('Get popular pitches error:', error);
            throw error;
        }
    },

    /**
     * Get nearby pitches based on location
     * @param {Object} location - Location coordinates
     * @param {number} location.latitude - Latitude
     * @param {number} location.longitude - Longitude
     * @param {number} radius - Search radius in kilometers
     * @returns {Promise} API response with nearby pitches
     */
    getNearbyPitches: async (location, radius = 5) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pitches/nearby`, {
                params: {
                    lat: location.latitude,
                    lng: location.longitude,
                    radius,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Get nearby pitches error:', error);
            throw error;
        }
    },
};
