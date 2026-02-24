/**
 * Mock Bookings Data
 * Based on KYX API OpenAPI Specification
 */

import { getFieldById } from './fields';
import { getLocationString } from './locations';

export const mockBookings = [
    {
        id: '7h8i9j0k-1l2m-3n4o-5p6q-7r8s9t0u1v2w',
        customerId: '9914950e-7971-48cd-e3f7-40e8fe328130',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        slotId: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
        bookingDate: '2026-01-28',
        startTime: '18:00:00',
        endTime: '20:00:00',
        totalPrice: 600,
        status: 'Confirmed', // Confirmed, Pending, Cancelled
        paymentStatus: 'Paid', // Paid, Pending, Refunded
        createdAt: '2026-01-20T10:30:00Z',
    },
    {
        id: '8i9j0k1l-2m3n-4o5p-6q7r-8s9t0u1v2w3x',
        customerId: '9914950e-7971-48cd-e3f7-40e8fe328130',
        fieldId: '9a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        slotId: 's2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7',
        bookingDate: '2026-01-30',
        startTime: '16:00:00',
        endTime: '18:00:00',
        totalPrice: 900,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        createdAt: '2026-01-22T14:15:00Z',
    },
    {
        id: '9j0k1l2m-3n4o-5p6q-7r8s-9t0u1v2w3x4y',
        customerId: '9914950e-7971-48cd-e3f7-40e8fe328130',
        fieldId: '2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r',
        slotId: 's3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8',
        bookingDate: '2026-02-05',
        startTime: '19:00:00',
        endTime: '20:00:00',
        totalPrice: 600,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: '2026-01-25T09:45:00Z',
    },
    {
        id: '0k1l2m3n-4o5p-6q7r-8s9t-0u1v2w3x4y5z',
        customerId: '9914950e-7971-48cd-e3f7-40e8fe328130',
        fieldId: '5f6g7h8i-9j0k-1l2m-3n4o-5p6q7r8s9t0u',
        slotId: 's4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9',
        bookingDate: '2026-01-15',
        startTime: '17:00:00',
        endTime: '19:00:00',
        totalPrice: 500,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        createdAt: '2026-01-10T11:20:00Z',
    },
];

/**
 * Get all bookings
 */
export const getAllBookings = () => {
    return mockBookings;
};

/**
 * Get booking by ID
 */
export const getBookingById = (id) => {
    return mockBookings.find(booking => booking.id === id);
};

/**
 * Get bookings by customer
 */
export const getBookingsByCustomer = (customerId) => {
    return mockBookings.filter(booking => booking.customerId === customerId);
};

/**
 * Get bookings by field
 */
export const getBookingsByField = (fieldId) => {
    return mockBookings.filter(booking => booking.fieldId === fieldId);
};

/**
 * Get bookings by status
 */
export const getBookingsByStatus = (status) => {
    return mockBookings.filter(booking => booking.status === status);
};

/**
 * Get upcoming bookings (future dates only)
 */
export const getUpcomingBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return mockBookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= today && booking.status !== 'Cancelled';
    });
};

/**
 * Get bookings by date range
 */
export const getBookingsByDateRange = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    return mockBookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= from && bookingDate <= to;
    });
};

/**
 * Get booking with field details
 */
export const getBookingWithDetails = (bookingId) => {
    const booking = getBookingById(bookingId);
    if (!booking) return null;

    const field = getFieldById(booking.fieldId);
    if (!field) return booking;

    return {
        ...booking,
        fieldName: field.name,
        fieldLocation: getLocationString(field.locationId),
        pricePerHour: field.pricePerHour,
    };
};

/**
 * Get all bookings with field details for display
 */
export const getAllBookingsWithDetails = () => {
    return mockBookings.map(booking => {
        const field = getFieldById(booking.fieldId);
        if (!field) return booking;

        // Format date and time for display
        const date = new Date(booking.bookingDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Convert 24h time to 12h format
        const [hours, minutes] = booking.startTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;

        // Calculate duration
        const startHour = parseInt(booking.startTime.split(':')[0]);
        const endHour = parseInt(booking.endTime.split(':')[0]);
        const duration = endHour - startHour;

        return {
            id: booking.id,
            courtId: booking.fieldId, // Keep for compatibility
            courtName: field.name,
            location: getLocationString(field.locationId),
            date: `${formattedDate} • ${formattedTime}`,
            duration: `${duration} hour${duration > 1 ? 's' : ''}`,
            price: booking.totalPrice,
            status: booking.status,
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });
};
