import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width } = Dimensions.get('window');

const OTPInput = ({ length = 4, onComplete }) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef(Array(length).fill(null).map(() => useRef(null)));

    const handleOtpChange = (value, index) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1].current?.focus();
        }

        // Check if OTP is complete
        if (newOtp.every(digit => digit !== '')) {
            onComplete?.(newOtp.join(''));
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={inputRefs.current[index]}
                    style={styles.otpBox}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    returnKeyType="done"
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: width * 0.04,
    },
    otpBox: {
        width: width * 0.15,
        height: width * 0.15,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: width * 0.06,
        fontWeight: '600',
        color: colors.black,
        backgroundColor: colors.white,
    },
});

export default OTPInput;
