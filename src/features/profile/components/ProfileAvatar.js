import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = width * 0.3;

const ProfileAvatar = ({ imageUri, name, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={onPress}
                activeOpacity={0.8}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                ) : (
                    <View style={styles.placeholderAvatar}>
                        <Ionicons name="person" size={AVATAR_SIZE * 0.5} color={colors.darkGrey} />
                    </View>
                )}

                {/* Camera Icon Overlay */}
                <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={20} color={colors.white} />
                </View>
            </TouchableOpacity>

            {/* User Name */}
            {name && (
                <Text style={styles.name}>{name}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 3,
        borderColor: colors.white,
    },
    placeholderAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.black,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center',
    },
});

export default ProfileAvatar;
