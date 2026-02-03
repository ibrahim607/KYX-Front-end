import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ball from '../../../assets/icons/ball.svg';
import { colors } from '../../../assets/theme/colors';
import CustomButton from '../../../shared/components/CustomButton';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import OTPInput from '../components/OTPInput';

const { width, height } = Dimensions.get('window');

const OTP = ({ navigation, route }) => {
    const { email } = route.params || {};
    const [otpCode, setOtpCode] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOTPComplete = (code) => {
        setOtpCode(code);
    };

    const handleConfirm = () => {
        if (otpCode.length === 4) {
            console.log('Verifying OTP:', otpCode);
            // TODO: Verify OTP with API
            navigation.navigate('NewPassword');
        }
    };

    const handleResend = () => {
        if (canResend) {
            console.log('Resending OTP to:', email);
            // TODO: Call resend OTP API
            setTimer(60);
            setCanResend(false);
            setOtpCode('');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <ScreenHeader
                title="OTP"
                onBackPress={() => navigation.goBack()}
            />

            <Image
                source={require('../../../assets/images/Soccer-bro.png')}
                style={styles.illustration}
                resizeMode="contain"
            />

            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.description}>
                We have sent an OTP to your email
            </Text>
            <Text style={styles.email}>{email}</Text>

            {/* OTP Input */}
            <View style={styles.otpWrapper}>
                <OTPInput length={4} onComplete={handleOTPComplete} />
            </View>

            {/* Resend Section */}
            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                    <Text style={[styles.resendButton, !canResend && styles.resendDisabled]}>
                        {canResend ? 'Resend' : `Resend in ${formatTime(timer)}`}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Confirm"
                    backgroundColor={colors.black}
                    textColor={colors.white}
                    onPress={handleConfirm}
                    disabled={otpCode.length !== 4}
                />
            </View>

            {/* Ball SVG */}
            <Ball
                width={width * 0.15}
                height={width * 0.15}
                fill={colors.lightGrey}
                style={styles.ballSvg}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGrey,
    },
    illustration: {
        width: width * 0.9,
        height: height * 0.3,
        alignSelf: 'center',
        marginTop: height * 0.02,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
        marginTop: height * 0.02,
    },
    description: {
        fontSize: width * 0.04,
        fontWeight: '400',
        color: colors.black,
        textAlign: 'center',
        marginTop: height * 0.02,
    },
    email: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
        marginTop: height * 0.01,
    },
    otpWrapper: {
        marginTop: height * 0.04,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    resendText: {
        fontSize: width * 0.035,
        color: colors.darkGrey,
    },
    resendButton: {
        fontSize: width * 0.035,
        color: colors.black,
        fontWeight: '600',
    },
    resendDisabled: {
        color: colors.darkGrey,
    },
    buttonContainer: {
        paddingHorizontal: width * 0.06,
        marginTop: height * 0.04,
    },
    ballSvg: {
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: height * 0.05,
    },
});

export default OTP;