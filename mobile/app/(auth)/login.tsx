import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton, Toast } from '../../src/components';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleLogin = () => {
        let valid = true;
        setEmailError('');
        setPasswordError('');

        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            login(email);
            router.replace('/(app)');
        }, 600);
    };

    return (
        <Screen scrollable>
            <Header title="Sign In" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Welcome Back
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Enter your email and password to access your Pulse conversations.
                </AppText>

                {toastMessage ? (
                    <Toast type="error" message={toastMessage} style={{ marginBottom: spacing.lg }} />
                ) : null}

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
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(val) => {
                        setPassword(val);
                        if (passwordError) setPasswordError('');
                    }}
                    error={passwordError}
                    isPassword
                    leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                />

                <TouchableOpacity
                    onPress={() => router.push('/(auth)/forgot-password')}
                    style={styles.forgotBtn}
                    accessibilityRole="button"
                >
                    <AppText variant="label" color={colors.primary}>
                        Forgot Password?
                    </AppText>
                </TouchableOpacity>

                <AppButton
                    title="Sign In"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={handleLogin}
                    style={styles.submitBtn}
                />

                <View style={styles.footerRow}>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        Don't have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <AppText variant="label" color={colors.primary}>
                            Create Account
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
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl
    },
    submitBtn: {
        marginBottom: spacing.xl
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
