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
    View,
} from 'react-native';
import { authService } from '../../../api/authService';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import useAuthStore from '../../../store/useAuthStore';
import FormInput from '../components/FormInput';
import { validationRules } from '../utils/validationRules';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
    const navigation = useNavigation();
    const { setAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    // Watch password field for confirm password validation
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // API call to register
            const response = await authService.register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: data.password,
            });

            // Expected response format: { user, accessToken, refreshToken }
            const { user, accessToken, refreshToken } = response;

            // Store auth data in Zustand and AsyncStorage
            await setAuth(user, accessToken, refreshToken);

            // Navigation will be handled automatically by RootNavigator
            // based on isAuthenticated state
        } catch (error) {
            Alert.alert('Registration Failed', error.message || 'Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = () => {
        navigation.navigate('Login');
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
                    source={require('../../../assets/icons/PlayerStand.png')}
                    style={styles.headerImage}
                    resizeMode="contain"
                />
                <View style={styles.header}>
                    <Text style={styles.title}>Sign up</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Name Fields - Side by Side */}
                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <FormInput
                                control={control}
                                name="firstName"
                                label="First Name"
                                placeholder="First name"
                                rules={validationRules.firstName}
                                autoCapitalize="words"
                                error={errors.firstName}
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <FormInput
                                control={control}
                                name="lastName"
                                label="Last Name"
                                placeholder="Last name"
                                rules={validationRules.lastName}
                                autoCapitalize="words"
                                error={errors.lastName}
                            />
                        </View>
                    </View>

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
                        name="phoneNumber"
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        rules={validationRules.phoneNumber}
                        keyboardType="phone-pad"
                        error={errors.phoneNumber}
                    />

                    <FormInput
                        control={control}
                        name="password"
                        label="Password"
                        placeholder="Create a password"
                        rules={validationRules.password}
                        secureTextEntry
                        error={errors.password}
                    />

                    <FormInput
                        control={control}
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        rules={validationRules.confirmPassword(password)}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    {/* Submit Button */}
                    <CustomButton
                        title={isLoading ? '' : 'Sign Up'}
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        style={styles.submitButton}
                    >
                        {isLoading && <ActivityIndicator color={colors.white} />}
                    </CustomButton>
                </View>

                {/* Sign In Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleSignIn}>
                        <Text style={styles.signInText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: height * 0.0375,
        backgroundColor: colors.backgroundGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: width * 0.06,
        paddingTop: height * 0.075,
        paddingBottom: height * 0.1,
    },
    headerImage: {
        width: width * 0.3,
        height: height * 0.15,
        position: 'absolute',
        top: height * 0.04,
        left: width * 0.08,
        right: 0,
        margin: 'auto',
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
        marginBottom: height * 0.025,
    },
    row: {
        flexDirection: 'row',
        gap: width * 0.03,
    },
    halfWidth: {
        flex: 1,
    },
    submitButton: {
        marginTop: height * 0.01,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
    },
    footerText: {
        fontSize: width * 0.035,
        color: colors.darkGrey,
    },
    signInText: {
        fontSize: width * 0.035,
        color: colors.black,
        fontWeight: '600',
    },
});

export default RegisterScreen;
