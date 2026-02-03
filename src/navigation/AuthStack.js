import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import NewPassword from '../features/auth/screens/NewPassword';
import OTP from '../features/auth/screens/OTP';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import SplashScreen from '../features/onboarding/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'none' }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTP" component={OTP} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
        </Stack.Navigator>
    );
};

export default AuthStack;
