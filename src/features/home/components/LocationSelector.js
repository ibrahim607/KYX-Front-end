import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getAllLocations } from '../../../../mock-data/locations';
import { colors } from '../../../assets/theme/colors';

const { width, height } = Dimensions.get('window');

/**
 * LocationSelector - Expandable location dropdown component
 * Shows unique areas from available courts and allows filtering
 */
const LocationSelector = ({
    courts = [],
    selectedLocation,
    onLocationSelect,
    onClear,
    isExpanded = false
}) => {
    // Get unique areas from courts
    const getUniqueAreas = () => {
        const locations = getAllLocations();
        const courtLocationIds = [...new Set(courts.map(court => court.locationId))];
        return locations.filter(loc => courtLocationIds.includes(loc.id));
    };

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
    };

    const handleClear = () => {
        onClear();
    };

    if (!isExpanded) {
        return null;
    }

    return (
        <View style={styles.dropdown}>
            {selectedLocation && (
                <View style={styles.dropdownHeader}>
                    <TouchableOpacity onPress={handleClear}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView
                style={styles.locationList}
                showsVerticalScrollIndicator={false}
            >
                {getUniqueAreas().map((location) => (
                    <TouchableOpacity
                        key={location.id}
                        style={[
                            styles.locationItem,
                            selectedLocation?.id === location.id && styles.locationItemSelected
                        ]}
                        onPress={() => handleLocationSelect(location)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="location"
                            size={20}
                            color={selectedLocation?.id === location.id ? colors.white : colors.black}
                        />
                        <View style={styles.locationInfo}>
                            <Text style={[
                                styles.locationArea,
                                selectedLocation?.id === location.id && styles.locationTextSelected
                            ]}>
                                {location.area}
                            </Text>
                            <Text style={[
                                styles.locationCity,
                                selectedLocation?.id === location.id && styles.locationTextSelected
                            ]}>
                                {location.city}
                            </Text>
                        </View>
                        {selectedLocation?.id === location.id && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: colors.white,
        marginHorizontal: width * 0.05,
        marginTop: 8,
        borderRadius: 12,
        maxHeight: height * 0.35,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundGrey,
    },
    dropdownTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
    },
    clearText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    locationList: {
        maxHeight: height * 0.28,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.backgroundGrey,
        gap: 10,
    },
    locationItemSelected: {
        backgroundColor: colors.black,
    },
    locationInfo: {
        flex: 1,
    },
    locationArea: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 2,
    },
    locationCity: {
        fontSize: 12,
        color: colors.darkGrey,
    },
    locationTextSelected: {
        color: colors.white,
    },
});

export default LocationSelector;
