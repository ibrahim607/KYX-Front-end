import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppleIcon from '../../../assets/icons/icons8-apple-logo.svg';
import FacebookIcon from '../../../assets/icons/icons8-facebook-logo.svg';
import GoogleIcon from '../../../assets/icons/icons8-google-logo.svg';
import { colors } from '../../../assets/theme/colors';

/**
 * SocialLoginSection - Reusable social login component
 * Displays "Or continue with" text and social media login buttons
 * 
 * @param {function} onGooglePress - Handler for Google login
 * @param {function} onFacebookPress - Handler for Facebook login
 * @param {function} onApplePress - Handler for Apple login
 * @param {object} containerStyle - Additional container styles
 */
const SocialLoginSection = ({
    onGooglePress,
    onFacebookPress,
    onApplePress,
    containerStyle,
}) => {
    return (
        <View style={[styles.socialContainer, containerStyle]}>
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.socialIconsRow}>
                <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={onGooglePress}
                    activeOpacity={0.7}
                >
                    <GoogleIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={onFacebookPress}
                    activeOpacity={0.7}
                >
                    <FacebookIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={onApplePress}
                    activeOpacity={0.7}
                >
                    <AppleIcon width={32} height={32} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    socialContainer: {
        alignItems: 'center',
        gap: 16,
    },
    socialText: {
        fontSize: 17,
        color: colors.darkGrey,
        fontWeight: '500',
    },
    socialIconsRow: {
        flexDirection: 'row',
        gap: 30,
        justifyContent: 'center',
    },
    socialIcon: {
        width: 100,
        height: 60,
        borderRadius: 16,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SocialLoginSection;
