import { useAnimatedStyle } from 'react-native-reanimated';

export const useAnimatedStyles = (sharedValues) => {
    const {
        topDomeOpacity,
        bottomDomeOpacity,
        logoTranslateY,
        logoExtraTranslateY,
        logoTranslateX,
        kickerScale,
        kickerTranslateY,
        blackBallScale,
        blackBallTranslateX,
        blackBallTranslateY,
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
            { translateX: logoTranslateX.value }
        ],
    }));

    const kickerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleX: kickerScale.value },
            { scaleY: kickerScale.value },
            { translateY: kickerTranslateY.value }
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
        opacity: blackBallScale.value,
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
