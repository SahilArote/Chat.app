import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Card, AppButton } from '../../../src/components';
import { colors, spacing } from '../../../src/theme';

export default function StorageSettingsScreen() {
    return (
        <Screen scrollable>
            <Header title="Storage & Data" />

            <View style={styles.content}>
                <Card variant="outlined" style={styles.card}>
                    <AppText variant="label" color={colors.textSecondary}>MEDIA CACHE</AppText>
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.sizeText}>
                        12.4 MB
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted} style={styles.sub}>
                        Local temporary thumbnails & message audio
                    </AppText>
                </Card>

                <AppButton
                    title="Clear Cached Files"
                    variant="outline"
                    size="md"
                    fullWidth
                    onPress={() => {}}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    card: {
        marginBottom: spacing.lg
    },
    sizeText: {
        marginTop: spacing.xs
    },
    sub: {
        marginTop: 2
    }
});
