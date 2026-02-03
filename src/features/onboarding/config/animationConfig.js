import { Dimensions } from 'react-native';

// Factory function to get fresh dimensions (prevents stale values after rotation)
export const getAnimationConfig = () => {
    const { width, height } = Dimensions.get('window');

    // Button section is at bottom: 40px
    // Position ball above buttons with consistent spacing
    const buttonBottomPosition = 40;
    const ballSpacingAboveButtons = 150;

    return {
        ballAnimations: [
            { x: width * 0.425, y: height - buttonBottomPosition - ballSpacingAboveButtons },
            { x: width * 0.035, y: height * 0.08 },
            { x: width * 0.79, y: height * 0.03 },
            { x: width * 0.775, y: height - buttonBottomPosition - ballSpacingAboveButtons },
        ],

        topDomeAnimations: [
            { opacity: 1 },
            { opacity: 0 },
            { opacity: 0 },
            { opacity: 0 },
        ],

        bottomDomeAnimations: [
            { opacity: 0 },
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 },
        ],

        circleAnimations: [
            { opacity: 0 },
            { opacity: 1 },
            { opacity: 0 },
            { opacity: 0 },
        ],

        blackBallAnimations: [
            { x: 0, y: 0, opacity: 1 },
            { x: 0, y: height * 0.25, opacity: 1 },
            { x: 0, y: height * 0.27, opacity: 1 },
            { x: 0, y: 0, opacity: 0 },
        ],

        logoAnimations: [
            { y: 0, x: 0, scale: 1 },
            { y: height * 0.037, x: 0, scale: 1 },
            { y: height * 0.123, x: 0, scale: 1 },
            { y: -height * 0.1, x: 0, scale: 1.3 },
        ],

        kickerAnimations: [
            { y: 0, scale: 1, x: 0 },
            { y: height * 0.037, scale: 1, x: 0 },
            { y: height * 0.025, scale: 1, x: 0 },
            { y: height * 0.1, scale: 0.6, x: width * 0.45 },
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
