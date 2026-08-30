import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password strength evaluator
    const getPasswordStrength = (pass: string): { label: string; color: string; width: `${number}%` } => {
        if (!pass) return { label: '', color: colors.border, width: '0%' };
        if (pass.length < 6) return { label: 'Weak', color: colors.error, width: '33%' };
        const hasNumbers = /\d/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        if (pass.length >= 8 && hasNumbers && hasSpecial) {
            return { label: 'Strong', color: colors.success, width: '100%' };
        }
        return { label: 'Medium', color: colors.warning, width: '66%' };
    };

    const strength = getPasswordStrength(password);

    const handleRegister = () => {
        let valid = true;
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmError('');

        if (!username.trim() || username.trim().length < 3) {
            setUsernameError('Username must be at least 3 characters');
            valid = false;
        }

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        }

        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        }

        if (password !== confirmPassword) {
            setConfirmError('Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            register(username, email);
            router.push('/(auth)/otp');
        }, 500);
    };

    return (
        <Screen scrollable>
            <Header title="Create Account" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Join Pulse Chat
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Start messaging with teammates, sharing media, and collaborating seamlessly.
                </AppText>

                <AppInput
                    label="Username"
                    placeholder="sahilarote"
                    value={username}
                    onChangeText={(val) => {
                        setUsername(val);
                        if (usernameError) setUsernameError('');
                    }}
                    error={usernameError}
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
                />

                <AppInput
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={(val) => {
                        setEmail(val);
                        if (emailError) setEmailError('');
                    }}
                    error={emailError}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                />

                <AppInput
                    label="Password"
                    placeholder="Choose a strong password"
                    value={password}
                    onChangeText={(val) => {
                        setPassword(val);
                        if (passwordError) setPasswordError('');
                    }}
                    error={passwordError}
                    isPassword
                    leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                        <View style={styles.strengthBarBg}>
                            <View style={[styles.strengthBarFill, { width: strength.width, backgroundColor: strength.color }]} />
                        </View>
                        <AppText variant="caption" color={strength.color} style={styles.strengthLabel}>
                            Password Strength: {strength.label}
                        </AppText>
                    </View>
                )}

                <AppInput
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (confirmError) setConfirmError('');
                    }}
                    error={confirmError}
                    isPassword
                    leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />}
                />

                <AppButton
                    title="Continue"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={handleRegister}
                    style={styles.submitBtn}
                />

                <View style={styles.footerRow}>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        Already have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <AppText variant="label" color={colors.primary}>
                            Sign In
                        </AppText>
                    </TouchableOpacity>
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
    strengthContainer: {
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs
    },
    strengthBarBg: {
        height: 4,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.full,
        overflow: 'hidden'
    },
    strengthBarFill: {
        height: '100%',
        borderRadius: radius.full
    },
    strengthLabel: {
        marginTop: 4,
        fontWeight: '600'
    },
    submitBtn: {
        marginVertical: spacing.xl
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
