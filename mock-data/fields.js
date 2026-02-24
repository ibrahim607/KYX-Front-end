/**
 * Mock Fields Data
 * Based on KYX API OpenAPI Specification
 * Fields are football pitches/courts
 */

import { getLocationString } from './locations';

export const mockFields = [
    {
        id: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        ownerId: 'a230de79-bdd1-e818-d66c-fe881e7ddb9a',
        name: 'Cairo Stadium Pitch',
        description: 'Professional 5v5 football pitch with premium artificial turf and floodlights',
        pricePerHour: 300,
        locationId: 1,
        latitude: 30.0444,
        longitude: 31.2357,
        fieldStatus: 'Available', // Available, Maintenance, PendingApproval, Deleted
        rating: 4.8,
        reviews: 124,
        type: '5v5',
        image: { uri: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Water'],
    },
    {
        id: '9a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        ownerId: 'b340ef89-cee2-f929-e77d-gf992f8eec0b',
        name: 'Madinaty Sports Complex',
        description: 'Modern 7v7 pitch with excellent facilities and parking',
        pricePerHour: 450,
        locationId: 8,
        latitude: 30.0875,
        longitude: 31.6586,
        fieldStatus: 'Available',
        rating: 4.9,
        reviews: 89,
        type: '7v7',
        image: { uri: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Cafeteria', 'Water'],
    },
    {
        id: '1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
        ownerId: 'c450fg90-dff3-g030-f88e-hg003g9ffd1c',
        name: 'Heliopolis Arena',
        description: 'Full-size 11v11 pitch perfect for competitive matches',
        pricePerHour: 800,
        locationId: 4,
        latitude: 30.0808,
        longitude: 31.3220,
        fieldStatus: 'Available',
        rating: 4.7,
        reviews: 156,
        type: '11v11',
        image: { uri: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Seating', 'Water', 'First Aid'],
    },
    {
        id: '2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r',
        ownerId: 'd560gh01-egg4-h141-g99f-ih114h0gge2d',
        name: 'Zamalek Sports Club',
        description: 'Premium 5v5 pitch in the heart of Zamalek',
        pricePerHour: 600,
        locationId: 3,
        latitude: 30.0626,
        longitude: 31.2197,
        fieldStatus: 'Available',
        rating: 4.9,
        reviews: 203,
        type: '5v5',
        image: { uri: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Cafeteria', 'Water', 'Showers'],
    },
    {
        id: '3d4e5f6g-7h8i-9j0k-1l2m-3n4o5p6q7r8s',
        ownerId: 'e670hi12-fhh5-i252-h00g-ji225i1hhf3e',
        name: 'New Cairo Sports Hub',
        description: 'State-of-the-art 7v7 facility with modern amenities',
        pricePerHour: 350,
        locationId: 7,
        latitude: 30.0131,
        longitude: 31.4767,
        fieldStatus: 'Available',
        rating: 4.6,
        reviews: 78,
        type: '7v7',
        image: { uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Water'],
    },
    {
        id: '4e5f6g7h-8i9j-0k1l-2m3n-4o5p6q7r8s9t',
        ownerId: 'f780ij23-gii6-j363-i11h-kj336j2iig4f',
        name: '6th October Arena',
        description: 'Large 11v11 pitch with excellent grass quality',
        pricePerHour: 700,
        locationId: 5,
        latitude: 29.9668,
        longitude: 30.9246,
        fieldStatus: 'Maintenance',
        rating: 4.5,
        reviews: 92,
        type: '11v11',
        image: { uri: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Seating'],
    },
    {
        id: '5f6g7h8i-9j0k-1l2m-3n4o-5p6q7r8s9t0u',
        ownerId: 'g890jk34-hjj7-k474-j22i-lk447k3jjh5g',
        name: 'Maadi Football Ground',
        description: 'Cozy 5v5 pitch perfect for friendly matches',
        pricePerHour: 250,
        locationId: 2,
        latitude: 29.9602,
        longitude: 31.2569,
        fieldStatus: 'Available',
        rating: 4.4,
        reviews: 67,
        type: '5v5',
        image: { uri: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Water'],
    },
    {
        id: '6g7h8i9j-0k1l-2m3n-4o5p-6q7r8s9t0u1v',
        ownerId: 'h901kl45-ikk8-l585-k33j-ml558l4kkj6h',
        name: 'Sheikh Zayed Complex',
        description: 'Multi-purpose 7v7 facility with top-notch services',
        pricePerHour: 500,
        locationId: 6,
        latitude: 30.0181,
        longitude: 30.9714,
        fieldStatus: 'Available',
        rating: 4.8,
        reviews: 145,
        type: '7v7',
        image: { uri: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800' },
        amenities: ['Parking', 'Changing Rooms', 'Lighting', 'Cafeteria', 'Water', 'Showers'],
    },
];

/**
 * Get all fields with display-friendly properties
 */
export const getAllFields = () => {
    return mockFields.map(field => ({
        ...field,
        // Add display-friendly properties for backward compatibility
        location: getLocationString(field.locationId),
        price: field.pricePerHour,
        priceUnit: 'EGP/hour',
        available: field.fieldStatus === 'Available',
    }));
};

/**
 * Get field by ID with display-friendly properties
 */
export const getFieldById = (id) => {
    const field = mockFields.find(field => field.id === id);
    if (!field) return null;

    return {
        ...field,
        location: getLocationString(field.locationId),
        price: field.pricePerHour,
        priceUnit: 'EGP/hour',
        available: field.fieldStatus === 'Available',
    };
};

/**
 * Search fields by name, location, or type
 */
export const searchFields = (query) => {
    const lowerQuery = query.toLowerCase();
    return mockFields
        .filter(field =>
            field.name.toLowerCase().includes(lowerQuery) ||
            getLocationString(field.locationId).toLowerCase().includes(lowerQuery) ||
            field.type.toLowerCase().includes(lowerQuery)
        )
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: field.fieldStatus === 'Available',
        }));
};

/**
 * Filter fields by type
 */
export const filterFieldsByType = (type) => {
    return mockFields
        .filter(field => field.type === type)
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: field.fieldStatus === 'Available',
        }));
};

/**
 * Get available fields only
 */
export const getAvailableFields = () => {
    return mockFields
        .filter(field => field.fieldStatus === 'Available')
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: true,
        }));
};

/**
 * Filter fields by price range
 */
export const getFieldsByPriceRange = (minPrice, maxPrice) => {
    return mockFields
        .filter(field =>
            field.pricePerHour >= minPrice && field.pricePerHour <= maxPrice
        )
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: field.fieldStatus === 'Available',
        }));
};

/**
 * Filter fields by location
 */
export const getFieldsByLocation = (locationId) => {
    return mockFields
        .filter(field => field.locationId === locationId)
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: field.fieldStatus === 'Available',
        }));
};

/**
 * Get fields by owner
 */
export const getFieldsByOwner = (ownerId) => {
    return mockFields
        .filter(field => field.ownerId === ownerId)
        .map(field => ({
            ...field,
            location: getLocationString(field.locationId),
            price: field.pricePerHour,
            priceUnit: 'EGP/hour',
            available: field.fieldStatus === 'Available',
        }));
};
