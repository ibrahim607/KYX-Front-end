import { Dimensions } from 'react-native';

// Factory function to get fresh dimensions (prevents stale values after rotation)
export const getAnimationConfig = () => {
    const { width, height } = Dimensions.get('window');

    return {
        ballAnimations: [
            { x: width * 0.45 - width * 0.025, y: height * 0.75 - height * 0.07 },
            { x: width * 0.06 - width * 0.025, y: height * 0.15 - height * 0.07 },
            { x: width * 0.8 - width * 0.01, y: height * 0.1 - height * 0.07 },
        ],

        topDomeAnimations: [
            { opacity: 1 },
            { opacity: 0 },
            { opacity: 0 },
        ],

        bottomDomeAnimations: [
            { opacity: 0 },
            { opacity: 0 },
            { opacity: 1 },
        ],

        circleAnimations: [
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 },
        ],

        blackBallAnimations: [
            { x: 0, y: 0 },
            { x: 0, y: height * 0.25 },
            { x: -width * 0.001, y: height * 0.27 },
        ],

        logoAnimations: [
            { y: 0, x: 0 },
            { y: height * 0.037, x: 0 },
            { y: height * 0.123, x: 0 },
        ],

        kickerAnimations: [
            { y: 0 },
            { y: height * 0.037 },
            { y: height * 0.025 },
        ],

        dimensions: { width, height },
    };
};

// Individual getters for backward compatibility
export const getBallAnimations = () => getAnimationConfig().ballAnimations;
export const getTopDomeAnimations = () => getAnimationConfig().topDomeAnimations;
export const getBottomDomeAnimations = () => getAnimationConfig().bottomDomeAnimations;
export const getCircleAnimations = () => getAnimationConfig().circleAnimations;
export const getBlackBallAnimations = () => getAnimationConfig().blackBallAnimations;
export const getLogoAnimations = () => getAnimationConfig().logoAnimations;
export const getKickerAnimations = () => getAnimationConfig().kickerAnimations;
