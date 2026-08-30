import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadows } from '../src/theme';

export default function DesignSystemScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header Badge */}
                <View style={styles.badge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.badgeText}>PHASE 1 DESIGN SYSTEM</Text>
                </View>

                <Text style={styles.displayHeading}>Pulse Theme</Text>
                <Text style={styles.subtitle}>Single Source of Truth for Design Tokens</Text>

                {/* ─── COLOR PALETTE ─────────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Color Palette Tokens</Text>
                    <View style={styles.paletteGrid}>
                        <ColorChip name="primary" color={colors.primary} />
                        <ColorChip name="primaryPressed" color={colors.primaryPressed} />
                        <ColorChip name="background" color={colors.background} border />
                        <ColorChip name="surface" color={colors.surface} border />
                        <ColorChip name="surfaceElevated" color={colors.surfaceElevated} />
                        <ColorChip name="msgIncoming" color={colors.messageIncoming} />
                        <ColorChip name="msgOutgoing" color={colors.messageOutgoing} />
                        <ColorChip name="online / success" color={colors.online} />
                        <ColorChip name="warning" color={colors.warning} />
                        <ColorChip name="error" color={colors.error} />
                    </View>
                </View>

                {/* ─── TYPOGRAPHY HIERARCHY ───────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Typography Scale</Text>
                    <View style={styles.card}>
                        <Text style={[typography.display, { color: colors.textPrimary }]}>Display (32px / 800)</Text>
                        <Text style={[typography.screenTitle, { color: colors.textPrimary, marginTop: spacing.xs }]}>Screen Title (24px / 700)</Text>
                        <Text style={[typography.sectionTitle, { color: colors.primary, marginTop: spacing.xs }]}>Section Title (18px / 600)</Text>
                        <Text style={[typography.chatName, { color: colors.textPrimary, marginTop: spacing.xs }]}>Chat Name (16px / 600)</Text>
                        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>Body (15px / 400) — Fast, fluid messaging for Pulse Chat</Text>
                        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.xs }]}>Body Small (13px / 400)</Text>
                        <Text style={[typography.label, { color: colors.textPrimary, marginTop: spacing.xs }]}>LABEL (12px / 600 uppercase)</Text>
                        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>Caption (11px / 400) • 12:45 PM • Read</Text>
                    </View>
                </View>

                {/* ─── ELEVATION & RADIUS ─────────────────────────── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Elevation & Radius Tokens</Text>
                    <View style={styles.elevationRow}>
                        <View style={[styles.elevationBox, shadows.sm, { borderRadius: radius.sm }]}>
                            <Text style={styles.elevationText}>Radius SM</Text>
                            <Text style={styles.elevationSub}>Shadow SM</Text>
                        </View>
                        <View style={[styles.elevationBox, shadows.md, { borderRadius: radius.md }]}>
                            <Text style={styles.elevationText}>Radius MD</Text>
                            <Text style={styles.elevationSub}>Shadow MD</Text>
                        </View>
                        <View style={[styles.elevationBox, shadows.lg, { borderRadius: radius.lg }]}>
                            <Text style={styles.elevationText}>Radius LG</Text>
                            <Text style={styles.elevationSub}>Shadow LG</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ColorChip({ name, color, border }: { name: string; color: string; border?: boolean }) {
    return (
        <View style={styles.chipWrapper}>
            <View style={[styles.chipBox, { backgroundColor: color }, border && styles.chipBorder]} />
            <Text style={styles.chipName} numberOfLines={1}>{name}</Text>
            <Text style={styles.chipHex}>{color.toUpperCase()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
    },
    scrollContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl
    },
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.sm
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
    displayHeading: {
        ...typography.display,
        color: colors.textPrimary
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl
    },
    section: {
        marginBottom: spacing['2xl']
    },
    sectionTitle: {
        ...typography.sectionTitle,
        color: colors.textPrimary,
        marginBottom: spacing.md
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg
    },
    paletteGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm
    },
    chipWrapper: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border
    },
    chipBox: {
        height: 38,
        borderRadius: radius.sm,
        marginBottom: spacing.xs
    },
    chipBorder: {
        borderWidth: 1,
        borderColor: colors.borderLight
    },
    chipName: {
        ...typography.label,
        color: colors.textPrimary
    },
    chipHex: {
        ...typography.caption,
        color: colors.textMuted
    },
    elevationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm
    },
    elevationBox: {
        flex: 1,
        backgroundColor: colors.surfaceElevated,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border
    },
    elevationText: {
        ...typography.label,
        color: colors.textPrimary
    },
    elevationSub: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2
    }
});
