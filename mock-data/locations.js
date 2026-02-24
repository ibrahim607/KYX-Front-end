/**
 * Mock Locations Data
 * Based on KYX API OpenAPI Specification
 */

export const mockLocations = [
    {
        id: 1,
        city: 'Cairo',
        area: 'Nasr City',
    },
    {
        id: 2,
        city: 'Cairo',
        area: 'Maadi',
    },
    {
        id: 3,
        city: 'Cairo',
        area: 'Zamalek',
    },
    {
        id: 4,
        city: 'Cairo',
        area: 'Heliopolis',
    },
    {
        id: 5,
        city: 'Giza',
        area: '6th of October',
    },
    {
        id: 6,
        city: 'Giza',
        area: 'Sheikh Zayed',
    },
    {
        id: 7,
        city: 'New Cairo',
        area: 'Fifth Settlement',
    },
    {
        id: 8,
        city: 'New Cairo',
        area: 'Madinaty',
    },
    {
        id: 9,
        city: 'Alexandria',
        area: 'Smouha',
    },
    {
        id: 10,
        city: 'Alexandria',
        area: 'Stanley',
    },
];

/**
 * Get all locations
 */
export const getAllLocations = () => {
    return mockLocations;
};

/**
 * Get location by ID
 */
export const getLocationById = (id) => {
    return mockLocations.find(location => location.id === id);
};

/**
 * Get areas by city
 */
export const getAreasByCity = (city) => {
    return mockLocations.filter(location => location.city === city);
};

/**
 * Get all cities
 */
export const getAllCities = () => {
    const cities = [...new Set(mockLocations.map(location => location.city))];
    return cities;
};

/**
 * Get location string
 */
export const getLocationString = (locationId) => {
    const location = getLocationById(locationId);
    if (location) {
        return `${location.area}, ${location.city}`;
    }
    return 'Unknown Location';
};
