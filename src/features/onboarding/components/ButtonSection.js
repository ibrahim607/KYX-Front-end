import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import SocialLoginSection from '../../auth/components/SocialLoginSection';

const ButtonSection = ({ onNext, onSkip, animationStep }) => {
    const navigation = useNavigation();

    const handleSocialLogin = (provider) => {
        Alert.alert(`${provider} Login`, 'This feature will be implemented soon.');
    };

    // Final page (step 3): Show Sign Up/Sign In buttons with social icons
    if (animationStep === 3) {
        return (
            <View style={styles.finalPageContainer}>
                {/* Auth Buttons - Stacked Vertically */}
                <View style={styles.authButtonsContainer}>
                    <CustomButton
                        title="Sign Up"
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={() => navigation.navigate('Register')}
                        style={styles.fullWidthButton}
                    />
                    <CustomButton
                        title="Sign In"
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={() => navigation.navigate('Login')}
                        style={styles.fullWidthButton}
                    />
                </View>

                {/* Social Sign In Section */}
                <SocialLoginSection
                    onGooglePress={() => handleSocialLogin('Google')}
                    onFacebookPress={() => handleSocialLogin('Facebook')}
                    onApplePress={() => handleSocialLogin('Apple')}
                />
            </View>
        );
    }

    // Show "Get Started" button on step 2
    if (animationStep === 2) {
        return (
            <View style={styles.container}>
                <CustomButton
                    title="Get Started"
                    backgroundColor={colors.black}
                    textColor={colors.white}
                    onPress={onNext}
                />
            </View>
        );
    }

    // Default: Show Skip/Next buttons
    return (
        <View style={styles.container}>
            <CustomButton
                title="Skip"
                backgroundColor={colors.white}
                textColor={colors.black}
                bordered
                onPress={onSkip}
            />
            <CustomButton
                title="Next"
                backgroundColor={colors.black}
                textColor={colors.white}
                onPress={onNext}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
        paddingHorizontal: 20,
    },
    finalPageContainer: {
        position: 'absolute',
        bottom: 250,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        gap: 20,
    },
    authButtonsContainer: {
        gap: 12,
        width: '100%',
    },
    fullWidthButton: {
        width: '100%',
    },
})

export default ButtonSection
