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
const CARD_WIDTH = width * 0.9;
const IMAGE_HEIGHT = CARD_WIDTH * 0.6;

const CourtCard = ({ court, onPress, onLikePress, isLiked = false }) => {

    const handleLikePress = () => {
        if (onLikePress) {
            onLikePress(court.id, !isLiked);
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress && onPress(court)}
            activeOpacity={0.9}
        >
            {/* Image Section with Location Badge and Like Button */}
            <View style={styles.imageContainer}>
                <Image
                    source={court.image}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Location Badge - Top Left with Rounded Corner */}
                <View style={styles.locationBadge}>
                    <Ionicons name="location" size={14} color={colors.white} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {court.location}
                    </Text>
                </View>

                {/* Like Button - Top Right */}
                <TouchableOpacity
                    style={styles.likeButton}
                    onPress={handleLikePress}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isLiked ? colors.red : colors.white}
                    />
                </TouchableOpacity>
            </View>

            {/* White Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.courtName} numberOfLines={1}>
                    {court.name}
                </Text>

                <View style={styles.detailsRow}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color={colors.yellow} />
                        <Text style={styles.ratingText}>{court.rating}</Text>
                        <Text style={styles.reviewsText}>({court.reviews})</Text>
                    </View>

                    <View style={styles.typeContainer}>
                        <Ionicons name="football" size={16} color={colors.primary} />
                        <Text style={styles.typeText}>{court.type}</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                        {court.price} <Text style={styles.priceUnit}>{court.priceUnit}</Text>
                    </Text>
                    {!court.available && (
                        <View style={styles.unavailableBadge}>
                            <Text style={styles.unavailableText}>Unavailable</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: IMAGE_HEIGHT,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    locationBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomRightRadius: 12,
        borderTopLeftRadius: 16,
        maxWidth: CARD_WIDTH * 0.7,
    },
    locationText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    likeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoSection: {
        backgroundColor: colors.white,
        padding: 16,
    },
    courtName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
        marginLeft: 4,
    },
    reviewsText: {
        fontSize: 12,
        color: colors.darkGrey,
        marginLeft: 4,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    priceUnit: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.darkGrey,
    },
    unavailableBadge: {
        backgroundColor: colors.red,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    unavailableText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default CourtCard;
