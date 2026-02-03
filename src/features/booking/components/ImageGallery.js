import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.6;
const THUMBNAIL_SIZE = width * 0.18;

/**
 * ImageGallery Component
 * Displays a main image with thumbnails below for navigation
 * 
 * @param {Array} images - Array of image URIs or objects with uri property
 */
const ImageGallery = ({ images = [] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Normalize images to array of URIs
    const imageUris = images.map(img =>
        typeof img === 'string' ? img : img?.uri || img
    );

    // If no images provided, show placeholder
    if (imageUris.length === 0) {
        return (
            <View style={styles.container}>
                <View style={[styles.mainImage, styles.placeholder]}>
                    <Image
                        source={require('../../../assets/icons/black-pitch.svg')}
                        style={styles.placeholderIcon}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Image */}
            <View style={styles.mainImageContainer}>
                <Image
                    source={{ uri: imageUris[selectedIndex] }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
            </View>

            {/* Thumbnail Strip */}
            {imageUris.length > 1 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailContainer}
                    style={styles.thumbnailScroll}
                >
                    {imageUris.map((uri, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedIndex(index)}
                            style={[
                                styles.thumbnail,
                                selectedIndex === index && styles.thumbnailSelected
                            ]}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri }}
                                style={styles.thumbnailImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    mainImageContainer: {
        width: '100%',
        height: IMAGE_HEIGHT,
        backgroundColor: colors.lightGrey,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundGrey,
    },
    placeholderIcon: {
        width: 80,
        height: 80,
        tintColor: colors.darkGrey,
    },
    thumbnailScroll: {
        marginTop: 12,
    },
    thumbnailContainer: {
        paddingHorizontal: width * 0.05,
        gap: 8,
    },
    thumbnail: {
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        marginRight: 8,
    },
    thumbnailSelected: {
        borderColor: colors.black,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
});

export default ImageGallery;
