import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../assets/theme/colors';

const { width } = Dimensions.get('window');

/**
 * CustomAlert Component
 * A styled alternative to React Native's Alert with customizable buttons
 * 
 * @param {boolean} visible - Whether the alert is visible
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Array} buttons - Array of button objects { text, onPress, style }
 * @param {Function} onDismiss - Called when alert is dismissed
 */
const CustomAlert = ({ visible, title, message, buttons = [], onDismiss }) => {
    const handleButtonPress = (onPress) => {
        if (onPress) {
            onPress();
        }
        if (onDismiss) {
            onDismiss();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    {/* Title */}
                    {title && <Text style={styles.title}>{title}</Text>}

                    {/* Message */}
                    {message && <Text style={styles.message}>{message}</Text>}

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        {buttons.map((button, index) => {
                            const isDestructive = button.style === 'destructive';
                            const isCancel = button.style === 'cancel';
                            const isPrimary = button.style === 'default' || (!isDestructive && !isCancel && index === buttons.length - 1);

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        isPrimary && styles.buttonPrimary,
                                        isCancel && styles.buttonCancel,
                                        isDestructive && styles.buttonDestructive,
                                        buttons.length === 1 && styles.buttonSingle,
                                    ]}
                                    onPress={() => handleButtonPress(button.onPress)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        isPrimary && styles.buttonTextPrimary,
                                        isCancel && styles.buttonTextCancel,
                                        isDestructive && styles.buttonTextDestructive,
                                    ]}>
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
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
    alertContainer: {
        width: width * 0.85,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.darkGrey,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonsContainer: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: colors.lightGrey,
    },
    buttonSingle: {
        marginTop: 0,
    },
    buttonPrimary: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    buttonCancel: {
        backgroundColor: colors.white,
        borderColor: colors.lightGrey,
    },
    buttonDestructive: {
        backgroundColor: colors.white,
        borderColor: colors.red,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    buttonTextPrimary: {
        color: colors.white,
    },
    buttonTextCancel: {
        color: colors.darkGrey,
    },
    buttonTextDestructive: {
        color: colors.red,
    },
});

export default CustomAlert;
