import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaymentScreen from '../features/booking/screens/PaymentScreen';
import PitchDetailsScreen from '../features/booking/screens/PitchDetailsScreen';
import ChangePasswordScreen from '../features/profile/screens/ChangePasswordScreen';
import EditProfileScreen from '../features/profile/screens/EditProfileScreen';
import NotificationScreen from '../features/profile/screens/NotificationScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="PitchDetails" component={PitchDetailsScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            {/* Add additional screens here that should be outside the tab navigator */}
        </Stack.Navigator>
    );
};

export default AppStack;
