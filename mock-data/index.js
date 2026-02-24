/**
 * Mock Data Index
 * Central export point for all mock data
 * Based on KYX API OpenAPI Specification
 */

// Locations
export * from './locations';

// Fields (Football Pitches/Courts)
export * from './fields';

// Users
export * from './user';

// Bookings
export * from './bookings';

// Slots (Time slots and availability)
export * from './slots';

// Re-export for backward compatibility
export { filterFieldsByType as filterCourtsByType, getAllFields as getAllCourts, getAvailableFields as getAvailableCourts, getFieldById as getCourtById, getFieldsByPriceRange as getCourtsByPriceRange, mockFields as mockCourts, searchFields as searchCourts } from './fields';

