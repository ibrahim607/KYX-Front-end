import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const RootNavigator = () => {
    const { isAuthenticated, isInitialized, restoreSession } = useAuthStore();

    // Restore session from stored tokens on app startup
    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    // Show loading screen while auth state is being restored
    const isLoading = !isInitialized;

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
