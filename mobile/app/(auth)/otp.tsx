import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, AppText, AppButton, Toast } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function OTPScreen() {
    const router = useRouter();
    const { verifyOtp } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(45);
    const [loading, setLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (text: string, index: number) => {
        const clean = text.replace(/[^0-9]/g, '');
        const newOtp = [...otp];

        if (clean.length > 1) {
            // Handle paste
            const chars = clean.slice(0, 6).split('');
            for (let i = 0; i < 6; i++) {
                newOtp[i] = chars[i] || '';
            }
            setOtp(newOtp);
            inputRefs.current[Math.min(clean.length, 5)]?.focus();
            return;
        }

        newOtp[index] = clean;
        setOtp(newOtp);

        if (clean && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length < 6) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (verifyOtp(code)) {
                router.replace('/(app)');
            } else {
                setToastMsg('Invalid verification code');
            }
        }, 600);
    };

    const handleResend = () => {
        if (timer > 0) return;
        setTimer(45);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setToastMsg('New verification code sent!');
    };

    const isFull = otp.every((d) => d.length === 1);

    return (
        <Screen scrollable>
            <Header title="Verification" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Verify Email
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Please enter the 6-digit confirmation code sent to your registered email address.
                </AppText>

                {toastMsg ? (
                    <Toast type={timer === 45 ? 'success' : 'error'} message={toastMsg} style={{ marginBottom: spacing.lg }} />
                ) : null}

                {/* 6-Digit PIN Boxes */}
                <View style={styles.pinContainer}>
                    {otp.map((digit, i) => (
                        <TextInput
                            key={i}
                            ref={(el) => {
                                inputRefs.current[i] = el;
                            }}
                            style={[
                                styles.pinBox,
                                digit ? styles.pinBoxFilled : null,
                                i === otp.findIndex(d => !d) ? styles.pinBoxActive : null
                            ]}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <AppButton
                    title="Verify & Continue"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={!isFull}
                    onPress={handleVerify}
                    style={styles.verifyBtn}
                />

                {/* Countdown & Resend */}
                <View style={styles.resendSection}>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        {timer > 0 ? (
                            `Resend code in ${timer}s`
                        ) : (
                            "Didn't receive the code? "
                        )}
                    </AppText>
                    {timer === 0 && (
                        <TouchableOpacity onPress={handleResend}>
                            <AppText variant="label" color={colors.primary}>
                                Resend Now
                            </AppText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.xl
    },
    title: {
        marginBottom: spacing.xs
    },
    subtitle: {
        marginBottom: spacing.xl
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: spacing.lg
    },
    pinBox: {
        width: 48,
        height: 56,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary
    },
    pinBoxFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceElevated
    },
    pinBoxActive: {
        borderColor: colors.borderFocus
    },
    verifyBtn: {
        marginVertical: spacing.xl
    },
    resendSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
