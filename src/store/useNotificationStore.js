import { create } from 'zustand';

/**
 * Notification Store
 * Manages notification state globally across the app
 */
const useNotificationStore = create((set, get) => ({
    // State
    notifications: [],

    // Computed - Check if there are unread notifications
    hasUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.some(notif => !notif.isRead);
    },

    // Get unread count
    getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(notif => !notif.isRead).length;
    },

    // Actions
    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        )
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(notif => ({ ...notif, isRead: true }))
    })),

    toggleExpand: (id) => set((state) => ({
        notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, isExpanded: !notif.isExpanded } : notif
        )
    })),

    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(notif => notif.id !== id)
    })),

    clearNotifications: () => set({ notifications: [] }),

    // Initialize with mock data (remove this when connecting to real API)
    initializeMockData: () => set({
        notifications: [
            {
                id: '1',
                title: 'Booking Confirmed',
                orderId: '#ORD12345',
                description: 'Your booking for Pitch A has been confirmed for tomorrow at 3:00 PM. Please arrive 15 minutes early.',
                time: '2 hours ago',
                isRead: false,
                isExpanded: false,
            },
            {
                id: '2',
                title: 'New Message',
                orderId: '#ORD12346',
                description: 'You have a new message from the venue manager regarding your upcoming booking. Please check your messages.',
                time: '5 hours ago',
                isRead: false,
                isExpanded: false,
            },
        ]
    }),
}));

export default useNotificationStore;
