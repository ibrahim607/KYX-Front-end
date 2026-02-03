import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ball from '../../../assets/icons/ball.svg';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import CustomInput from '../../../shared/components/CustomInput';
import PaymentSuccessModal from '../../../shared/components/PaymentSuccessModal';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import useBookingStore from '../store/useBookingStore';

const { width, height } = Dimensions.get('window');

const PAYMENT_METHODS = {
    VODAFONE: 'vodafone',
    INSTAPAY: 'instapay',
};

export default function PaymentScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Get booking details from navigation params
    const { courtFee = 150, bookingDetails = {} } = route.params || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { createBooking, updateBooking } = useBookingStore();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            phoneNumber: '',
        },
    });

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
    };

    const onSubmit = async (data) => {
        if (!selectedPaymentMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        setIsLoading(true);
        try {
            // Step 1: Create the booking with pending_payment status
            const bookingData = {
                fieldId: bookingDetails.fieldId,
                bookingDate: bookingDetails.bookingDate,
                startTime: bookingDetails.startTime,
                endTime: bookingDetails.endTime,
                totalPrice: courtFee,
                slots: bookingDetails.slots,
                status: 'pending_payment', // Mark as pending payment
            };

            const createdBooking = await createBooking(bookingData);

            // Step 2: Process payment
            console.log('Processing payment:', {
                method: selectedPaymentMethod,
                phoneNumber: data.phoneNumber,
                amount: courtFee,
                bookingId: createdBooking.id,
            });

            // TODO: Call payment API
            // const response = await paymentService.initiatePayment({
            //     method: selectedPaymentMethod,
            //     phoneNumber: data.phoneNumber,
            //     amount: courtFee,
            //     bookingId: createdBooking.id,
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 3: Update booking status to confirmed
            await updateBooking(createdBooking.id, { status: 'confirmed' });

            // Step 4: Show success modal
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert('Error', error.message || 'Failed to process payment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Navigate to bookings to see the confirmed booking
        navigation.navigate('MainTabs', { screen: 'Bookings' });
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Payment"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Payment Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Court Fee</Text>
                        <Text style={styles.summaryValue}>EGP {courtFee}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Fee</Text>
                        <Text style={styles.totalValue}>EGP {courtFee}</Text>
                    </View>
                </View>

                {/* Payment Method Selection */}
                <Text style={styles.sectionTitle}>Select Your Payment Method</Text>

                <View style={styles.paymentMethodsContainer}>
                    {/* Vodafone Cash */}
                    <TouchableOpacity
                        style={[
                            styles.paymentMethodButton,
                            selectedPaymentMethod === PAYMENT_METHODS.VODAFONE && styles.paymentMethodButtonSelected,
                        ]}
                        onPress={() => handlePaymentMethodSelect(PAYMENT_METHODS.VODAFONE)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../../../assets/images/wallet.png')}
                            style={styles.paymentMethodImage}
                            resizeMode="contain"
                        />
                        {selectedPaymentMethod === PAYMENT_METHODS.VODAFONE && (
                            <View style={styles.selectedIndicator} />
                        )}
                    </TouchableOpacity>

                    {/* InstaPay */}
                    <TouchableOpacity
                        style={[
                            styles.paymentMethodButton,
                            selectedPaymentMethod === PAYMENT_METHODS.INSTAPAY && styles.paymentMethodButtonSelected,
                        ]}
                        onPress={() => handlePaymentMethodSelect(PAYMENT_METHODS.INSTAPAY)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../../../assets/images/instapay.png')}
                            style={styles.paymentMethodImage}
                            resizeMode="contain"
                        />
                        {selectedPaymentMethod === PAYMENT_METHODS.INSTAPAY && (
                            <View style={styles.selectedIndicator} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Phone Number Input */}
                <View style={styles.formContainer}>
                    <CustomInput
                        control={control}
                        name="phoneNumber"
                        label="Phone Number"
                        placeholder="01XXXXXXXXX"
                        keyboardType="phone-pad"
                        rules={{
                            required: 'Phone number is required',
                            pattern: {
                                value: /^01[0-9]{9}$/,
                                message: 'Please enter a valid Egyptian phone number',
                            },
                        }}
                    />

                    {/* Confirm Button */}
                    <CustomButton
                        title={isLoading ? 'Processing...' : 'Confirm Payment'}
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading || !selectedPaymentMethod}
                        style={styles.confirmButton}
                    />
                </View>

                {/* Ball SVG */}
                <Ball
                    width={width * 0.15}
                    height={width * 0.15}
                    fill={colors.lightGrey}
                    style={styles.ballSvg}
                />
            </ScrollView>

            {/* Success Modal */}
            <PaymentSuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessModalClose}
                amount={courtFee}
                pitchName={bookingDetails.pitchName || 'the pitch'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    summaryContainer: {
        backgroundColor: colors.white,
        marginHorizontal: width * 0.05,
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 16,
        color: colors.darkGrey,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    divider: {
        height: 1,
        backgroundColor: colors.backgroundGrey,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginHorizontal: width * 0.05,
        marginTop: 30,
        marginBottom: 16,
    },
    paymentMethodsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.05,
        gap: 16,
    },
    paymentMethodButton: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        minHeight: 120,
        position: 'relative',
    },
    paymentMethodButtonSelected: {
        borderColor: colors.black,
        backgroundColor: '#f9f9f9',
    },
    paymentMethodImage: {
        width: '100%',
        height: 60,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        marginHorizontal: width * 0.05,
        marginTop: 30,
    },
    confirmButton: {
        marginTop: 20,
    },
    ballSvg: {
        alignSelf: 'center',
        marginTop: 40,
    },
});
