import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { colors } from '../../../assets/theme/colors';
import CourtCard from '../components/CourtCard';
import HomeHeader from '../components/HomeHeader';
import LocationSelector from '../components/LocationSelector';
import SearchSection from '../components/SearchSection';
import useCourtStore from '../store/useCourtStore';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();


    // ============================================
    // STATE
    // ============================================
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLocationExpanded, setIsLocationExpanded] = useState(false);

    // ============================================
    // ZUSTAND STATE
    // ============================================
    const {
        courts,
        searchResults,
        isLoading,
        isSearching,
        fetchCourts,
        searchCourts,
        clearSearch,
        toggleFavorite,
        isFavorite,
    } = useCourtStore();

    // ============================================
    // EFFECTS
    // ============================================

    // Fetch courts on mount
    useEffect(() => {
        fetchCourts();
    }, []);

    // ============================================
    // HELPERS
    // ============================================

    const getDisplayLocation = () => {
        if (selectedLocation) {
            return `${selectedLocation.area}, ${selectedLocation.city}`;
        }
        return 'Select Location';
    };

    // ============================================
    // HANDLERS
    // ============================================

    const handleLocationPress = () => {
        setIsLocationExpanded(!isLocationExpanded);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsLocationExpanded(false);
        // Filter courts by selected location
        searchCourts({ location: `${location.area}, ${location.city}` });
    };

    const handleClearLocation = () => {
        setSelectedLocation(null);
        setIsLocationExpanded(false);
        clearSearch();
    };

    const handleCourtPress = (court) => {
        navigation.navigate('PitchDetails', { pitchId: court.id });
    };

    const handleLikePress = async (courtId, isLiked) => {
        try {
            await toggleFavorite(courtId);
            console.log(`Court ${courtId} ${isLiked ? 'unliked' : 'liked'}`);
        } catch (error) {
            console.error('Failed to update favorites:', error);
        }
    };

    const handleSearch = async (searchParams) => {
        try {
            await searchCourts(searchParams);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleClearSearch = () => {
        clearSearch();
    };

    // ============================================
    // RENDER HELPERS
    // ============================================

    const renderCourtList = (courtList) => (
        courtList.map((court) => (
            <CourtCard
                key={court.id}
                court={court}
                onPress={handleCourtPress}
                onLikePress={handleLikePress}
                isLiked={isFavorite(court.id)}
            />
        ))
    );

    // ============================================
    // RENDER
    // ============================================

    return (
        <View style={styles.container}>
            <HomeHeader
                location={getDisplayLocation()}
                onLocationPress={handleLocationPress}
            />

            {/* Location Selector Component */}
            <LocationSelector
                courts={courts}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                onClear={handleClearLocation}
                isExpanded={isLocationExpanded}
            />

            <SearchSection
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isSearching}
            />
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Loading State */}
                {(isLoading || isSearching) && courts.length === 0 && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>
                            {isSearching ? 'Searching...' : 'Loading pitches...'}
                        </Text>
                    </View>
                )}

                {/* Search Results */}
                {!isSearching && searchResults.length > 0 && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsTitle}>
                            Found {searchResults.length} pitches
                        </Text>
                        {renderCourtList(searchResults)}
                    </View>
                )}

                {/* No Search Results */}
                {!isSearching && searchResults.length === 0 && courts.length > 0 && (
                    <View style={styles.courtsContainer}>
                        <Text style={styles.sectionTitle}>Available Pitches</Text>
                        {renderCourtList(courts)}
                    </View>
                )}

                {/* Empty State */}
                {!isLoading && !isSearching && courts.length === 0 && searchResults.length === 0 && (
                    <View style={styles.centerContent}>
                        <Text style={styles.emptyText}>No pitches available</Text>
                        <Text style={styles.emptySubtext}>
                            Check back later for available pitches
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.1,
    },
    loadingText: {
        fontSize: width * 0.04,
        color: colors.darkGrey,
        marginTop: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.darkGrey,
        textAlign: 'center',
    },
    resultsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
    },
    resultsTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.black,
        alignSelf: 'flex-start',
        paddingLeft: width * 0.05,
    },
    courtsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.black,
        alignSelf: 'flex-start',
        paddingLeft: width * 0.05,
    },
});

export default HomeScreen;
