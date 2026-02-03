import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFieldById } from '../../../../mock-data/fields';
import { colors } from '../../../assets/theme/colors';
import CustomAlert from '../../../shared/components/CustomAlert';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import useCustomAlert from '../../../shared/hooks/useCustomAlert';
import useCourtStore from '../../home/store/useCourtStore';
import ContactDetailsSection from '../components/ContactDetailsSection';
import ImageGallery from '../components/ImageGallery';
import PitchInfoSection from '../components/PitchInfoSection';
import TimeSlotPicker from '../components/TimeSlotPicker';
import useBookingStore from '../store/useBookingStore';

const { width } = Dimensions.get('window');

const PitchDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { pitchId } = route.params || {};

    const [pitch, setPitch] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const { showAlert, hideAlert, alertConfig, isVisible } = useCustomAlert();

    const { createBooking } = useBookingStore();
    const { toggleFavorite, isFavorite } = useCourtStore();

    const isFavorited = pitch ? isFavorite(pitch.id) : false;

    // Fetch pitch details
    useEffect(() => {
        if (pitchId) {
            const pitchData = getFieldById(pitchId);
            if (pitchData) {
                // Add multiple images for gallery
                const images = [
                    pitchData.image,
                    { uri: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800' },
                    { uri: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800' },
                    { uri: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800' },
                ];
                setPitch({ ...pitchData, images });
            } else {
                showAlert({
                    title: 'Error',
                    message: 'Pitch not found',
                    buttons: [{ text: 'OK', onPress: () => navigation.goBack() }]
                });
            }
        }
    }, [pitchId]);

    const handleBackPress = () => {
        // Navigate to Home tab in MainTabs
        navigation.navigate('MainTabs', { screen: 'Home' });
    };

    const handleFavoritePress = async () => {
        if (pitch) {
            await toggleFavorite(pitch.id);
        }
    };

    const calculateTotalPrice = () => {
        if (!pitch || selectedSlots.length === 0) return 0;
        return selectedSlots.length * pitch.pricePerHour;
    };

    const handleBookNow = async () => {
        if (selectedSlots.length === 0) {
            showAlert({
                title: 'No Slots Selected',
                message: 'Please select at least one time slot to book.'
            });
            return;
        }

        const totalPrice = calculateTotalPrice();
        const slotsText = selectedSlots.length === 1 ? 'slot' : 'slots';

        showAlert({
            title: 'Confirm Booking',
            message: `You are about to book ${selectedSlots.length} ${slotsText} for ${pitch.name}.\n\nTotal: ${totalPrice} EGP\n\nProceed to payment?`,
            buttons: [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Proceed to Payment',
                    style: 'default',
                    onPress: () => {
                        // Navigate to payment screen with booking details
                        navigation.navigate('Payment', {
                            courtFee: totalPrice,
                            bookingDetails: {
                                fieldId: pitch.id,
                                pitchName: pitch.name,
                                bookingDate: selectedSlots[0].date,
                                startTime: selectedSlots[0].startTime,
                                endTime: selectedSlots[selectedSlots.length - 1].endTime,
                                slots: selectedSlots.map(slot => ({
                                    slotId: slot.id,
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                })),
                            }
                        });
                    }
                }
            ]
        });
    };

    if (!pitch) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.black} />
                <Text style={styles.loadingText}>Loading pitch details...</Text>
            </View>
        );
    }

    // Heart icon for header
    const heartIcon = (
        <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.heartButton}
            activeOpacity={0.7}
        >
            <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorited ? colors.red : colors.black}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Pitch"
                onBackPress={handleBackPress}
                rightAction={heartIcon}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: 150 + insets.bottom } // Increased padding to avoid footer overlap
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Image Gallery */}
                <ImageGallery images={pitch.images} />

                {/* Pitch Info */}
                <PitchInfoSection pitch={pitch} />

                {/* Contact Details */}
                <ContactDetailsSection pitch={pitch} />

                {/* Time Slot Picker */}
                <TimeSlotPicker
                    pitchId={pitch.id}
                    selectedSlots={selectedSlots}
                    onSlotsChange={setSelectedSlots}
                />

                {/* Spacing for fixed button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Custom Alert */}
            <CustomAlert
                visible={isVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onDismiss={hideAlert}
            />

            {/* Fixed Book Now Button */}
            <View style={[styles.bookingFooter, { paddingBottom: 16 + insets.bottom }]}>
                {selectedSlots.length > 0 && (
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>{calculateTotalPrice()} EGP</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        (selectedSlots.length === 0 || isBooking) && styles.bookButtonDisabled
                    ]}
                    onPress={handleBookNow}
                    disabled={selectedSlots.length === 0 || isBooking}
                    activeOpacity={0.8}
                >
                    {isBooking ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <>
                            <Text style={styles.bookButtonText}>
                                {selectedSlots.length > 0 ? 'Book Now' : 'Select Time Slots'}
                            </Text>
                            {selectedSlots.length > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{selectedSlots.length}</Text>
                                </View>
                            )}
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundGrey,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.darkGrey,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heartButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookingFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        paddingHorizontal: width * 0.05,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 16,
        color: colors.darkGrey,
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.black,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    bookButtonDisabled: {
        backgroundColor: colors.darkGrey,
        opacity: 0.5,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    badge: {
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.black,
    },
});

export default PitchDetailsScreen;
