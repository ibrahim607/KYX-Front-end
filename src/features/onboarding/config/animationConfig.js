import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Ball animation positions for each step
export const ballAnimations = [
    // Step 0: Initial position (set in useEffect)
    { x: width * 0.45 - width * 0.025, y: height * 0.75 - height * 0.07 },
    // Step 1: First "Next" click
    { x: width * 0.06 - width * 0.025, y: height * 0.15 - height * 0.07 },
    // Step 2: Second "Next" click - move to top right
    { x: width * 0.8 - width * 0.01, y: height * 0.1 - height * 0.07 },
];

// Top dome opacity animations
export const topDomeAnimations = [
    { opacity: 1 }, // Step 0: Visible
    { opacity: 0 }, // Step 1: Hidden (circle shows)
    { opacity: 0 }, // Step 2: Hidden (bottom dome appears)
];

// Bottom dome opacity animations
export const bottomDomeAnimations = [
    { opacity: 0 }, // Step 0: Hidden
    { opacity: 0 }, // Step 1: Hidden
    { opacity: 1 }, // Step 2: Visible!
];

// Circle opacity animations
export const circleAnimations = [
    { opacity: 0 }, // Step 0: Hidden
    { opacity: 1 }, // Step 1: Visible!
    { opacity: 0 }, // Step 2: Hidden (bottom dome shows)
];

// Black ball position animations
export const blackBallAnimations = [
    // Step 0: Initial position (no movement)
    { x: 0, y: 0 },
    // Step 1: First "Next" click - move down (responsive)
    { x: 0, y: height * 0.25 },
    // Step 2: Second "Next" click - move down more
    { x: -width * 0.001, y: height * 0.27 },
];

// Logo position animations
export const logoAnimations = [
    // Step 0: Initial position
    { y: 0, x: 0 },
    // Step 1: Move down (responsive)
    { y: height * 0.037, x: 0 },
    // Step 2: Center the logo (responsive)
    { y: height * 0.123, x: 0 },
];

// Kicker position animations
export const kickerAnimations = [
    // Step 0: Initial position
    { y: 0 },
    // Step 1: Move down (responsive)
    { y: height * 0.037 },
    // Step 2: Move down (responsive)
    { y: height * 0.025 },
];
