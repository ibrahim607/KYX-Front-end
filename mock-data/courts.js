/**
 * Courts Mock Data (Backward Compatibility)
 * This file redirects to fields.js for backward compatibility
 * The API uses "fields" terminology, but we keep "courts" for existing code
 */

import { filterFieldsByType, getAllFields, getAvailableFields, getFieldById, getFieldsByLocation, getFieldsByPriceRange, searchFields } from './fields';

// Export formatted courts (with display properties)
export const mockCourts = getAllFields();

// Re-export functions with courts naming
export const getAllCourts = getAllFields;
export const getCourtById = getFieldById;
export const searchCourts = searchFields;
export const filterCourtsByType = filterFieldsByType;
export const getAvailableCourts = getAvailableFields;
export const getCourtsByPriceRange = getFieldsByPriceRange;
export const getCourtsByLocation = getFieldsByLocation;
