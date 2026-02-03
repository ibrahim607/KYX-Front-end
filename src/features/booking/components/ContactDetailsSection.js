import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Alert,
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');

/**
 * ContactDetailsSection Component
 * Displays phone number and address with map button
 */
const ContactDetailsSection = ({ pitch, phoneNumber = '+20 100 123 4567' }) => {
    const handlePhonePress = () => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleMapPress = () => {
        if (pitch?.latitude && pitch?.longitude) {
            const url = `https://maps.google.com/?q=${pitch.latitude},${pitch.longitude}`;
            Linking.openURL(url);
        } else {
            Alert.alert('Location', 'Map view will be implemented here');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Contact Details</Text>

            {/* Phone Number */}
            <TouchableOpacity
                style={styles.contactItem}
                onPress={handlePhonePress}
                activeOpacity={0.7}
            >
                <Ionicons name="call-outline" size={20} color={colors.black} />
                <Text style={styles.contactText}>{phoneNumber}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.darkGrey} />
            </TouchableOpacity>

            {/* Address */}
            <View style={styles.addressContainer}>
                <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={20} color={colors.black} />
                    <Text style={styles.addressText}>{pitch.location}</Text>
                </View>
                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={handleMapPress}
                    activeOpacity={0.7}
                >
                    <Ionicons name="map-outline" size={18} color={colors.white} />
                    <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: width * 0.05,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.white,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    contactText: {
        flex: 1,
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
    },
    addressContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        color: colors.black,
        lineHeight: 20,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.black,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    mapButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.white,
    },
});

export default ContactDetailsSection;
