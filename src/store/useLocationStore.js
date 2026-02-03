import * as Location from 'expo-location';
import { create } from 'zustand';
import { locationService } from '../api/locationService';

/**
 * Store for managing location data (cities, areas) and user's selected location.
 */
const useLocationStore = create((set, get) => ({
    cities: [],
    areas: [],
    selectedCity: null, // e.g., { id: 1, name: 'Cairo' } or just 'Cairo'
    selectedArea: null,
    currentLocation: null, // { latitude, longitude, address }
    isLoading: false,
    error: null,

    // Actions

    // Fetch all available cities
    fetchCities: async () => {
        set({ isLoading: true, error: null });
        try {
            const cities = await locationService.fetchCities();
            set({ cities, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch areas for a specific city
    fetchAreas: async (city) => {
        if (!city) return;

        set({ isLoading: true, error: null });
        try {
            const areas = await locationService.fetchAreasByCity(city);
            set({ areas, isLoading: false });
        } catch (error) {
            console.error(`Failed to fetch areas for ${city}:`, error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Get device location using GPS
    getCurrentDeviceLocation: async () => {
        set({ isLoading: true, error: null });
        try {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                set({
                    error: 'Location permission denied',
                    isLoading: false
                });
                return null;
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            // Reverse geocode to get address
            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const locationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: address,
                // Format area name from address
                area: address?.district || address?.subregion || address?.city || 'Unknown Area',
                city: address?.city || address?.region || 'Unknown City',
            };

            set({
                currentLocation: locationData,
                selectedArea: locationData.area,
                selectedCity: locationData.city,
                isLoading: false
            });

            return locationData;
        } catch (error) {
            console.error('Failed to get device location:', error);
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    // Set the user's current location manually
    setLocation: (city, area = null) => {
        set({ selectedCity: city, selectedArea: area });
        // Optionally fetch areas for the new city automatically
        if (city) {
            get().fetchAreas(city);
        }
    },

    // Clear location selection
    clearLocation: () => set({
        selectedCity: null,
        selectedArea: null,
        currentLocation: null,
        areas: []
    }),
}));

export default useLocationStore;
