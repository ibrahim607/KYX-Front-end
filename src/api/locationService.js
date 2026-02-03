import client from './client';
import { ENDPOINTS } from './endpoints';

// ============================================
// TOGGLE THIS FLAG TO SWITCH BETWEEN MOCK AND REAL API
// ============================================
const USE_MOCK_DATA = true;

/**
 * Location Service
 * Handles fetching locations (cities, areas)
 */
export const locationService = {
    /**
     * Get all cities
     * @returns {Promise<Array>} List of cities
     */
    fetchCities: async () => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Mock data
            return [
                { id: '1', name: 'Cairo' },
                { id: '2', name: 'Alexandria' },
                { id: '3', name: 'Giza' }
            ];
        }

        const response = await client.get(ENDPOINTS.LOCATIONS);
        return response.data;
    },

    /**
     * Get areas for a specific city
     * @param {string} city - The city name or ID
     * @returns {Promise<Array>} List of areas
     */
    fetchAreasByCity: async (city) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Mock data based on city
            if (city === 'Cairo' || city.name === 'Cairo') {
                return [
                    { id: '101', name: 'Maadi' },
                    { id: '102', name: 'Nasr City' },
                    { id: '103', name: 'New Cairo' }
                ];
            }
            return [];
        }

        // Endpoint usage depends on how your API is structured. 
        // Based on OpenAPI: /api/locations/:city
        const response = await client.get(`${ENDPOINTS.LOCATIONS}/${typeof city === 'object' ? city.name : city}`);
        return response.data;
    },
};
