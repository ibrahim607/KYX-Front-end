import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const RootNavigator = () => {
    const { isAuthenticated } = useAuthStore();
    // Ideally, checking auth state might be async, handling loading here:
    const isLoading = false;

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default RootNavigator;
