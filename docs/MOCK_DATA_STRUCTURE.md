# Mock Data Documentation

This document outlines all mock data structures based on the **KYX API OpenAPI Specification**.

## 📁 File Structure

```
mock-data/
├── index.js              # Central export point
├── locations.js          # Cities and areas
├── fields.js             # Football pitches/fields
├── user.js               # User profiles
├── bookings.js           # Customer bookings
├── slots.js              # Time slots and availability
└── courts.js             # Backward compatibility (redirects to fields.js)
```

---

## 🌍 Locations

**File:** `locations.js`

### Structure
```javascript
{
  id: number,
  city: string,
  area: string
}
```

### Example
```javascript
{
  id: 1,
  city: 'Cairo',
  area: 'Nasr City'
}
```

### Functions
- `getAllLocations()` - Get all locations
- `getLocationById(id)` - Get location by ID
- `getAreasByCity(city)` - Get areas in a city
- `getAllCities()` - Get unique cities
- `getLocationString(locationId)` - Format as "Area, City"

---

## ⚽ Fields (Football Pitches)

**File:** `fields.js`

### Structure
```javascript
{
  id: string (UUID),
  ownerId: string (UUID),
  name: string,
  description: string,
  pricePerHour: number,
  locationId: number,
  latitude: number,
  longitude: number,
  fieldStatus: string, // 'Available', 'Maintenance', 'PendingApproval', 'Deleted'
  rating: number,
  reviews: number,
  type: string, // '5v5', '7v7', '11v11'
  image: { uri: string },
  amenities: string[]
}
```

### Example
```javascript
{
  id: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
  ownerId: 'a230de79-bdd1-e818-d66c-fe881e7ddb9a',
  name: 'Cairo Stadium Pitch',
  description: 'Professional 5v5 football pitch',
  pricePerHour: 300,
  locationId: 1,
  latitude: 30.0444,
  longitude: 31.2357,
  fieldStatus: 'Available',
  rating: 4.8,
  reviews: 124,
  type: '5v5',
  image: { uri: 'https://...' },
  amenities: ['Parking', 'Changing Rooms', 'Lighting']
}
```

### Functions
- `getAllFields()` - Get all fields
- `getFieldById(id)` - Get field by ID
- `searchFields(query)` - Search by name/location/type
- `filterFieldsByType(type)` - Filter by type
- `getAvailableFields()` - Get available fields only
- `getFieldsByPriceRange(min, max)` - Filter by price
- `getFieldsByLocation(locationId)` - Filter by location
- `getFieldsByOwner(ownerId)` - Get owner's fields

---

## 👤 Users

**File:** `user.js`

### Structure
```javascript
{
  id: string (UUID),
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  locationId: number,
  role: string, // 'User', 'Owner', 'Admin'
  profileImage: string,
  emailVerified: boolean,
  phoneVerified: boolean,
  createdAt: string (ISO 8601)
}
```

### Example
```javascript
{
  id: '9914950e-7971-48cd-e3f7-40e8fe328130',
  firstName: 'Ahmed',
  lastName: 'Hassan',
  email: 'ahmed.hassan@example.com',
  phoneNumber: '+20 100 123 4567',
  locationId: 1,
  role: 'User',
  profileImage: 'https://...',
  emailVerified: true,
  phoneVerified: true,
  createdAt: '2025-12-01T10:00:00Z'
}
```

### Functions
- `getCurrentUser()` - Get current user
- `getUserById(id)` - Get user by ID
- `updateUserProfile(updates)` - Update profile
- `updateProfileImage(imageUri)` - Update image
- `getUserFullName(user)` - Get full name
- `getAllUsers()` - Get all users (admin only)
- `getUsersByRole(role)` - Filter by role
- `isOwner(user)` - Check if owner
- `isAdmin(user)` - Check if admin

---

## 📅 Bookings

**File:** `bookings.js`

### Structure
```javascript
{
  id: string (UUID),
  customerId: string (UUID),
  fieldId: string (UUID),
  slotId: string (UUID),
  bookingDate: string (YYYY-MM-DD),
  startTime: string (HH:MM:SS),
  endTime: string (HH:MM:SS),
  totalPrice: number,
  status: string, // 'Confirmed', 'Pending', 'Cancelled'
  paymentStatus: string, // 'Paid', 'Pending', 'Refunded'
  createdAt: string (ISO 8601)
}
```

### Example
```javascript
{
  id: '7h8i9j0k-1l2m-3n4o-5p6q-7r8s9t0u1v2w',
  customerId: '9914950e-7971-48cd-e3f7-40e8fe328130',
  fieldId: '68a6e86f-c8b1-d645-bb83-d3de4cb6b54a',
  slotId: 's1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
  bookingDate: '2026-01-28',
  startTime: '18:00:00',
  endTime: '20:00:00',
  totalPrice: 600,
  status: 'Confirmed',
  paymentStatus: 'Paid',
  createdAt: '2026-01-20T10:30:00Z'
}
```

### Functions
- `getAllBookings()` - Get all bookings
- `getBookingById(id)` - Get booking by ID
- `getBookingsByCustomer(customerId)` - Get customer bookings
- `getBookingsByField(fieldId)` - Get field bookings
- `getBookingsByStatus(status)` - Filter by status
- `getUpcomingBookings()` - Get future bookings
- `getBookingsByDateRange(from, to)` - Filter by date range
- `getBookingWithDetails(id)` - Get with field details
- `getAllBookingsWithDetails()` - Get all with formatted details

---

## 🕐 Slots

**File:** `slots.js`

### Slot Structure
```javascript
{
  id: string (UUID),
  fieldId: string (UUID),
  date: string (YYYY-MM-DD),
  startTime: string (HH:MM:SS),
  endTime: string (HH:MM:SS),
  isBooked: boolean,
  isBlocked: boolean
}
```

### Field Availability Structure (Recurring Schedule)
```javascript
{
  id: string (UUID),
  fieldId: string (UUID),
  dayOfWeek: string, // 'Monday', 'Tuesday', etc.
  startTime: string (HH:MM:SS),
  endTime: string (HH:MM:SS)
}
```

### Functions
- `getAllSlots()` - Get all slots
- `getSlotsByField(fieldId)` - Get field slots
- `getSlotsByFieldAndDate(fieldId, date)` - Get slots for date
- `getAvailableSlots(fieldId, date)` - Get available slots
- `getFieldAvailabilities(fieldId)` - Get recurring schedule
- `getFieldAvailabilityByDay(fieldId, day)` - Get day schedule
- `toggleSlotBlock(slotId, isBlocked)` - Block/unblock slot
- `deleteSlot(slotId)` - Delete slot

---

## 🔄 Backward Compatibility

The `courts.js` file provides backward compatibility by re-exporting fields with "courts" naming:

```javascript
import { mockCourts, getAllCourts } from './mock-data/courts';
// Same as:
import { mockFields, getAllFields } from './mock-data/fields';
```

---

## 📡 API Endpoints Reference

Based on the OpenAPI specification, here are the main endpoints:

### Users
- `POST /api/users` - Register user
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout

### Fields
- `GET /api/fields` - Get all fields (with pagination & location filter)
- `POST /api/fields` - Create field (Owner)
- `PUT /api/fields/:id` - Update field (Owner)
- `DELETE /api/fields/:id` - Delete field (Owner/Admin)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:city` - Get areas by city
- `POST /api/locations` - Create location

### Bookings
- `GET /api/customers/bookings` - Get customer bookings (with date range)
- `GET /api/bookings/fields/:fieldId` - Get field bookings (Owner)
- `DELETE /api/bookings/:id` - Cancel booking

### Slots
- `GET /api/slots/fields/:fieldId` - Get field slots (with date query)
- `PATCH /api/slots/:slotId` - Block/unblock slot
- `DELETE /api/slots/:slotId` - Delete slot

### Field Availabilities
- `GET /api/fields-availabilities/:fieldId` - Get field availabilities
- `POST /api/fields-availabilities` - Create availabilities (bulk)
- `PUT /api/fields-availabilities` - Update availabilities
- `DELETE /api/field-availabilities/fields/:fieldId/day-of-week/:dayOfWeek` - Delete availability

---

## 🎯 Usage Examples

### Get all available fields in Cairo
```javascript
import { getAvailableFields, getFieldsByLocation } from './mock-data';

const cairoFields = getFieldsByLocation(1); // locationId 1 = Nasr City, Cairo
const available = getAvailableFields();
```

### Get user's upcoming bookings
```javascript
import { getUpcomingBookings, getAllBookingsWithDetails } from './mock-data';

const upcoming = getUpcomingBookings();
const withDetails = getAllBookingsWithDetails();
```

### Check field availability
```javascript
import { getAvailableSlots } from './mock-data';

const slots = getAvailableSlots('68a6e86f-c8b1-d645-bb83-d3de4cb6b54a', '2026-01-28');
```

---

**Last Updated:** January 26, 2026
**Based on:** KYX API OpenAPI Specification v1.0.0
