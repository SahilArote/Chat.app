import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Card } from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';

export default function AppearanceSettingsScreen() {
    return (
        <Screen scrollable>
            <Header title="Appearance" />

            <View style={styles.content}>
                <AppText variant="label" color={colors.textSecondary} style={styles.label}>
                    APPLICATION THEME
                </AppText>

                <Card variant="elevated" style={styles.themeCard}>
                    <View style={styles.swatch} />
                    <View style={styles.themeInfo}>
                        <AppText variant="chatName" color={colors.textPrimary}>
                            Pulse Obsidian Dark (Default)
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            Optimized for AMOLED displays & power efficiency
                        </AppText>
                    </View>
                </Card>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    label: {
        marginBottom: spacing.sm
    },
    themeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md
    },
    swatch: {
        width: 32,
        height: 32,
        borderRadius: radius.sm,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.textPrimary
    },
    themeInfo: {
        marginLeft: spacing.md,
        flex: 1
    }
});
