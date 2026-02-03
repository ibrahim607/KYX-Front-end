import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Ball from '../../../assets/icons/ball.svg';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import FormInput from '../components/FormInput';
import { validationRules } from '../utils/validationRules';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // TODO: Implement forgot password API call
            // Navigate to OTP screen and pass the email
            navigation.navigate('OTP', { email: data.email });
            console.log('Reset password for:', data.email);
        } catch (error) {
            console.error('Forgot password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <ScreenHeader
                title="Forgot Password"
                onBackPress={() => navigation.goBack()}
            />

            {/* Illustration */}
            <Image
                source={require('../../../assets/images/missed_chance.png')}
                style={styles.missedChance}
                resizeMode="contain"
            />

            {/* Description text */}
            <Text style={styles.description}>Did you forget your password?</Text>
            <Text style={styles.description}>Don't worry it happens!</Text>

            {/* Form section */}
            <View style={styles.form}>
                <FormInput
                    control={control}
                    name="email"
                    label="EMAIL"
                    placeholder="Enter your email"
                    rules={validationRules.email}
                    keyboardType="email-address"
                    error={errors.email}
                />

                {/* Confirm Button */}
                <CustomButton
                    title="Confirm"
                    backgroundColor={colors.black}
                    textColor={colors.white}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    style={styles.confirmButton}
                />
            </View>

            {/* Ball SVG at bottom center */}
            <Ball
                width={width * 0.15}
                height={width * 0.15}
                fill={colors.lightGrey}
                style={styles.ballSvg}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    missedChance: {
        width: width * 0.9,
        height: height * 0.35,
        alignSelf: 'center',
        marginTop: height * 0.02,
    },
    description: {
        fontSize: width * 0.04,
        fontWeight: '400',
        color: colors.black,
        textAlign: 'center',
        marginVertical: height * 0.005,
    },
    form: {
        flex: 1,
        paddingHorizontal: width * 0.06,
        paddingTop: height * 0.03,
    },
    confirmButton: {
        marginTop: height * 0.02,
    },
    ballSvg: {
        alignSelf: 'center',
        marginBottom: height * 0.05,
    },
});

export default ForgotPasswordScreen;