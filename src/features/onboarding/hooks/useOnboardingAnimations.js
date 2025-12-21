import { useState } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import {
    ballAnimations,
    blackBallAnimations,
    bottomDomeAnimations,
    circleAnimations,
    kickerAnimations,
    logoAnimations,
    topDomeAnimations
} from '../config/animationConfig';

const { width, height } = Dimensions.get('window');

export const useOnboardingAnimations = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [animationStep, setAnimationStep] = useState(0);

    // Shared values for animations
    const topDomeOpacity = useSharedValue(0);
    const bottomDomeOpacity = useSharedValue(0);
    const logoTranslateY = useSharedValue(0);
    const logoExtraTranslateY = useSharedValue(0); // For step-based movement
    const logoTranslateX = useSharedValue(0); // For horizontal movement
    const kickerScale = useSharedValue(0);
    const kickerTranslateY = useSharedValue(0); // For step-based movement
    const blackBallScale = useSharedValue(0);
    const blackBallTranslateY = useSharedValue(0);
    const blackBallTranslateX = useSharedValue(0);
    const ballTranslateX = useSharedValue(0);
    const ballTranslateY = useSharedValue(0);
    const ballOpacity = useSharedValue(0);
    const circleOpacity = useSharedValue(0);

    // Initial animation on mount
    const playInitialAnimation = () => {
        topDomeOpacity.value = withTiming(1, { duration: 500 });
        logoTranslateY.value = withDelay(100, withTiming(-(height * 0.12), { duration: 800 }));
        kickerScale.value = withDelay(100, withTiming(1, { duration: 800 }));
        blackBallScale.value = withDelay(100, withTiming(1, { duration: 800 }));

        const { x, y } = ballAnimations[0];
        ballTranslateX.value = withDelay(100, withTiming(x, { duration: 800 }));
        ballTranslateY.value = withDelay(100, withTiming(y, { duration: 800 }));
        ballOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    };

    // Handle Next button
    const handleNext = () => {
        const nextStep = animationStep + 1;

        // Update slide index if within bounds
        if (slideIndex < 2) { // Assuming 3 slides (0, 1, 2)
            setSlideIndex(slideIndex + 1);
        }

        // Animate if there's a next animation step
        if (nextStep < ballAnimations.length) {
            setAnimationStep(nextStep);

            // Ball animations
            const { x, y } = ballAnimations[nextStep];
            ballTranslateX.value = withTiming(x, { duration: 600 });
            ballTranslateY.value = withTiming(y, { duration: 600 });

            // Top and Bottom Dome animations
            topDomeOpacity.value = withTiming(topDomeAnimations[nextStep].opacity, { duration: 600 });
            bottomDomeOpacity.value = withTiming(bottomDomeAnimations[nextStep].opacity, { duration: 600 });

            // Circle animation
            circleOpacity.value = withTiming(circleAnimations[nextStep].opacity, { duration: 600 });

            // Black ball animation
            const blackBall = blackBallAnimations[nextStep];
            blackBallTranslateX.value = withTiming(blackBall.x, { duration: 600 });
            blackBallTranslateY.value = withTiming(blackBall.y, { duration: 600 });

            // Logo animation
            const logo = logoAnimations[nextStep];
            logoExtraTranslateY.value = withTiming(logo.y, { duration: 600 });
            logoTranslateX.value = withTiming(logo.x, { duration: 600 });

            // Kicker animation
            kickerTranslateY.value = withTiming(kickerAnimations[nextStep].y, { duration: 600 });
        }
    };

    // Handle Skip button - resets animation for development
    const handleSkip = () => {
        handleReset();
    };

    // Reset animation (for development)
    const handleReset = () => {
        setSlideIndex(0);
        setAnimationStep(0);

        // Reset all values
        topDomeOpacity.value = 0;
        bottomDomeOpacity.value = 0;
        logoTranslateY.value = 0;
        logoExtraTranslateY.value = 0;
        logoTranslateX.value = 0;
        kickerScale.value = 0;
        kickerTranslateY.value = 0;
        blackBallScale.value = 0;
        blackBallTranslateX.value = 0;
        blackBallTranslateY.value = 0;
        ballTranslateX.value = 0;
        ballTranslateY.value = 0;
        ballOpacity.value = 0;
        circleOpacity.value = 0;

        // Replay initial animation
        playInitialAnimation();
    };

    return {
        slideIndex,
        animationStep,
        sharedValues: {
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
        },
        handlers: {
            playInitialAnimation,
            handleNext,
            handleSkip,
            handleReset,
        },
    };
};
