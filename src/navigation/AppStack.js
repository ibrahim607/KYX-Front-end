import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingScreen from '../features/booking/screens/BookingScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Booking" component={BookingScreen} />
        </Stack.Navigator>
    );
};

export default AppStack;
