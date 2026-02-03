# 🏟️ Pitch Details & Booking Feature

## Overview

A comprehensive booking flow that allows users to view pitch details, select time slots, and make bookings with proper backend integration.

---

## 📱 Features Implemented

### **1. Pitch Details Screen**
- ✅ Full-screen image gallery with thumbnail navigation
- ✅ Pitch information (name, location, price)
- ✅ Rating and reviews display
- ✅ Pitch type (5v5, 7v7, 11v11)
- ✅ Amenities list
- ✅ Contact details with phone call integration
- ✅ Address with "View on Map" button
- ✅ Time slot picker with date selection
- ✅ Multi-slot selection capability
- ✅ Real-time price calculation
- ✅ Booking confirmation with reassurance

### **2. Image Gallery Component**
- ✅ Main image display
- ✅ Horizontal scrollable thumbnails
- ✅ Selected thumbnail highlighting
- ✅ Smooth image switching

### **3. Time Slot Picker Component**
- ✅ 7-day date selector (horizontal scroll)
- ✅ Available time slots display
- ✅ Multi-slot selection
- ✅ Unavailable slots marked
- ✅ Selected slots summary
- ✅ Visual feedback for selections

---

## 🗂️ File Structure

```
src/
├── features/
│   └── booking/
│       ├── components/
│       │   ├── ImageGallery.js          ✅ NEW
│       │   ├── TimeSlotPicker.js        ✅ NEW
│       │   └── BookingCard.js           (existing)
│       ├── screens/
│       │   ├── PitchDetailsScreen.js    ✅ NEW
│       │   └── BookingScreen.js         (existing)
│       └── store/
│           └── useBookingStore.js       (existing)
└── navigation/
    └── AppStack.js                      ✅ UPDATED
```

---

## 🚀 Navigation Flow

```
HomeScreen
    ↓ (tap court card)
PitchDetailsScreen
    ↓ (select slots & book)
Confirmation Alert
    ↓ (choose option)
BookingScreen OR HomeScreen
```

### **How to Navigate**

```javascript
// From any screen with navigation
navigation.navigate('PitchDetails', { pitchId: 'pitch-id-here' });
```

---

## 📊 Booking Data Structure

### **Request Format (Sent to Backend)**

```javascript
{
  "fieldId": "68a6e86f-c8b1-d645-bb83-d3de4cb6b54a",
  "bookingDate": "2026-01-28",
  "startTime": "08:00",
  "endTime": "12:00",
  "totalPrice": 1200,
  "slots": [
    {
      "slotId": "slot1",
      "startTime": "08:00",
      "endTime": "10:00"
    },
    {
      "slotId": "slot2",
      "startTime": "10:00",
      "endTime": "12:00"
    }
  ]
}
```

### **Response Format (From Backend)**

```javascript
{
  "id": "booking-id",
  "fieldId": "68a6e86f-c8b1-d645-bb83-d3de4cb6b54a",
  "bookingDate": "2026-01-28",
  "startTime": "08:00",
  "endTime": "12:00",
  "totalPrice": 1200,
  "status": "Confirmed",
  "paymentStatus": "Pending",
  "createdAt": "2026-01-27T14:30:00Z"
}
```

---

## 🎨 Component Usage

### **ImageGallery**

```javascript
import ImageGallery from '../components/ImageGallery';

<ImageGallery 
  images={[
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
    'https://example.com/image3.jpg', // Also accepts strings
  ]} 
/>
```

**Props:**
- `images` (Array): Array of image URIs or objects with `uri` property

---

### **TimeSlotPicker**

```javascript
import TimeSlotPicker from '../components/TimeSlotPicker';

const [selectedSlots, setSelectedSlots] = useState([]);

<TimeSlotPicker
  selectedSlots={selectedSlots}
  onSlotsChange={setSelectedSlots}
  availableSlots={[]} // Optional: custom slots
/>
```

**Props:**
- `selectedSlots` (Array): Currently selected slots
- `onSlotsChange` (Function): Callback when selection changes
- `availableSlots` (Array): Optional custom slots (uses mock data if empty)

**Selected Slot Format:**
```javascript
{
  id: 'slot1',
  startTime: '08:00',
  endTime: '10:00',
  date: '2026-01-28',
  available: true
}
```

---

## 🔧 Backend Integration

### **Current State: Mock Data**

The booking flow currently uses mock data from:
- `mock-data/fields.js` - Pitch details
- `src/api/bookingService.js` - Booking creation (mock)

### **Switching to Real API**

**Step 1:** Update the service flag
```javascript
// In src/api/bookingService.js
const USE_MOCK_DATA = false; // Change to false
```

**Step 2:** Ensure endpoints are correct
```javascript
// In src/api/endpoints.js
BOOKINGS: '/bookings',          // POST for creating
FIELDS: '/fields',              // GET for pitch details
```

**Step 3:** Test booking creation
```javascript
// The request will automatically use the correct format:
POST /bookings
{
  "fieldId": "...",
  "bookingDate": "...",
  "startTime": "...",
  "endTime": "...",
  "totalPrice": 1200,
  "slots": [...]
}
```

---

## 🎯 User Flow

### **1. Browse Pitches**
- User sees pitch cards on HomeScreen
- Taps on a pitch card

### **2. View Details**
- PitchDetailsScreen loads
- User sees:
  - Image gallery
  - Pitch info & pricing
  - Contact details
  - Available time slots

### **3. Select Time Slots**
- User picks a date from the horizontal date picker
- Available slots for that date are shown
- User taps slots to select (can select multiple)
- Total price updates in real-time

### **4. Book**
- User taps "Book Now" button
- Confirmation dialog shows:
  - Number of slots
  - Pitch name
  - Total price
- User confirms

### **5. Confirmation**
- Loading indicator shows during booking
- Success alert appears
- User can:
  - View Bookings (navigate to BookingScreen)
  - Go Home (navigate to HomeScreen)

---

## 💡 Key Features

### **Multi-Slot Selection**
Users can book multiple consecutive or non-consecutive time slots in one booking.

### **Real-Time Price Calculation**
```javascript
const calculateTotalPrice = () => {
  return selectedSlots.length * pitch.pricePerHour;
};
```

### **Contact Integration**
```javascript
// Phone call
Linking.openURL(`tel:${phoneNumber}`);

// Map view
const url = `https://maps.google.com/?q=${latitude},${longitude}`;
Linking.openURL(url);
```

### **Booking Reassurance**
- Confirmation dialog before booking
- Loading state during API call
- Success message with details
- Error handling with retry option

---

## 🎨 Styling

### **Design Principles**
- ✅ Clean, modern interface
- ✅ Consistent with app theme
- ✅ Clear visual hierarchy
- ✅ Responsive to different screen sizes
- ✅ Accessible touch targets

### **Color Scheme**
- Primary actions: Black (`colors.black`)
- Selected states: Black background, white text
- Unavailable: Grey with reduced opacity
- Success: Confirmation messages
- Prices: Prominent display

---

## 🐛 Error Handling

### **No Slots Selected**
```javascript
if (selectedSlots.length === 0) {
  Alert.alert('No Slots Selected', 'Please select at least one time slot to book.');
  return;
}
```

### **Booking Failure**
```javascript
catch (error) {
  Alert.alert('Booking Failed', 'Failed to create booking. Please try again.');
  console.error('Booking error:', error);
}
```

### **Pitch Not Found**
```javascript
if (!pitchData) {
  Alert.alert('Error', 'Pitch not found');
  navigation.goBack();
}
```

---

## 📱 Testing Checklist

### **Visual Testing**
- [ ] Image gallery displays correctly
- [ ] Thumbnails highlight when selected
- [ ] Date picker scrolls smoothly
- [ ] Time slots display properly
- [ ] Selected slots are visually distinct
- [ ] Price updates correctly
- [ ] Button states (enabled/disabled) work

### **Functional Testing**
- [ ] Navigate from HomeScreen to PitchDetails
- [ ] Back button returns to Home
- [ ] Select single time slot
- [ ] Select multiple time slots
- [ ] Deselect time slots
- [ ] Change date (slots reset)
- [ ] Book with 1 slot
- [ ] Book with multiple slots
- [ ] Cancel booking from confirmation
- [ ] Phone call link works
- [ ] Map link works

### **Edge Cases**
- [ ] No images available
- [ ] No slots available
- [ ] All slots unavailable
- [ ] Network error during booking
- [ ] Invalid pitch ID
- [ ] Rapid button taps

---

## 🚀 Future Enhancements

### **Potential Improvements**
1. **Payment Integration**
   - Add payment gateway
   - Support multiple payment methods
   - Payment confirmation screen

2. **Advanced Filtering**
   - Filter by price range
   - Filter by amenities
   - Filter by availability

3. **Calendar View**
   - Month view for date selection
   - Availability calendar
   - Recurring bookings

4. **Social Features**
   - Share pitch with friends
   - Invite players
   - Team bookings

5. **Reviews & Ratings**
   - View detailed reviews
   - Add review after booking
   - Photo reviews

6. **Favorites**
   - Save favorite pitches
   - Quick booking from favorites
   - Notifications for favorite pitches

---

## 📚 Related Documentation

- **API Migration Guide**: `docs/API_MIGRATION.md`
- **Zustand Refactor**: `docs/ZUSTAND_REFACTOR.md`
- **Backend Integration**: `docs/BACKEND_INTEGRATION_CHECKLIST.md`

---

## 🎉 Summary

You now have a **complete booking flow** that:

✅ Shows detailed pitch information  
✅ Allows multi-slot selection  
✅ Calculates prices in real-time  
✅ Integrates with contact methods  
✅ Sends properly formatted booking requests  
✅ Handles errors gracefully  
✅ Provides user reassurance  
✅ Is ready for backend integration  

**Great work!** 🚀
