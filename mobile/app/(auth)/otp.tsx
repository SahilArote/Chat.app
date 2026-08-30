import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Header, AppText, AppInput, AppButton } from '../../src/components';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function OTPScreen() {
    const router = useRouter();
    const { verifyOtp } = useAuth();
    const [otpCode, setOtpCode] = useState('');

    const handleVerify = () => {
        if (verifyOtp(otpCode)) {
            router.replace('/(app)');
        }
    };

    return (
        <Screen scrollable>
            <Header title="Verification" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Enter 6-Digit Code
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    We sent a verification code to your email. Enter the code below to confirm your account.
                </AppText>

                <AppInput
                    placeholder="123456"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.otpInput}
                />

                <AppButton
                    title="Verify & Continue"
                    size="lg"
                    fullWidth
                    disabled={otpCode.length < 6}
                    onPress={handleVerify}
                    style={styles.verifyBtn}
                />

                <TouchableOpacity style={styles.resendRow}>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        Didn't receive code?{' '}
                    </AppText>
                    <AppText variant="label" color={colors.primary}>
                        Resend Code
                    </AppText>
                </TouchableOpacity>
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
    otpInput: {
        textAlign: 'center',
        letterSpacing: 8,
        fontSize: 24,
        fontWeight: '700'
    },
    verifyBtn: {
        marginVertical: spacing.xl
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
