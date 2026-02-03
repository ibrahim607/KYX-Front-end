import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import { useNotificationStore } from '../../../store';

const NotificationScreen = () => {
    const navigation = useNavigation();

    // Get notifications from store
    const notifications = useNotificationStore((state) => state.notifications);
    const toggleExpand = useNotificationStore((state) => state.toggleExpand);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const initializeMockData = useNotificationStore((state) => state.initializeMockData);

    // Initialize mock data on mount (remove this when connecting to real API)
    useEffect(() => {
        if (notifications.length === 0) {
            initializeMockData();
        }
    }, []);

    const handleToggleExpand = (id) => {
        toggleExpand(id);
    };

    const handleMarkAsRead = (id) => {
        markAsRead(id);
    };

    const renderNotificationCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationCard, item.isRead && styles.notificationCardRead]}
            onPress={() => handleToggleExpand(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                {/* Square Icon */}
                <View style={[styles.iconSquare, item.isRead && styles.iconSquareRead]}>
                    <Image
                        source={require('../../../assets/images/Container.png')}
                        style={styles.iconImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text style={[styles.notificationTitle, item.isRead && styles.notificationTitleRead]}>{item.title}</Text>
                    <Text style={[styles.orderId, item.isRead && styles.orderIdRead]}>{item.orderId}</Text>

                    {!item.isRead && (
                        <TouchableOpacity
                            style={styles.markAsReadButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(item.id);
                            }}
                        >
                            <Text style={styles.markAsReadText}>Mark as Read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Expand/Collapse Icon */}
                <Ionicons
                    name={item.isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.darkGrey}
                    style={styles.expandIcon}
                />
            </View>

            {/* Expanded Description */}
            {item.isExpanded && (
                <View style={styles.expandedContent}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Image
                source={require('../../../assets/images/illustration.png')}
                style={styles.illustration}
                resizeMode="contain"
            />
            <Text style={styles.emptyStateHeader}>
                No Notification Available At This Time
            </Text>
            <Text style={styles.emptyStateMessage}>
                We strive to keep you informed, and when there are updates or important messages for you, we'll make sure to notify you promptly. Thank you for using our app, and stay tuned for future notifications!
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Notifications"
                onBackPress={() => navigation.goBack()}
            />

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    notificationCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    notificationCardRead: {
        opacity: 0.6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconSquare: {
        width: 50,
        height: 50,
        backgroundColor: colors.backgroundGrey,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    iconSquareRead: {
        backgroundColor: '#f5f5f5',
    },
    iconImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 4,
    },
    notificationTitleRead: {
        color: colors.darkGrey,
    },
    orderId: {
        fontSize: 14,
        color: colors.darkGrey,
        marginBottom: 8,
    },
    orderIdRead: {
        color: colors.lightGrey,
    },
    markAsReadButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: colors.primary,
        borderRadius: 6,
        marginTop: 4,
    },
    markAsReadText: {
        fontSize: 12,
        color: colors.white,
        fontWeight: '600',
    },
    expandIcon: {
        marginLeft: 8,
        marginTop: 4,
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    description: {
        fontSize: 14,
        color: colors.darkGrey,
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        color: colors.lightGrey,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    illustration: {
        width: 180,
        height: 180,
        marginBottom: 24,
    },
    emptyStateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyStateMessage: {
        fontSize: 14,
        color: colors.darkGrey,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default NotificationScreen;
