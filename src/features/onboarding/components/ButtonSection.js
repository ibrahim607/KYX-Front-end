import { StyleSheet, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';

const ButtonSection = ({ onNext, onSkip, animationStep }) => {
    // Show "Get Started" button on step 2, otherwise show Skip/Next
    if (animationStep === 2) {
        return (
            <View style={styles.container}>
                <CustomButton
                    title="Get Started"
                    backgroundColor={colors.black}
                    textColor={colors.white}
                    onPress={onNext}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomButton
                title="Skip"
                backgroundColor={colors.white}
                textColor={colors.black}
                bordered
                onPress={onSkip}
            />
            <CustomButton
                title="Next"
                backgroundColor={colors.black}
                textColor={colors.white}
                onPress={onNext}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 26,
        paddingHorizontal: 20,
    },
})

export default ButtonSection
