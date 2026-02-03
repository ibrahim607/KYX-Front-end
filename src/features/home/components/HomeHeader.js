import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomArrowIcon from '../../../assets/icons/bottom-arrow.svg';
import LocationIcon from '../../../assets/icons/location.svg';
import Logo from '../../../assets/icons/logo.svg';

const { width, height } = Dimensions.get('window');

const HomeHeader = ({ location = 'Select Location', onLocationPress }) => {
    return (
        <View style={styles.header}>
            <Logo width={width * 0.25} height={height * 0.06} />
            <TouchableOpacity style={styles.locationContainer} onPress={onLocationPress}>
                <LocationIcon width={width * 0.04} height={height * 0.02} />
                <Text style={styles.locationText}>{location}</Text>
                <BottomArrowIcon width={width * 0.04} height={height * 0.02} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: height * 0.06,
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
        gap: height * 0.01,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.02,
    },
    locationText: {
        fontSize: width * 0.035,
        color: '#333',
    },
});

export default HomeHeader;
