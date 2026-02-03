import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/theme/colors';

const PaymentSuccessModal = ({ visible, onClose, amount, pitchName }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
                    </View>

                    {/* Success Message */}
                    <Text style={styles.title}>Payment Successful!</Text>
                    <Text style={styles.message}>
                        Your booking at {pitchName} has been confirmed.
                    </Text>

                    {/* Amount */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount Paid</Text>
                        <Text style={styles.amountValue}>EGP {amount}</Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.darkGrey,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    amountContainer: {
        backgroundColor: colors.backgroundGrey,
        borderRadius: 12,
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    amountLabel: {
        fontSize: 14,
        color: colors.darkGrey,
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.black,
    },
    closeButton: {
        backgroundColor: colors.black,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
});

export default PaymentSuccessModal;
