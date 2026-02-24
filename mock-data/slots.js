/**
 * Mock Slots Data
 * Based on KYX API OpenAPI Specification
 * Slots represent available time slots for fields
 */

export const mockSlots = [
    // Cairo Stadium Pitch slots
    {
        id: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        date: '2026-01-28',
        startTime: '18:00:00',
        endTime: '20:00:00',
        isBooked: true,
        isBlocked: false,
    },
    {
        id: 's1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        date: '2026-01-28',
        startTime: '20:00:00',
        endTime: '22:00:00',
        isBooked: false,
        isBlocked: false,
    },
    {
        id: 's1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        date: '2026-01-29',
        startTime: '16:00:00',
        endTime: '18:00:00',
        isBooked: false,
        isBlocked: false,
    },

    // Madinaty Sports Complex slots
    {
        id: 's2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7',
        fieldId: '9a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        date: '2026-01-30',
        startTime: '16:00:00',
        endTime: '18:00:00',
        isBooked: true,
        isBlocked: false,
    },
    {
        id: 's2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
        fieldId: '9a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        date: '2026-01-30',
        startTime: '18:00:00',
        endTime: '20:00:00',
        isBooked: false,
        isBlocked: false,
    },

    // Zamalek Sports Club slots
    {
        id: 's3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8',
        fieldId: '2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r',
        date: '2026-02-05',
        startTime: '19:00:00',
        endTime: '20:00:00',
        isBooked: true,
        isBlocked: false,
    },
    {
        id: 's3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
        fieldId: '2c3d4e5f-6g7h-8i9j-0k1l-2m3n4o5p6q7r',
        date: '2026-02-05',
        startTime: '20:00:00',
        endTime: '21:00:00',
        isBooked: false,
        isBlocked: false,
    },

    // Maadi Football Ground slots
    {
        id: 's4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9',
        fieldId: '5f6g7h8i-9j0k-1l2m-3n4o-5p6q7r8s9t0u',
        date: '2026-01-15',
        startTime: '17:00:00',
        endTime: '19:00:00',
        isBooked: true,
        isBlocked: false,
    },
];

/**
 * Field Availabilities (recurring schedule)
 */
export const mockFieldAvailabilities = [
    // Cairo Stadium Pitch availability
    {
        id: 'fa1a2b3c-4d5e-6f7g-8h9i-0j1k2l3m4n5o',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Monday',
        startTime: '16:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Tuesday',
        startTime: '16:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1c2d3e-4f5g-6h7i-8j9k-0l1m2n3o4p5q',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Wednesday',
        startTime: '16:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1d2e3f-4g5h-6i7j-8k9l-0m1n2o3p4q5r',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Thursday',
        startTime: '16:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1e2f3g-4h5i-6j7k-8l9m-0n1o2p3q4r5s',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Friday',
        startTime: '10:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1f2g3h-4i5j-6k7l-8m9n-0o1p2q3r4s5t',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Saturday',
        startTime: '10:00:00',
        endTime: '23:00:00',
    },
    {
        id: 'fa1g2h3i-4j5k-6l7m-8n9o-0p1q2r3s4t5u',
        fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
        dayOfWeek: 'Sunday',
        startTime: '10:00:00',
        endTime: '23:00:00',
    },
];

/**
 * Get all slots
 */
export const getAllSlots = () => {
    return mockSlots;
};

/**
 * Get slots by field ID
 */
export const getSlotsByField = (fieldId) => {
    return mockSlots.filter(slot => slot.fieldId === fieldId);
};

/**
 * Get slots by field and date
 */
export const getSlotsByFieldAndDate = (fieldId, date) => {
    return mockSlots.filter(slot =>
        slot.fieldId === fieldId && slot.date === date
    );
};

/**
 * Get available slots (not booked, not blocked)
 */
export const getAvailableSlots = (fieldId, date) => {
    return mockSlots.filter(slot =>
        slot.fieldId === fieldId &&
        slot.date === date &&
        !slot.isBooked &&
        !slot.isBlocked
    );
};

/**
 * Get field availabilities by field ID
 */
export const getFieldAvailabilities = (fieldId) => {
    return mockFieldAvailabilities.filter(avail => avail.fieldId === fieldId);
};

/**
 * Get field availability by day of week
 */
export const getFieldAvailabilityByDay = (fieldId, dayOfWeek) => {
    return mockFieldAvailabilities.find(avail =>
        avail.fieldId === fieldId && avail.dayOfWeek === dayOfWeek
    );
};

/**
 * Block/Unblock a slot
 */
export const toggleSlotBlock = (slotId, isBlocked) => {
    const slot = mockSlots.find(s => s.id === slotId);
    if (slot) {
        slot.isBlocked = isBlocked;
    }
    return slot;
};

/**
 * Delete a slot
 */
export const deleteSlot = (slotId) => {
    const index = mockSlots.findIndex(s => s.id === slotId);
    if (index !== -1) {
        mockSlots.splice(index, 1);
        return true;
    }
    return false;
};
