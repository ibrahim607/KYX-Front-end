import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlackPitchIcon from '../assets/icons/black-pitch.svg';
import WhitePitchIcon from '../assets/icons/white-pitch.svg';
import BookingScreen from '../features/booking/screens/BookingScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import SavedPitchesScreen from '../features/saved/screens/SavedPitchesScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, size }) => {
                    // Custom icon rendering for Bookings with pitch SVG
                    if (route.name === 'Bookings') {
                        const PitchIcon = focused ? BlackPitchIcon : WhitePitchIcon;
                        return <PitchIcon width={size} height={size} style={focused && styles.iconShadow} />;
                    }

                    // Custom icon rendering for Saved with heart icon
                    if (route.name === 'Saved') {
                        const iconName = focused ? 'heart' : 'heart-outline';
                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={focused ? '#000000' : '#8E8E93'}
                                style={focused && styles.iconShadow}
                            />
                        );
                    }

                    // Default icons for Home and Profile
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={focused ? '#000000' : '#8E8E93'}
                            style={focused && styles.iconShadow}
                        />
                    );
                },
                tabBarStyle: {
                    ...styles.tabBar,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                },
                tabBarItemStyle: styles.tabBarItem,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingScreen}
            />
            <Tab.Screen
                name="Saved"
                component={SavedPitchesScreen}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingTop: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tabBarItem: {
        paddingVertical: 4,
    },
    iconShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});

export default BottomTabNavigator;
