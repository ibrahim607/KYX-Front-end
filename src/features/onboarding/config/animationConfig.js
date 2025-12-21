import { Dimensions } from 'react-native';

/**
 * Animation Configuration Factory
 * 
 * IMPORTANT: Uses factory functions to get fresh dimensions on each call.
 * This prevents stale dimensions after:
 * - Device orientation changes
 * - Window resizing (split-screen on tablets)
 * - App returning from background
 * 
 * Usage: Call getAnimationConfig() to get current dimension-based values
 */

/**
 * Get current window dimensions and calculate all animation configs
 * @returns {Object} Animation configurations with current dimensions
 */
export const getAnimationConfig = () => {
    const { width, height } = Dimensions.get('window');

    return {
        // Ball animation positions for each step
        ballAnimations: [
            // Step 0: Initial position (set in useEffect)
            { x: width * 0.45 - width * 0.025, y: height * 0.75 - height * 0.07 },
            // Step 1: First "Next" click
            { x: width * 0.06 - width * 0.025, y: height * 0.15 - height * 0.07 },
            // Step 2: Second "Next" click - move to top right
            { x: width * 0.8 - width * 0.01, y: height * 0.1 - height * 0.07 },
        ],

        // Top dome opacity animations
        topDomeAnimations: [
            { opacity: 1 }, // Step 0: Visible
            { opacity: 0 }, // Step 1: Hidden (circle shows)
            { opacity: 0 }, // Step 2: Hidden (bottom dome appears)
        ],

        // Bottom dome opacity animations
        bottomDomeAnimations: [
            { opacity: 0 }, // Step 0: Hidden
            { opacity: 0 }, // Step 1: Hidden
            { opacity: 1 }, // Step 2: Visible!
        ],

        // Circle opacity animations
        circleAnimations: [
            { opacity: 0 }, // Step 0: Hidden
            { opacity: 1 }, // Step 1: Visible!
            { opacity: 0 }, // Step 2: Hidden (bottom dome shows)
        ],

        // Black ball position animations
        blackBallAnimations: [
            // Step 0: Initial position (no movement)
            { x: 0, y: 0 },
            // Step 1: First "Next" click - move down (responsive)
            { x: 0, y: height * 0.25 },
            // Step 2: Second "Next" click - move down more
            { x: -width * 0.001, y: height * 0.27 },
        ],

        // Logo position animations
        logoAnimations: [
            // Step 0: Initial position
            { y: 0, x: 0 },
            // Step 1: Move down (responsive)
            { y: height * 0.037, x: 0 },
            // Step 2: Center the logo (responsive)
            { y: height * 0.123, x: 0 },
        ],

        // Kicker position animations
        kickerAnimations: [
            // Step 0: Initial position
            { y: 0 },
            // Step 1: Move down (responsive)
            { y: height * 0.037 },
            // Step 2: Move down (responsive)
            { y: height * 0.025 },
        ],

        // Export dimensions for convenience
        dimensions: { width, height },
    };
};

// Backward compatibility: Export individual getters
export const getBallAnimations = () => getAnimationConfig().ballAnimations;
export const getTopDomeAnimations = () => getAnimationConfig().topDomeAnimations;
export const getBottomDomeAnimations = () => getAnimationConfig().bottomDomeAnimations;
export const getCircleAnimations = () => getAnimationConfig().circleAnimations;
export const getBlackBallAnimations = () => getAnimationConfig().blackBallAnimations;
export const getLogoAnimations = () => getAnimationConfig().logoAnimations;
export const getKickerAnimations = () => getAnimationConfig().kickerAnimations;
