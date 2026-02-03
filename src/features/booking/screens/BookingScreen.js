import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getFieldById } from '../../../../mock-data/fields';
import { colors } from '../../../assets/theme/colors';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import BookingCard from '../components/BookingCard';
import useBookingStore from '../store/useBookingStore';

const { width } = Dimensions.get('window');

const BookingScreen = () => {
    const navigation = useNavigation();

    // ============================================
    // ZUSTAND STATE
    // ============================================
    const {
        bookings,
        isLoading,
        error,
        fetchBookings,
        cancelBooking: cancelBookingAction,
        clearError
    } = useBookingStore();

    // ============================================
    // EFFECTS
    // ============================================

    // Fetch bookings on mount
    useEffect(() => {
        fetchBookings();
    }, []);

    // Show error alert if there's an error
    useEffect(() => {
        if (error) {
            Alert.alert(
                'Error',
                error,
                [
                    { text: 'Dismiss', onPress: clearError },
                    { text: 'Retry', onPress: fetchBookings }
                ]
            );
        }
    }, [error]);

    // ============================================
    // HANDLERS
    // ============================================

    const handleLocationPress = (booking) => {
        // Get field details to access coordinates
        const field = getFieldById(booking.courtId);

        if (field?.latitude && field?.longitude) {
            // Open Google Maps with coordinates
            const url = `https://maps.google.com/?q=${field.latitude},${field.longitude}`;
            Linking.openURL(url);
        } else {
            Alert.alert('Location', 'Location coordinates not available for this booking.');
        }
    };

    const handleCancelPress = (booking) => {
        Alert.alert(
            'Cancel Booking',
            `Are you sure you want to cancel your booking at ${booking.courtName}?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelBookingAction(booking.id);
                            Alert.alert('Success', 'Booking cancelled successfully');
                        } catch (err) {
                            Alert.alert('Error', 'Failed to cancel booking. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handlePayPress = (booking) => {
        // Navigate to payment screen with booking details
        navigation.navigate('Payment', {
            courtFee: booking.price,
            bookingDetails: {
                fieldId: booking.courtId,
                pitchName: booking.courtName,
                bookingDate: booking.date,
                startTime: booking.duration.split(' - ')[0],
                endTime: booking.duration.split(' - ')[1],
                bookingId: booking.id, // Pass existing booking ID
            }
        });
    };

    const handleRefresh = () => {
        fetchBookings();
    };

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <View style={styles.container}>
            <ScreenHeader title="My Bookings" onBackPress={handleBackPress} />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Loading State */}
                {isLoading && bookings.length === 0 && (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading bookings...</Text>
                    </View>
                )}

                {/* Bookings List */}
                {!isLoading && bookings.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            {bookings.length} Upcoming Booking{bookings.length !== 1 ? 's' : ''}
                        </Text>
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onLocationPress={handleLocationPress}
                                onCancelPress={handleCancelPress}
                                onPayPress={handlePayPress}
                            />
                        ))}
                    </>
                )}

                {/* Empty State */}
                {!isLoading && bookings.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No bookings yet</Text>
                        <Text style={styles.emptySubtext}>
                            Book a pitch to see your reservations here
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
        paddingVertical: 20,
        minHeight: '100%',
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 16,
        alignSelf: 'flex-start',
        paddingLeft: width * 0.05,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.darkGrey,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
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
});

export default BookingScreen;
