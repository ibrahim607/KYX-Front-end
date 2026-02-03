import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const BookingCard = ({ booking, onLocationPress, onCancelPress, onPayPress }) => {
    const isPendingPayment = booking.status === 'pending_payment';

    return (
        <View style={styles.card}>
            {/* Header Section with Court Name */}
            <View style={styles.header}>
                <View style={styles.courtNameContainer}>
                    <Ionicons name="football" size={20} color={colors.black} />
                    <Text style={styles.courtName} numberOfLines={1}>
                        {booking.courtName}
                    </Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    isPendingPayment && styles.statusBadgePending
                ]}>
                    <Text style={styles.statusText}>
                        {isPendingPayment ? 'Pending Payment' : booking.status}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Booking Details */}
            <View style={styles.detailsSection}>
                {/* Location */}
                <View style={styles.detailRow}>
                    <View style={styles.iconLabel}>
                        <Ionicons name="location-outline" size={18} color={colors.darkGrey} />
                        <Text style={styles.label}>Location</Text>
                    </View>
                    <Text style={styles.value} numberOfLines={1}>{booking.location}</Text>
                </View>

                {/* Date */}
                <View style={styles.detailRow}>
                    <View style={styles.iconLabel}>
                        <Ionicons name="calendar-outline" size={18} color={colors.darkGrey} />
                        <Text style={styles.label}>Date</Text>
                    </View>
                    <Text style={styles.value}>{booking.date}</Text>
                </View>

                {/* Duration */}
                <View style={styles.detailRow}>
                    <View style={styles.iconLabel}>
                        <Ionicons name="time-outline" size={18} color={colors.darkGrey} />
                        <Text style={styles.label}>Duration</Text>
                    </View>
                    <Text style={styles.value}>{booking.duration}</Text>
                </View>

                {/* Price */}
                <View style={styles.detailRow}>
                    <View style={styles.iconLabel}>
                        <Ionicons name="cash-outline" size={18} color={colors.darkGrey} />
                        <Text style={styles.label}>Price</Text>
                    </View>
                    <Text style={styles.priceValue}>{booking.price} EGP</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
                {/* Location Button */}
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={() => onLocationPress && onLocationPress(booking)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="location" size={18} color={colors.white} />
                    <Text style={styles.locationButtonText}>Location</Text>
                </TouchableOpacity>

                {/* Pay or Cancel Button */}
                {isPendingPayment ? (
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => onPayPress && onPayPress(booking)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="card-outline" size={18} color={colors.white} />
                        <Text style={styles.payButtonText}>Pay</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => onCancelPress && onCancelPress(booking)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close-circle-outline" size={18} color={colors.white} />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    courtNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    courtName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginLeft: 8,
        flex: 1,
    },
    statusBadge: {
        backgroundColor: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusBadgePending: {
        backgroundColor: '#FF9500', // Orange for pending
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGrey,
        marginHorizontal: 16,
    },
    detailsSection: {
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: colors.darkGrey,
        marginLeft: 8,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: colors.black,
        fontWeight: '600',
    },
    priceValue: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 'bold',
    },
    actionsSection: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    locationButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.black,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    locationButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    payButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34C759', // Green for pay
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    payButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.red,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    cancelButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default BookingCard;
