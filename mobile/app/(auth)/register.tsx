import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton } from '../../src/components';
import { colors, spacing } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        register(username, email);
        router.push('/(auth)/otp');
    };

    return (
        <Screen scrollable>
            <Header title="Register" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Create Account
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Join Pulse Chat to communicate securely with your network.
                </AppText>

                <AppInput
                    label="Username"
                    placeholder="sahilarote"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
                />

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
                    placeholder="Choose a strong password"
                    value={password}
                    onChangeText={setPassword}
                    isPassword
                    leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                    helperText="Must be at least 6 characters"
                />

                <AppButton
                    title="Continue"
                    size="lg"
                    fullWidth
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
    submitBtn: {
        marginVertical: spacing.xl
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
