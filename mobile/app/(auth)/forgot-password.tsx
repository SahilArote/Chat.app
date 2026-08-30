import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, AppInput, AppButton, Toast } from '../../src/components';
import { colors, spacing } from '../../src/theme';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <Screen scrollable>
            <Header title="Reset Password" />

            <View style={styles.content}>
                <AppText variant="screenTitle" color={colors.textPrimary} style={styles.title}>
                    Forgot Password
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
                    Enter the email associated with your account and we will send you a reset link.
                </AppText>

                {sent && (
                    <Toast
                        type="success"
                        message="Password reset link sent to your email!"
                        style={{ marginBottom: spacing.lg }}
                    />
                )}

                <AppInput
                    label="Email Address"
                    placeholder="name@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                />

                <AppButton
                    title="Send Reset Code"
                    size="lg"
                    fullWidth
                    onPress={() => setSent(true)}
                    style={styles.submitBtn}
                />
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
    }
});
