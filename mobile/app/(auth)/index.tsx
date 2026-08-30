import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <Screen style={styles.container}>
            <View style={styles.content}>
                {/* Brand Hero Icon */}
                <View style={styles.iconCircle}>
                    <Ionicons name="chatbubble-ellipses" size={48} color={colors.primary} />
                </View>

                <AppText variant="display" color={colors.textPrimary} align="center" style={styles.title}>
                    Pulse Chat
                </AppText>
                <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
                    Fast, secure, and modern real-time messaging crafted for teams and friends.
                </AppText>
            </View>

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
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        padding: spacing['2xl']
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl
    },
    title: {
        marginBottom: spacing.xs
    },
    subtitle: {
        maxWidth: 280
    },
    footer: {
        width: '100%',
        paddingBottom: spacing.lg
    },
    button: {
        marginBottom: spacing.md
    }
});
