import { registerRootComponent } from 'expo';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
    return (
        <RootNavigator />
    );
}

registerRootComponent(App);
