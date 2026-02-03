import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { authService } from '../../../api/authService';
import Ball from '../../../assets/icons/ball.svg';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import useAuthStore from '../../../store/useAuthStore';
import FormInput from '../components/FormInput';
import SocialLoginSection from '../components/SocialLoginSection';
import { validationRules } from '../utils/validationRules';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const { setAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // API call to login
            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            // Expected response format: { user, accessToken, refreshToken }
            const { user, accessToken, refreshToken } = response;

            // Store auth data in Zustand and AsyncStorage
            await setAuth(user, accessToken, refreshToken);

            // Navigation will be handled automatically by RootNavigator
            // based on isAuthenticated state
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // TODO: Navigate to forgot password screen
        // Alert.alert('Forgot Password', 'This feature will be implemented soon.');
        navigation.navigate('ForgotPassword');
    };

    const handleSignUp = () => {
        navigation.navigate('Register');
    };

    const handleSocialLogin = (provider) => {
        Alert.alert(`${provider} Login`, 'This feature will be implemented soon.');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}
                <Image
                    source={require('../../../assets/icons/cr7Stand.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image source={require('../../../assets/icons/black-ball.png')} style={styles.blackBall} />

                <View style={styles.header}>
                    <Text style={styles.title}>Sign in</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <FormInput
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        rules={validationRules.email}
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <FormInput
                        control={control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        rules={validationRules.password}
                        secureTextEntry
                        error={errors.password}
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.forgotPasswordContainer}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <CustomButton
                        title={isLoading ? '' : 'Sign In'}
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        style={styles.submitButton}
                    >
                        {isLoading && <ActivityIndicator color={colors.white} />}
                    </CustomButton>
                </View>

                {/* Social Login Section */}
                <SocialLoginSection
                    onGooglePress={() => handleSocialLogin('Google')}
                    onFacebookPress={() => handleSocialLogin('Facebook')}
                    onApplePress={() => handleSocialLogin('Apple')}
                    containerStyle={styles.socialSection}
                />

                {/* Sign Up Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <Ball
                    width={60}
                    height={60}
                    fill={colors.lightGrey}
                    style={styles.ballSvg}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: width * 0.06,
        paddingTop: height * 0.05,
        marginTop: height * 0.02,
        paddingBottom: height * 0.12,
    },
    logo: {
        width: width * 0.25,
        height: height * 0.12,
        position: 'absolute',
        top: height * 0.05,
        left: width * 0.6,
        right: 0,
        margin: 'auto',
    },
    blackBall: {
        width: width * 0.045,
        height: height * 0.02,
        position: 'absolute',
        top: height * 0.16,
        left: width * 0.705,
        right: 0,
        margin: 'auto',
    },
    ballSvg: {
        alignSelf: 'center',
        marginTop: height * 0.05,
        marginBottom: height * 0.025,
    },
    header: {
        marginVertical: height * 0.075,
        alignItems: 'center',
    },
    title: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: width * 0.04,
        color: colors.darkGrey,
    },
    form: {
        marginBottom: height * 0.03,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: height * 0.03,
    },
    forgotPasswordText: {
        fontSize: width * 0.035,
        color: colors.black,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: height * 0.01,
    },
    socialSection: {
        marginTop: height * 0.03,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.025
    },
    footerText: {
        fontSize: width * 0.035,
        color: colors.darkGrey,
    },
    signUpText: {
        fontSize: width * 0.035,
        color: colors.black,
        fontWeight: '600',
    },
});

export default LoginScreen;
