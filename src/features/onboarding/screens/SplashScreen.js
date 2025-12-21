import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';
import { colors } from '../../../assets/theme/colors';

// Import SVGs as components
import Ball from '../../../assets/icons/ball.svg';
import Logo from '../../../assets/icons/logo.svg';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = width * 0.35;

// Create Animated components for the SVGs
const AnimatedLogo = Animated.createAnimatedComponent(Logo);
const AnimatedBall = Animated.createAnimatedComponent(Ball);

const SplashScreen = ({ navigation }) => {
    const logoScale = useSharedValue(0);
    const ballsScale = useSharedValue(0);

    const navigateToOnboarding = () => {
        navigation.replace('Onboarding');
    };

    useEffect(() => {
        logoScale.value = withTiming(1, { duration: 800 });
        ballsScale.value = withDelay(200, withTiming(1, { duration: 800 }));

        const timer = setTimeout(() => {
            runOnJS(navigateToOnboarding)();
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
    }));

    const balls = [0, 60, 120, 180, 240, 300];

    return (
        <View style={styles.container}>
            <AnimatedLogo
                width={150}
                height={80}
                style={[styles.logo, logoAnimatedStyle]}
            />

            {balls.map((angle, index) => {
                const rad = (angle * Math.PI) / 180;
                const x = CIRCLE_RADIUS * Math.cos(rad);
                const y = CIRCLE_RADIUS * Math.sin(rad);

                // Create a unique animated style for each ball to handle translation + scale
                const ballStyle = useAnimatedStyle(() => {
                    return {
                        transform: [
                            { translateX: x },
                            { translateY: y },
                            { scale: ballsScale.value }
                        ],
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.ballContainer, ballStyle]}
                    >
                        <Ball width={30} height={30} fill="#B0B0B0" />
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        // zIndex is not typically needed on SVG components in the same container context usually, 
        // but kept for stacking order if balls overlap.
        zIndex: 10,
    },
    ballContainer: {
        position: 'absolute',
        // The View itself is absolute centered, then transformed out.
        // We no longer style the Ball component with absolute/tintColor directly in the mapped array
        // because we wrapped it in Animated.View for easier transforms.
    },
});

export default SplashScreen;