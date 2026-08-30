import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton } from '../../src/components';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        login(email);
        router.replace('/(app)');
    };

    return (
        <Screen scrollable>
            <Header title="Sign In" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Welcome Back
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Sign in with your email to continue your conversations.
                </AppText>

                <AppInput
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                />

                <AppInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
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
