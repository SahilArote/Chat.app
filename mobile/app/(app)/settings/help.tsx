import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Card } from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';

export default function HelpScreen() {
    const helpItems = [
        { title: 'Terms of Service', icon: 'document-text-outline' as const },
        { title: 'Privacy Policy', icon: 'shield-outline' as const },
        { title: 'Open Source Licenses', icon: 'code-working-outline' as const },
        { title: 'Contact Support & Feedback', icon: 'mail-outline' as const }
    ];

    return (
        <Screen scrollable>
            <Header title="Help & About" />

            <View style={styles.content}>
                {/* Brand Hero */}
                <View style={styles.brandHero}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="chatbubble-ellipses" size={40} color={colors.primary} />
                    </View>
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.brandName}>
                        Pulse Chat
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                        Version 1.0.0 (Build 2026.08.30)
                    </AppText>
                    <AppText variant="caption" color={colors.primary} weight="600" style={{ marginTop: 4 }}>
                        React Native • Expo 54 • Design-First
                    </AppText>
                </View>

                {/* Legal & Support Links */}
                <View style={styles.section}>
                    <Card variant="outlined" style={{ padding: 0 }}>
                        {helpItems.map((item, idx) => (
                            <TouchableOpacity
                                key={item.title}
                                style={[
                                    styles.linkRow,
                                    idx === helpItems.length - 1 && { borderBottomWidth: 0 }
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons name={item.icon} size={20} color={colors.primary} style={styles.icon} />
                                <AppText variant="body" color={colors.textPrimary} style={styles.title}>
                                    {item.title}
                                </AppText>
                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>

                {/* Copyright */}
                <AppText variant="caption" color={colors.textMuted} align="center" style={styles.copyright}>
                    © 2026 Pulse Chat. All rights reserved.
                </AppText>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing['4xl']
    },
    brandHero: {
        alignItems: 'center',
        marginVertical: spacing.xl
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md
    },
    brandName: {
        fontWeight: '800',
        marginBottom: 2
    },
    section: {
        marginVertical: spacing.md
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    icon: {
        marginRight: spacing.md
    },
    title: {
        flex: 1
    },
    copyright: {
        marginTop: spacing.xl
    }
});
