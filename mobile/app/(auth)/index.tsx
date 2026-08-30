import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function WelcomeScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const handleQuickDemo = () => {
        login('demo.user@pulsechat.app');
        router.replace('/(app)');
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.content}>
                {/* Brand Glowing Logo Badge */}
                <View style={styles.logoOuter}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="chatbubble-ellipses" size={52} color={colors.primary} />
                    </View>
                </View>

                {/* Pulse Brand Title */}
                <View style={styles.badgePill}>
                    <View style={styles.pulseDot} />
                    <AppText variant="caption" color={colors.primary} weight="700">
                        PULSE REAL-TIME
                    </AppText>
                </View>

                <AppText variant="display" color={colors.textPrimary} align="center" style={styles.title}>
                    Pulse Chat
                </AppText>
                <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
                    A modern, fluid messaging experience built for privacy, team collaboration, and speed.
                </AppText>
            </View>

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <AppButton
                    title="Sign In"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.button}
                />
                <AppButton
                    title="Create Account"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/(auth)/register')}
                    style={styles.button}
                />
                <AppButton
                    title="Quick Demo Mode (Skip Auth)"
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onPress={handleQuickDemo}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoOuter: {
        padding: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        marginBottom: spacing.lg
    },
    iconCircle: {
        width: 104,
        height: 104,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginRight: spacing.xs + 2
    },
    title: {
        marginBottom: spacing.xs
    },
    subtitle: {
        maxWidth: 290,
        lineHeight: 22
    },
    footer: {
        width: '100%',
        paddingBottom: spacing.md
    },
    button: {
        marginBottom: spacing.sm
    }
});
