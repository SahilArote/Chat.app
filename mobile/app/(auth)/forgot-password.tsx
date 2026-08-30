import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton, Toast, Card } from '../../src/components';
import { colors, spacing } from '../../src/theme';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSendCode = () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrorMsg('Please enter a valid email address');
            return;
        }
        setErrorMsg('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 500);
    };

    const handleResetPassword = () => {
        if (!otpCode || otpCode.length < 6) {
            setErrorMsg('Please enter the 6-digit code');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setErrorMsg('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        setErrorMsg('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 600);
    };

    return (
        <Screen scrollable>
            <Header title="Reset Password" />

            <View style={styles.content}>
                {step === 1 && (
                    <>
                        <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                            Forgot Password
                        </AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                            Enter your email address and we'll send a 6-digit recovery code.
                        </AppText>

                        {errorMsg ? (
                            <Toast type="error" message={errorMsg} style={{ marginBottom: spacing.lg }} />
                        ) : null}

                        <AppInput
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={(val) => {
                                setEmail(val);
                                if (errorMsg) setErrorMsg('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                        />

                        <AppButton
                            title="Send Recovery Code"
                            size="lg"
                            fullWidth
                            loading={loading}
                            onPress={handleSendCode}
                            style={styles.submitBtn}
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                            Set New Password
                        </AppText>
                        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                            Enter the 6-digit recovery code sent to {email} and choose a new password.
                        </AppText>

                        {errorMsg ? (
                            <Toast type="error" message={errorMsg} style={{ marginBottom: spacing.lg }} />
                        ) : null}

                        <AppInput
                            label="6-Digit Recovery Code"
                            placeholder="123456"
                            value={otpCode}
                            onChangeText={setOtpCode}
                            keyboardType="number-pad"
                            maxLength={6}
                            leftIcon={<Ionicons name="key-outline" size={18} color={colors.textSecondary} />}
                        />

                        <AppInput
                            label="New Password"
                            placeholder="Minimum 6 characters"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            isPassword
                            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                        />

                        <AppInput
                            label="Confirm New Password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPassword
                            leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />}
                        />

                        <AppButton
                            title="Update Password"
                            size="lg"
                            fullWidth
                            loading={loading}
                            onPress={handleResetPassword}
                            style={styles.submitBtn}
                        />
                    </>
                )}

                {step === 3 && (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconCircle}>
                            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
                        </View>
                        <AppText variant="screenTitle" color={colors.textPrimary} align="center" style={styles.title}>
                            Password Updated!
                        </AppText>
                        <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
                            Your password has been successfully reset. You can now sign in with your new credentials.
                        </AppText>

                        <AppButton
                            title="Back to Sign In"
                            size="lg"
                            fullWidth
                            onPress={() => router.replace('/(auth)/login')}
                            style={{ marginTop: spacing.xl }}
                        />
                    </View>
                )}
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
    submitBtn: {
        marginTop: spacing.lg
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: spacing['2xl']
    },
    successIconCircle: {
        marginBottom: spacing.lg
    }
});
