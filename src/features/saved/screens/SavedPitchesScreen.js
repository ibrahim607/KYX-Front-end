import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import CourtCard from '../../home/components/CourtCard';
import useCourtStore from '../../home/store/useCourtStore';

const SavedPitchesScreen = () => {
    const navigation = useNavigation();
    const { favoriteCourts, isLoading, toggleFavorite, isFavorite } = useCourtStore();

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    const handleCourtPress = (court) => {
        navigation.navigate('PitchDetails', { pitchId: court.id });
    };

    const handleLikePress = async (courtId, isLiked) => {
        try {
            await toggleFavorite(courtId);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title="Saved Pitches" onBackPress={handleBackPress} />

            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading favorites...</Text>
                </View>
            ) : favoriteCourts.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text style={styles.emptyTitle}>No Saved Pitches</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the heart icon on any pitch to save it here
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.countText}>
                        {favoriteCourts.length} {favoriteCourts.length === 1 ? 'Pitch' : 'Pitches'}
                    </Text>
                    {favoriteCourts.map((court) => (
                        <CourtCard
                            key={court.id}
                            court={court}
                            onPress={handleCourtPress}
                            onLikePress={handleLikePress}
                            isLiked={isFavorite(court.id)}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 40,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        fontSize: 16,
        color: colors.darkGrey,
        marginTop: 12,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colors.black,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: colors.darkGrey,
        textAlign: 'center',
        lineHeight: 22,
    },
    countText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 16,
        alignSelf: 'flex-start',
        marginLeft: '5%',
    },
});

export default SavedPitchesScreen;
