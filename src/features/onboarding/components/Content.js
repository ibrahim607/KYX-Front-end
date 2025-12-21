import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';

const Content = ({ slide, animationStep }) => {
    const subtitleColor = animationStep === 2 ? colors.white : colors.darkGrey;

    return (
        <View style={styles.container} pointerEvents="box-none">
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{slide.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 280,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: colors.darkGrey,
        alignSelf: 'center',
        paddingHorizontal: 80,
        textAlign: 'center',
    },
})

export default Content