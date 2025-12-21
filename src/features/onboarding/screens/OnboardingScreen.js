import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Ball from '../../../assets/icons/ball.svg';
import blackBall from '../../../assets/icons/black-ball.png';
import Logo from '../../../assets/icons/logo.svg';
import { colors } from '../../../assets/theme/colors';
import ButtonSection from '../components/ButtonSection';
import Content from '../components/Content';
import slides from '../data/slides';
import { useAnimatedStyles } from '../hooks/useAnimatedStyles';
import { useOnboardingAnimations } from '../hooks/useOnboardingAnimations';

const { width, height } = Dimensions.get('window');

const AnimatedLogo = Animated.createAnimatedComponent(Logo);
const AnimatedBall = Animated.createAnimatedComponent(Ball);

const OnboardingScreen = () => {
    const { slideIndex, animationStep, sharedValues, handlers } = useOnboardingAnimations();
    const animatedStyles = useAnimatedStyles(sharedValues);

    useEffect(() => {
        handlers.playInitialAnimation();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.topDome, animatedStyles.topDomeAnimatedStyle]} />
            <Animated.View style={[styles.bottomDome, animatedStyles.bottomDomeAnimatedStyle]} />
            <Animated.View style={[styles.circle, animatedStyles.circleAnimatedStyle]} />
            <AnimatedLogo
                width={200}
                height={100}
                style={[styles.logo, animatedStyles.logoAnimatedStyle]}
            />
            <Animated.Image
                source={slides[slideIndex].imageSource}
                style={[styles.kicker, animatedStyles.kickerAnimatedStyle]}
                resizeMode="contain"
            />
            <Animated.Image
                source={blackBall}
                style={[styles.blackBall, animatedStyles.blackBallAnimatedStyle]}
                resizeMode="contain"
            />
            <Content slide={slides[slideIndex]} animationStep={animationStep} />
            <AnimatedBall
                width={60}
                height={60}
                fill={colors.lightGrey}
                style={[styles.ball, animatedStyles.ballAnimatedStyle]}
            />
            <ButtonSection
                onNext={handlers.handleNext}
                onSkip={handlers.handleSkip}
                animationStep={animationStep}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    topDome: {
        position: 'absolute',
        top: 0,
        width: width * 0.6,
        height: height * 0.38,
        alignSelf: 'center',
        backgroundColor: colors.darkGrey,
        borderBottomLeftRadius: width / 2,
        borderBottomRightRadius: width / 2,
    },
    bottomDome: {
        position: 'absolute',
        bottom: 0,
        width: width * 0.6,
        height: height * 0.5,
        alignSelf: 'center',
        backgroundColor: colors.darkGrey,
        borderTopLeftRadius: width / 2,
        borderTopRightRadius: width / 2,
    },
    logo: {
        position: 'absolute',
        top: height / 2 - 50,
        left: width / 2 - 100,
        width: 200,
        height: 100,
    },
    kicker: {
        position: 'absolute',
        width: width * 0.6,
        height: height * 0.3,
        alignSelf: 'center',
        top: height * 0.05,
    },
    blackBall: {
        position: 'absolute',
        width: width * 0.07,
        height: height * 0.07,
        left: width * 0.6,
        top: height * 0.07,
    },
    ball: {
        position: 'absolute',
        left: width * 0.01,
        top: height * 0.07,
        width: 30,
        height: 30,
        zIndex: 999,
    },
    circle: {
        position: 'absolute',
        top: height * 0.18,
        left: width * 0.05,
        width: width * 0.9,
        height: width * 0.9,
        backgroundColor: colors.darkGrey,
        borderRadius: (width * 0.9) / 2,
    }
});

export default OnboardingScreen;