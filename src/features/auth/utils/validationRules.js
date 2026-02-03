/**
 * Form validation rules for authentication forms
 */

export const validationRules = {
    email: {
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address',
        },
    },
    password: {
        required: 'Password is required',
        minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
        },
    },
    confirmPassword: (password) => ({
        required: 'Please confirm your password',
        validate: (value) => value === password || 'Passwords do not match',
    }),
    firstName: {
        required: 'First name is required',
        minLength: {
            value: 2,
            message: 'First name must be at least 2 characters',
        },
    },
    lastName: {
        required: 'Last name is required',
        minLength: {
            value: 2,
            message: 'Last name must be at least 2 characters',
        },
    },
    phoneNumber: {
        required: 'Phone number is required',
        pattern: {
            value: /^[0-9]{10,15}$/,
            message: 'Please enter a valid phone number',
        },
    },
};
