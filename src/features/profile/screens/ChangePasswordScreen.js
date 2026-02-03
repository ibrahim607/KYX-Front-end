import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import FormInput from '../../auth/components/FormInput';
import { validationRules } from '../../auth/utils/validationRules';

const { width, height } = Dimensions.get('window');

export default function ChangePasswordScreen() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            oldPassword: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log('Changing password:', {
                oldPassword: data.oldPassword,
                newPassword: data.password,
            });
            // TODO: Call change password API
            Alert.alert('Success', 'Password changed successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Change password error:', error);
            Alert.alert('Error', error.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <ScreenHeader
                title="Change Password"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
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
                        name="oldPassword"
                        label="OLD PASSWORD"
                        placeholder="Enter old password"
                        rules={{ required: 'Old password is required' }}
                        secureTextEntry
                        error={errors.oldPassword}
                    />

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
                        title={isLoading ? "Changing..." : "Confirm"}
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        style={styles.confirmButton}
                    />
                </View>
            </ScrollView>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    confirmButton: {
        marginTop: height * 0.02,
        marginBottom: 20,
    },
});
