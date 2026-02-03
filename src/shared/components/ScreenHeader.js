import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/theme/colors';

const { width, height } = Dimensions.get('window');

const ScreenHeader = ({ title, onBackPress, rightAction }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
            >
                <Image
                    source={require('../../assets/icons/arrow_left.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.rightContainer}>
                {rightAction || <View style={styles.placeholder} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        paddingTop: height * 0.06,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        backgroundColor: colors.white,
    },
    backButton: {
        width: width * 0.1,
        height: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: width * 0.065,
        height: width * 0.065,
        tintColor: colors.black,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: colors.black,
        flex: 1,
        textAlign: 'center',
    },
    rightContainer: {
        width: width * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: width * 0.1,
    },
});

export default ScreenHeader;
