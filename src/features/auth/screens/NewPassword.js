import { useNavigation } from '@react-navigation/native';
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

export default function NewPassword() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log('Resetting password:', data.password);
            // TODO: Call reset password API
            // On success, navigate to login
            // navigation.navigate('Login');
        } catch (error) {
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <ScreenHeader
                title="New Password"
                onBackPress={() => navigation.goBack()}
            />

            {/* Illustration */}
            <Image
                source={require('../../../assets/images/missed_chance.png')}
                style={styles.illustration}
                resizeMode="contain"
            />

            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.description}>
                Your new password must be different from previously used passwords
            </Text>

            {/* Form */}
            <View style={styles.form}>
                <FormInput
                    control={control}
                    name="password"
                    label="NEW PASSWORD"
                    placeholder="Enter new password"
                    rules={validationRules.password}
                    secureTextEntry
                    error={errors.password}
                />

                <FormInput
                    control={control}
                    name="confirmPassword"
                    label="CONFIRM PASSWORD"
                    placeholder="Confirm new password"
                    rules={validationRules.confirmPassword(password)}
                    secureTextEntry
                    error={errors.confirmPassword}
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

            {/* Ball SVG */}
            <Ball
                width={width * 0.15}
                height={width * 0.15}
                fill={colors.lightGrey}
                style={styles.ballSvg}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    illustration: {
        width: width * 0.9,
        height: height * 0.25,
        alignSelf: 'center',
        marginTop: height * 0.02,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
        marginTop: height * 0.02,
    },
    description: {
        fontSize: width * 0.035,
        fontWeight: '400',
        color: colors.darkGrey,
        textAlign: 'center',
        marginTop: height * 0.01,
        paddingHorizontal: width * 0.1,
    },
    form: {
        paddingHorizontal: width * 0.06,
        marginTop: height * 0.03,
    },
    confirmButton: {
        marginTop: height * 0.02,
    },
    ballSvg: {
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: height * 0.05,
    },
});