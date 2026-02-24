import { mockFields } from '../../mock-data/fields';

// ============================================
// TOGGLE THIS FLAG TO SWITCH BETWEEN MOCK AND REAL API
// ============================================
const USE_MOCK_DATA = true;

// Real API base URL (only used when USE_MOCK_DATA = false)
const API_BASE_URL = 'https://your-api-url.com/api';

/**
 * Search Service
 * Handles all search-related API calls
 */
export const searchService = {
    /**
     * Search pitches with filters
     */
    searchPitches: async (params) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 600));
            let results = [...mockFields];

            if (params.query) {
                const q = params.query.toLowerCase();
                results = results.filter(f =>
                    f.name?.toLowerCase().includes(q) ||
                    f.location?.toLowerCase().includes(q)
                );
            }
            if (params.location) {
                results = results.filter(f =>
                    f.location?.toLowerCase().includes(params.location.toLowerCase())
                );
            }
            if (params.pitchType) {
                results = results.filter(f => f.type === params.pitchType);
            }
            if (params.minPrice !== undefined) {
                results = results.filter(f => f.pricePerHour >= params.minPrice);
            }
            if (params.maxPrice !== undefined) {
                results = results.filter(f => f.pricePerHour <= params.maxPrice);
            }
            return { data: results, total: results.length };
        }

        const { default: axios } = await import('axios');
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
     */
    getSuggestions: async (query) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const q = query.toLowerCase();
            const suggestions = mockFields
                .filter(f =>
                    f.name?.toLowerCase().includes(q) ||
                    f.location?.toLowerCase().includes(q)
                )
                .slice(0, 5)
                .map(f => ({ id: f.id, name: f.name, location: f.location }));
            return suggestions;
        }

        const { default: axios } = await import('axios');
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
     */
    getPopularPitches: async () => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 400));
            // Return top 5 fields by rating as "popular"
            return [...mockFields]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);
        }

        const { default: axios } = await import('axios');
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
     */
    getNearbyPitches: async (location, radius = 5) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // In mock mode, return all fields as "nearby"
            return mockFields.slice(0, 6);
        }

        const { default: axios } = await import('axios');
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
