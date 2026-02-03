import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width, height } = Dimensions.get('window');

const Content = ({ slide, animationStep }) => {
    const subtitleColor = animationStep === 2 ? colors.white : colors.darkGrey;

    // For the final page (step 3), use a more compact layout
    const containerStyle = animationStep === 3
        ? [styles.container, styles.finalPageContainer]
        : styles.container;

    return (
        <View style={containerStyle} pointerEvents="box-none">
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{slide.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.35,  // Responsive: 35% from top
    },
    finalPageContainer: {
        marginTop: height * 0.22,  // Responsive: Less margin for final page
    },
    title: {
        fontSize: width * 0.08,    // Responsive font size
        fontWeight: 'bold',
        marginBottom: height * 0.02,
    },
    subtitle: {
        fontSize: width * 0.045,   // Responsive font size
        color: colors.darkGrey,
        alignSelf: 'center',
        paddingHorizontal: width * 0.2,  // Responsive padding
        textAlign: 'center',
    },
});

export default Content;