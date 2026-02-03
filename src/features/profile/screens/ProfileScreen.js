import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../../assets/theme/colors';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import { useAuthStore, useLocationStore, useNotificationStore } from '../../../store';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileMenuItem from '../components/ProfileMenuItem';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const navigation = useNavigation();

    // Get user from auth store instead of mock data
    const { user, clearAuth, updateUser } = useAuthStore();

    // Get notification state - use selector to compute unread status
    const hasUnread = useNotificationStore((state) =>
        state.notifications.some(notif => !notif.isRead)
    );

    // Get location state
    const selectedArea = useLocationStore((state) => state.selectedArea);
    const selectedCity = useLocationStore((state) => state.selectedCity);
    const isLoadingLocation = useLocationStore((state) => state.isLoading);
    const getCurrentDeviceLocation = useLocationStore((state) => state.getCurrentDeviceLocation);

    // Local state for profile image (will update user in store)
    const [profileImage, setProfileImage] = useState(user?.profileImage || null);

    // Local state for location expansion
    const [isLocationExpanded, setIsLocationExpanded] = useState(false);

    // Fallback for user data (in case user object is null)
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest User';
    const userImage = profileImage || user?.profileImage || null;

    const handleChangePhoto = async () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: async () => {
                        // Request camera permissions
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                            return;
                        }

                        // Launch camera with editing enabled
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            const imageUri = result.assets[0].uri;
                            setProfileImage(imageUri);
                            // Update user in auth store
                            if (updateUser) {
                                updateUser({ profileImage: imageUri });
                            }
                        }
                    }
                },
                {
                    text: 'Choose from Library',
                    onPress: async () => {
                        // Request media library permissions
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Denied', 'Media library permission is required to choose photos.');
                            return;
                        }

                        // Launch image picker with editing enabled
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            const imageUri = result.assets[0].uri;
                            setProfileImage(imageUri);
                            // Update user in auth store
                            if (updateUser) {
                                updateUser({ profileImage: imageUri });
                            }
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleNotifications = () => {
        navigation.navigate('Notifications');
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleMyLocation = async () => {
        // Toggle expansion
        setIsLocationExpanded(!isLocationExpanded);

        // If expanding and no location yet, request it
        if (!isLocationExpanded && !selectedArea) {
            await getCurrentDeviceLocation();
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearAuth();
                            console.log('User signed out');
                        } catch (error) {
                            console.error('Logout failed:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleBackPress = () => {
        navigation.navigate('MainTabs', { screen: 'Home' });
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title="PROFILE" onBackPress={handleBackPress} />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Avatar */}
                <ProfileAvatar
                    imageUri={userImage}
                    name={userName}
                    onPress={handleChangePhoto}
                />

                {/* Profile Menu Items */}
                <View style={styles.menuContainer}>
                    <ProfileMenuItem
                        icon="person-outline"
                        title="Edit Profile"
                        onPress={handleEditProfile}
                    />
                    <ProfileMenuItem
                        icon="notifications-outline"
                        title="Notifications"
                        onPress={handleNotifications}
                        showBadge={hasUnread}
                    />
                    <ProfileMenuItem
                        icon="lock-closed-outline"
                        title="Change Password"
                        onPress={handleChangePassword}
                    />
                    <ProfileMenuItem
                        icon="location-outline"
                        title="My Location"
                        onPress={handleMyLocation}
                    />

                    {/* Expandable Location Display */}
                    {isLocationExpanded && (
                        <View style={styles.locationExpandedContainer}>
                            {isLoadingLocation ? (
                                <View style={styles.locationLoadingContainer}>
                                    <ActivityIndicator size="small" color={colors.black} />
                                    <Text style={styles.locationLoadingText}>Getting your location...</Text>
                                </View>
                            ) : selectedArea ? (
                                <View style={styles.locationInfoContainer}>
                                    <Text style={styles.locationLabel}>Current Location:</Text>
                                    <Text style={styles.locationText}>
                                        {selectedArea}{selectedCity && selectedCity !== selectedArea ? `, ${selectedCity}` : ''}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.locationErrorText}>
                                    Unable to get location. Please check permissions.
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuContainer: {
        marginTop: 20,
        paddingHorizontal: width * 0.05,
    },
    locationExpandedContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    locationLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    locationLoadingText: {
        marginLeft: 12,
        fontSize: 14,
        color: colors.darkGrey,
    },
    locationInfoContainer: {
        paddingVertical: 4,
    },
    locationLabel: {
        fontSize: 12,
        color: colors.darkGrey,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
    locationErrorText: {
        fontSize: 14,
        color: colors.red,
        textAlign: 'center',
        paddingVertical: 8,
    },
    signOutButton: {
        marginTop: 30,
        marginHorizontal: width * 0.05,
        backgroundColor: colors.black,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    signOutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
});

export default ProfileScreen;
