import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');

const ProfileMenuItem = ({ icon, title, onPress, showBadge = false }) => {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={24} color={colors.black} />
                    {showBadge && <View style={styles.badge} />}
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color={colors.darkGrey} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.red,
        borderWidth: 2,
        borderColor: colors.white,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
    },
});

export default ProfileMenuItem;
