import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../src/theme';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Brand Badge */}
                <View style={styles.badge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.badgeText}>PHASE 0 FOUNDATION</Text>
                </View>

                {/* Main Hero Header */}
                <Text style={styles.title}>Pulse Chat</Text>
                <Text style={styles.subtitle}>
                    Design-First Mobile Architecture
                </Text>

                {/* Status Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>System Readiness</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>• Expo Engine:</Text>
                        <Text style={styles.statusValue}>SDK 54 (TypeScript)</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>• Navigation:</Text>
                        <Text style={styles.statusValue}>Expo Router Active</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>• Gestures & Motion:</Text>
                        <Text style={styles.statusValue}>Reanimated Ready</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>• Backend State:</Text>
                        <Text style={styles.statusValueSuccess}>Offline / Mock Isolated</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing['2xl']
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        marginRight: spacing.sm
    },
    badgeText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5
    },
    title: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: spacing.xs
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 15,
        textAlign: 'center',
        marginBottom: spacing['3xl']
    },
    card: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl
    },
    cardTitle: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: spacing.md
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs + 2
    },
    statusLabel: {
        color: colors.textSecondary,
        fontSize: 13
    },
    statusValue: {
        color: colors.textPrimary,
        fontSize: 13,
        fontWeight: '600'
    },
    statusValueSuccess: {
        color: colors.success,
        fontSize: 13,
        fontWeight: '600'
    }
});
