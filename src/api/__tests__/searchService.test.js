import axios from 'axios';
import { searchService } from '../searchService';

// searchService uses axios directly, not the client wrapper in some places or maybe it does?
// File view shows: import axios from 'axios';
// So we must mock axios.

describe('searchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchPitches', () => {
        it('should call api with correct params', async () => {
            const mockData = { data: 'results' };
            axios.get.mockResolvedValue({ data: mockData });

            const params = {
                query: 'football',
                location: 'London',
                page: 1
            };

            const result = await searchService.searchPitches(params);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/pitches/search'), {
                params: expect.objectContaining({
                    q: 'football',
                    location: 'London'
                })
            });
            expect(result).toEqual(mockData);
        });

        it('should handle errors', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));
            await expect(searchService.searchPitches({})).rejects.toThrow('Network Error');
        });
    });

    describe('getSuggestions', () => {
        it('should fetch suggestions', async () => {
            const mockData = ['res1', 'res2'];
            axios.get.mockResolvedValue({ data: mockData });

            const result = await searchService.getSuggestions('foo');

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/pitches/suggestions'), {
                params: { q: 'foo' }
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('getNearbyPitches', () => {
        it('should fetch nearby pitches', async () => {
            const mockData = [];
            axios.get.mockResolvedValue({ data: mockData });

            const loc = { latitude: 10, longitude: 20 };
            await searchService.getNearbyPitches(loc, 10);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/pitches/nearby'), {
                params: {
                    lat: 10,
                    lng: 20,
                    radius: 10
                }
            });
        });
    });
});
