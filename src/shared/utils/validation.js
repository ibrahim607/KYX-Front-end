// Email validation
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

// Password validation (min 6 characters)
export const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') {
        return false;
    }

    return password.length >= 6;
};
