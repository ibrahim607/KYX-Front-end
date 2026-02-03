// Example: How to add a new field to the Register form

// 1. Add validation rule (src/features/auth/utils/validationRules.js)
export const validationRules = {
    // ... existing rules
    username: {
        required: 'Username is required',
        minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
        },
        pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers, and underscores',
        },
    },
};

// 2. Add to form defaultValues (RegisterScreen.js)
const {
    control,
    handleSubmit,
    formState: { errors },
} = useForm({
    defaultValues: {
        firstName: '',
        lastName: '',
        username: '', // Add this
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    },
});

// 3. Add FormInput component (RegisterScreen.js - in the form section)
<FormInput
    control={control}
    name="username"
    label="Username"
    placeholder="Choose a username"
    rules={validationRules.username}
    error={errors.username}
/>

// 4. Include in API call (RegisterScreen.js - onSubmit function)
const response = await authService.register({
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username, // Add this
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: data.password,
});

// ============================================
// Example: How to change password requirements
// ============================================

// Edit src/features/auth/utils/validationRules.js
export const validationRules = {
    password: {
        required: 'Password is required',
        minLength: {
            value: 12, // Changed from 8
            message: 'Password must be at least 12 characters',
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must contain uppercase, lowercase, number, and special character',
        },
    },
};

// ============================================
// Example: How to add a checkbox (Terms & Conditions)
// ============================================

// 1. Install checkbox library (if needed)
// npm install @react-native-community/checkbox

// 2. Import in RegisterScreen.js
import CheckBox from '@react-native-community/checkbox';

// 3. Add to form state
const [acceptedTerms, setAcceptedTerms] = useState(false);

// 4. Add validation in onSubmit
const onSubmit = async (data) => {
    if (!acceptedTerms) {
        Alert.alert('Error', 'Please accept the terms and conditions');
        return;
    }
    // ... rest of submit logic
};

// 5. Add to UI (before submit button)
<View style={styles.checkboxContainer}>
    <CheckBox
        value={acceptedTerms}
        onValueChange={setAcceptedTerms}
    />
    <Text style={styles.checkboxLabel}>
        I accept the{' '}
        <Text style={styles.link} onPress={() => {/* Open terms */ }}>
            Terms and Conditions
        </Text>
    </Text>
</View>

// 6. Add styles
checkboxContainer: {
    flexDirection: 'row',
        alignItems: 'center',
            marginBottom: 16,
},
checkboxLabel: {
    marginLeft: 8,
        fontSize: 14,
            color: colors.darkGrey,
},
link: {
    color: colors.black,
        fontWeight: '600',
},

// ============================================
// Example: How to customize error messages
// ============================================

// Edit src/api/authService.js - handleAuthError function
const handleAuthError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return new Error('Oops! Something went wrong with your request.');
            case 401:
                return new Error('Wrong email or password. Please try again.');
            case 409:
                return new Error('This email is already registered. Try logging in instead.');
            // ... customize other cases
        }
    }
    // ... rest of error handling
};

// ============================================
// Example: How to add social login functionality
// ============================================

// In ButtonSection.js, update the social icon onPress handlers:

// 1. Create social auth functions
const handleGoogleLogin = async () => {
    try {
        // Implement Google Sign-In
        // const result = await GoogleSignin.signIn();
        // const response = await authService.socialLogin('google', result.idToken);
        // await setAuth(response.user, response.accessToken, response.refreshToken);
        Alert.alert('Google Login', 'Coming soon!');
    } catch (error) {
        Alert.alert('Error', error.message);
    }
};

// 2. Update TouchableOpacity
<TouchableOpacity
    style={styles.socialIcon}
    onPress={handleGoogleLogin}
>
    <GoogleIcon width={32} height={32} />
</TouchableOpacity>

// ============================================
// Example: How to add "Remember Me" functionality
// ============================================

// 1. Add state in LoginScreen.js
const [rememberMe, setRememberMe] = useState(false);

// 2. Save email to AsyncStorage if checked
const onSubmit = async (data) => {
    try {
        const response = await authService.login(data);

        if (rememberMe) {
            await AsyncStorage.setItem('rememberedEmail', data.email);
        } else {
            await AsyncStorage.removeItem('rememberedEmail');
        }

        await setAuth(response.user, response.accessToken, response.refreshToken);
    } catch (error) {
        Alert.alert('Login Failed', error.message);
    }
};

// 3. Load saved email on mount
useEffect(() => {
    const loadRememberedEmail = async () => {
        const email = await AsyncStorage.getItem('rememberedEmail');
        if (email) {
            setValue('email', email);
            setRememberMe(true);
        }
    };
    loadRememberedEmail();
}, []);
