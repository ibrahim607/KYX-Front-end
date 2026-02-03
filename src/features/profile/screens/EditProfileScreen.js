import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import CustomInput from '../../../shared/components/CustomInput';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import { useAuthStore } from '../../../store';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Initialize React Hook Form
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
            username: user?.username || '',
            gender: user?.gender || '',
            phoneNumber: user?.phoneNumber || '',
            email: user?.email || '',
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Split name back into first and last name for API compatibility
            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            const updateData = {
                firstName,
                lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                username: data.username,
                gender: data.gender
            };

            await updateUser(updateData);

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Edit Profile"
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <CustomInput
                    control={control}
                    name="name"
                    label="Name"
                    placeholder="John Doe"
                    rules={{ required: 'Name is required' }}
                />

                <CustomInput
                    control={control}
                    name="username"
                    label="Username"
                    placeholder="johndoe123"
                    rules={{ required: 'Username is required' }}
                />

                <CustomInput
                    control={control}
                    name="gender"
                    label="Gender"
                    placeholder="Male/Female"
                />

                <CustomInput
                    control={control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="+1 234 567 8900"
                    keyboardType="phone-pad"
                    rules={{ required: 'Phone Number is required' }}
                />

                <CustomInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    }}
                />

                <View style={styles.footer}>
                    <CustomButton
                        title={isLoading ? "Saving..." : "Save"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        backgroundColor={colors.black}
                        textColor={colors.white}
                        style={styles.saveButton}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    footer: {
        marginTop: 20,
        marginBottom: 20,
    },
    saveButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
    }
});

export default EditProfileScreen;
