import { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');

/**
 * TimeSlotPicker Component
 * Allows users to select date and multiple time slots for booking
 * 
 * @param {string} pitchId - Pitch ID to generate dynamic slots
 * @param {Function} onSlotsChange - Callback when selected slots change
 * @param {Array} selectedSlots - Currently selected slots
 */
const TimeSlotPicker = ({ pitchId, onSlotsChange, selectedSlots = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Generate next 7 days for date selection
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Determine display label
            let displayLabel;
            if (i === 0) {
                displayLabel = 'Today';
            } else if (i === 1) {
                displayLabel = 'Tomorrow';
            } else {
                // Format as "Wed,1 Oct"
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNumber = date.getDate();
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                displayLabel = `${dayName},${dayNumber} ${monthName}`;
            }

            dates.push({
                date: date,
                dateString: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                displayLabel: displayLabel,
                dayNumber: date.getDate(),
                monthName: date.toLocaleDateString('en-US', { month: 'short' }),
            });
        }
        return dates;
    };

    const dates = generateDates();

    // Set initial date if not set
    if (!selectedDate && dates.length > 0) {
        setSelectedDate(dates[0].dateString);
    }

    // Generate dynamic time slots based on pitchId and date
    const generateTimeSlots = (pitchId, dateString) => {
        // Use pitchId and date to create variation
        const pitchHash = pitchId ? pitchId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const dateHash = dateString ? dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const seed = pitchHash + dateHash;

        const allSlots = [
            { id: 'slot1', startTime: '06:00', endTime: '08:00' },
            { id: 'slot2', startTime: '08:00', endTime: '10:00' },
            { id: 'slot3', startTime: '10:00', endTime: '12:00' },
            { id: 'slot4', startTime: '12:00', endTime: '14:00' },
            { id: 'slot5', startTime: '14:00', endTime: '16:00' },
            { id: 'slot6', startTime: '16:00', endTime: '18:00' },
            { id: 'slot7', startTime: '18:00', endTime: '20:00' },
            { id: 'slot8', startTime: '20:00', endTime: '22:00' },
            { id: 'slot9', startTime: '22:00', endTime: '00:00' },
        ];

        // Make some slots unavailable based on seed (pseudo-random)
        return allSlots.map((slot, index) => {
            const slotSeed = seed + index;
            const isAvailable = slotSeed % 3 !== 0; // ~66% availability
            return {
                ...slot,
                available: isAvailable
            };
        });
    };

    const timeSlots = generateTimeSlots(pitchId, selectedDate);

    const handleDateSelect = (dateString) => {
        setSelectedDate(dateString);
        // Clear selected slots when date changes
        if (onSlotsChange) {
            onSlotsChange([]);
        }
    };

    const handleSlotToggle = (slot) => {
        if (!slot.available) return;

        const isSelected = selectedSlots.some(s => s.id === slot.id);
        let newSelectedSlots;

        if (isSelected) {
            newSelectedSlots = selectedSlots.filter(s => s.id !== slot.id);
        } else {
            newSelectedSlots = [...selectedSlots, { ...slot, date: selectedDate }];
        }

        if (onSlotsChange) {
            onSlotsChange(newSelectedSlots);
        }
    };

    const isSlotSelected = (slotId) => {
        return selectedSlots.some(s => s.id === slotId);
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Play Time</Text>

            {/* Date Selector */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateContainer}
                style={styles.dateScroll}
            >
                {dates.map((dateItem, index) => (
                    <TouchableOpacity
                        key={dateItem.dateString}
                        onPress={() => handleDateSelect(dateItem.dateString)}
                        style={[
                            styles.dateCard,
                            selectedDate === dateItem.dateString && styles.dateCardSelected,
                            index === 0 && styles.dateCardFirst,
                            index === dates.length - 1 && styles.dateCardLast,
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.dateLabel,
                            selectedDate === dateItem.dateString && styles.dateLabelSelected
                        ]}>
                            {dateItem.displayLabel}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Time Slots */}
            <View style={styles.slotsContainer}>
                <Text style={styles.slotsTitle}>Available Slots</Text>
                <View style={styles.slotsGrid}>
                    {timeSlots.map((slot) => (
                        <TouchableOpacity
                            key={slot.id}
                            onPress={() => handleSlotToggle(slot)}
                            disabled={!slot.available}
                            style={[
                                styles.slotCard,
                                !slot.available && styles.slotUnavailable,
                                isSlotSelected(slot.id) && styles.slotSelected
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.slotTime,
                                !slot.available && styles.slotTimeUnavailable,
                                isSlotSelected(slot.id) && styles.slotTimeSelected
                            ]}>
                                {slot.startTime}
                            </Text>
                            <Text style={[
                                styles.slotDivider,
                                !slot.available && styles.slotTimeUnavailable,
                                isSlotSelected(slot.id) && styles.slotTimeSelected
                            ]}>
                                -
                            </Text>
                            <Text style={[
                                styles.slotTime,
                                !slot.available && styles.slotTimeUnavailable,
                                isSlotSelected(slot.id) && styles.slotTimeSelected
                            ]}>
                                {slot.endTime}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Selected Slots Summary */}
            {selectedSlots.length > 0 && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                        {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 16,
        paddingHorizontal: width * 0.05,
    },
    dateScroll: {
        marginBottom: 20,
    },
    dateContainer: {
        paddingHorizontal: width * 0.05,
        flexDirection: 'row',
    },
    dateCard: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.black,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0,
        borderRightWidth: 1,
        borderRightColor: colors.darkGrey,
    },
    dateCardFirst: {
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        paddingLeft: 20,
    },
    dateCardLast: {
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        borderRightWidth: 0,
        paddingRight: 20,
    },
    dateCardSelected: {
        backgroundColor: colors.white,
    },
    dateLabel: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '500',
    },
    dateLabelSelected: {
        color: colors.black,
    },
    slotsContainer: {
        paddingHorizontal: width * 0.05,
    },
    slotsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    slotCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        minWidth: (width * 0.9 - 20) / 2,
    },
    slotSelected: {
        backgroundColor: colors.black,
        borderColor: colors.black,
    },
    slotUnavailable: {
        backgroundColor: colors.backgroundGrey,
        borderColor: colors.lightGrey,
        opacity: 0.5,
    },
    slotTime: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
    },
    slotTimeSelected: {
        color: colors.white,
    },
    slotTimeUnavailable: {
        color: colors.darkGrey,
    },
    slotDivider: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
        marginHorizontal: 4,
    },
    summaryContainer: {
        marginTop: 16,
        paddingHorizontal: width * 0.05,
        paddingVertical: 12,
        backgroundColor: colors.backgroundGrey,
        borderRadius: 8,
        marginHorizontal: width * 0.05,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
});

export default TimeSlotPicker;
