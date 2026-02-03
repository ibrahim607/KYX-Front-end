import { fetchCourtAvailability, fetchCourtById, fetchCourts, fetchFavoriteCourts, fetchFields, searchCourts, toggleCourtFavorite } from '../courtService';

jest.mock('../client');

// Similar to bookingService, courtService has USE_MOCK_DATA = true.
// We will test the returns of the functions in this mode.

describe('courtService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchCourts (Mock Mode)', () => {
        it('should return an array of courts', async () => {
            const result = await fetchCourts();
            expect(Array.isArray(result)).toBe(true);
            if (result.length > 0) {
                expect(result[0]).toHaveProperty('id');
                expect(result[0]).toHaveProperty('name');
            }
        });
    });

    describe('fetchFields (Mock Mode)', () => {
        it('should return an array of fields', async () => {
            const result = await fetchFields();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('fetchCourtById (Mock Mode)', () => {
        it('should return a court object if found', async () => {
            // We need a valid ID from the mock data. Assuming '1' or similar might exist.
            // Actually, we can fetch all courts first to get a valid ID.
            const courts = await fetchCourts();
            if (courts.length > 0) {
                const validId = courts[0].id;
                const result = await fetchCourtById(validId);
                expect(result.id).toBe(validId);
            } else {
                // If no mock data, skip effectively
                // But usually mock data exists.
            }
        });

        it('should throw error if court not found', async () => {
            await expect(fetchCourtById('invalid-id-999')).rejects.toThrow('Court not found');
        });
    });

    describe('searchCourts (Mock Mode)', () => {
        it('should return results array', async () => {
            const params = { location: 'test' };
            const result = await searchCourts(params);
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('fetchCourtAvailability (Mock Mode)', () => {
        it('should return array of slots', async () => {
            const result = await fetchCourtAvailability('c1', '2025-01-01');
            expect(Array.isArray(result)).toBe(true);
            if (result.length > 0) {
                expect(result[0]).toHaveProperty('startTime');
                expect(result[0]).toHaveProperty('available');
            }
        });
    });

    describe('toggleCourtFavorite (Mock Mode)', () => {
        it('should return success object', async () => {
            const result = await toggleCourtFavorite('c1', true);
            expect(result).toEqual({ courtId: 'c1', isFavorite: true, success: true });
        });
    });

    describe('fetchFavoriteCourts (Mock Mode)', () => {
        it('should return array of favorite courts', async () => {
            const result = await fetchFavoriteCourts();
            expect(Array.isArray(result)).toBe(true);
        });
    });

});
