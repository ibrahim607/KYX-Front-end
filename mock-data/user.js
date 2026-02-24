/**
 * Mock User Data
 * Based on the KYX API OpenAPI Specification
 */

export const mockUser = {
    id: '9914950e-7971-48cd-e3f7-40e8fe328130',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@example.com',
    phoneNumber: '+20 100 123 4567',
    locationId: 1,
    role: 'User', // User, Owner, Admin
    profileImage: 'https://i.pravatar.cc/300?img=12', // Placeholder avatar
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-12-01T10:00:00Z',
};

// Additional mock users for testing
export const mockUsers = [
    mockUser,
    {
        id: 'a230de79-bdd1-e818-d66c-fe881e7ddb9a',
        firstName: 'Mohamed',
        lastName: 'Ali',
        email: 'mohamed.ali@example.com',
        phoneNumber: '+20 101 234 5678',
        locationId: 3,
        role: 'Owner',
        profileImage: 'https://i.pravatar.cc/300?img=33',
        emailVerified: true,
        phoneVerified: true,
        createdAt: '2025-11-15T14:30:00Z',
    },
    {
        id: 'b340ef89-cee2-f929-e77d-gf992f8eec0b',
        firstName: 'Sara',
        lastName: 'Ibrahim',
        email: 'sara.ibrahim@example.com',
        phoneNumber: '+20 102 345 6789',
        locationId: 8,
        role: 'Owner',
        profileImage: 'https://i.pravatar.cc/300?img=47',
        emailVerified: true,
        phoneVerified: true,
        createdAt: '2025-10-20T09:15:00Z',
    },
    {
        id: 'c450fg90-dff3-g030-f88e-hg003g9ffd1c',
        firstName: 'Omar',
        lastName: 'Khaled',
        email: 'omar.khaled@example.com',
        phoneNumber: '+20 103 456 7890',
        locationId: 4,
        role: 'Admin',
        profileImage: 'https://i.pravatar.cc/300?img=60',
        emailVerified: true,
        phoneVerified: true,
        createdAt: '2025-09-10T16:45:00Z',
    },
];

/**
 * Get current user profile
 */
export const getCurrentUser = () => {
    return mockUser;
};

/**
 * Get user by ID
 */
export const getUserById = (id) => {
    return mockUsers.find(user => user.id === id);
};

/**
 * Update user profile
 */
export const updateUserProfile = (updates) => {
    Object.assign(mockUser, updates);
    return mockUser;
};

/**
 * Update profile image
 */
export const updateProfileImage = (imageUri) => {
    mockUser.profileImage = imageUri;
    return mockUser;
};

/**
 * Get user full name
 */
export const getUserFullName = (user = mockUser) => {
    return `${user.firstName} ${user.lastName}`;
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = () => {
    return mockUsers;
};

/**
 * Get users by role
 */
export const getUsersByRole = (role) => {
    return mockUsers.filter(user => user.role === role);
};

/**
 * Check if user is owner
 */
export const isOwner = (user = mockUser) => {
    return user.role === 'Owner';
};

/**
 * Check if user is admin
 */
export const isAdmin = (user = mockUser) => {
    return user.role === 'Admin';
};
