import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../../assets/theme/colors'

const CustomButton = ({ title, backgroundColor, textColor, onPress, bordered }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor },
                bordered && styles.bordered
            ]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    )
}

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
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 32,
    },
    bordered: {
        borderWidth: 1,
        borderColor: colors.darkGrey,
    },
    buttonText: {
        fontSize: 16,
        paddingHorizontal: 28,
        fontWeight: '600',
    },
})

export default ButtonSection