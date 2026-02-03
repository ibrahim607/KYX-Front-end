import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../assets/theme/colors';

/**
 * CustomButton - Shared button component
 * 
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {string} backgroundColor - Background color (default: colors.black)
 * @param {string} textColor - Text color (default: colors.white)
 * @param {boolean} bordered - Add border (default: false)
 * @param {object} style - Additional button styles
 * @param {object} textStyle - Additional text styles
 * @param {boolean} disabled - Disable button (default: false)
 * @param {React.ReactNode} children - Custom content (overrides title if provided)
 */
const CustomButton = ({
    title,
    onPress,
    backgroundColor = colors.black,
    textColor = colors.white,
    bordered = false,
    style,
    textStyle,
    disabled = false,
    children
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor },
                bordered && styles.bordered,
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {children || (
                <Text style={[styles.text, { color: textColor }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bordered: {
        borderWidth: 1,
        borderColor: colors.darkGrey,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 28,
    },
});

export default CustomButton;
