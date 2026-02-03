import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');

/**
 * PitchInfoSection Component
 * Displays pitch name, location, price, rating, type, amenities
 */
const PitchInfoSection = ({ pitch }) => {
    return (
        <View style={styles.container}>
            {/* Name and Price */}
            <View style={styles.headerRow}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{pitch.name}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color={colors.darkGrey} />
                        <Text style={styles.location}>{pitch.location}</Text>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{pitch.pricePerHour} EGP</Text>
                    <Text style={styles.priceUnit}>per hour</Text>
                </View>
            </View>

            {/* Description */}
            {pitch.description && (
                <View style={styles.section}>
                    <Text style={styles.description}>{pitch.description}</Text>
                </View>
            )}

            {/* Rating and Type */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={styles.statText}>{pitch.rating} ({pitch.reviews} reviews)</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="people-outline" size={18} color={colors.black} />
                    <Text style={styles.statText}>{pitch.type}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: width * 0.05,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    nameContainer: {
        flex: 1,
        marginRight: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 14,
        color: colors.darkGrey,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
    },
    priceUnit: {
        fontSize: 12,
        color: colors.darkGrey,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: colors.darkGrey,
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: colors.black,
        fontWeight: '500',
    },
});

export default PitchInfoSection;
