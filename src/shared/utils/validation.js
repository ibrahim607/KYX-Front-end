/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
    // Defensive guard: check for null/undefined/non-string
    if (!email || typeof email !== 'string') {
        return false;
    }

    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets minimum requirements
 */
export const isValidPassword = (password) => {
    // Defensive guard: check for null/undefined/non-string
    if (!password || typeof password !== 'string') {
        return false;
    }

    return password.length >= 6;
};
