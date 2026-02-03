import { useAnimatedStyle } from 'react-native-reanimated';

export const useAnimatedStyles = (sharedValues) => {
    const {
        topDomeOpacity,
        bottomDomeOpacity,
        logoTranslateY,
        logoExtraTranslateY,
        logoTranslateX,
        logoScale,
        kickerScale,
        kickerTranslateY,
        kickerTranslateX,
        kickerExtraScale,
        blackBallScale,
        blackBallTranslateX,
        blackBallTranslateY,
        blackBallOpacity,
        ballTranslateX,
        ballTranslateY,
        ballOpacity,
        circleOpacity,
    } = sharedValues;

    const topDomeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleX: 1.5 * topDomeOpacity.value },
            { scaleY: topDomeOpacity.value }
        ],
        opacity: topDomeOpacity.value,
    }));

    const bottomDomeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleX: 1.5 * bottomDomeOpacity.value },
            { scaleY: bottomDomeOpacity.value }
        ],
        opacity: bottomDomeOpacity.value,
    }));

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: logoTranslateY.value + logoExtraTranslateY.value },
            { translateX: logoTranslateX.value },
            { scale: logoScale.value }
        ],
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // For Android
    }));

    const kickerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleX: kickerScale.value * kickerExtraScale.value },
            { scaleY: kickerScale.value * kickerExtraScale.value },
            { translateY: kickerTranslateY.value },
            { translateX: kickerTranslateX.value }
        ],
        opacity: kickerScale.value,
    }));

    const blackBallAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleX: blackBallScale.value },
            { scaleY: blackBallScale.value },
            { translateX: blackBallTranslateX.value },
            { translateY: blackBallTranslateY.value }
        ],
        opacity: blackBallOpacity.value,
    }));

    const ballAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: ballTranslateX.value },
            { translateY: ballTranslateY.value }
        ],
        opacity: 1,
    }));

    const circleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: circleOpacity.value,
    }));

    return {
        topDomeAnimatedStyle,
        bottomDomeAnimatedStyle,
        logoAnimatedStyle,
        kickerAnimatedStyle,
        blackBallAnimatedStyle,
        ballAnimatedStyle,
        circleAnimatedStyle,
    };
};
