import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Card } from '../../../src/components';
import { colors, spacing } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';

export default function AccountSettingsScreen() {
    const { user } = useAuth();

    return (
        <Screen scrollable>
            <Header title="Account" />

            <View style={styles.content}>
                <Card variant="outlined" style={styles.card}>
                    <AppText variant="label" color={colors.textSecondary}>USERNAME</AppText>
                    <AppText variant="body" color={colors.textPrimary} style={styles.value}>
                        {user?.username}
                    </AppText>

                    <AppText variant="label" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
                        EMAIL ADDRESS
                    </AppText>
                    <AppText variant="body" color={colors.textPrimary} style={styles.value}>
                        {user?.email}
                    </AppText>
                </Card>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    card: {
        marginBottom: spacing.md
    },
    value: {
        marginTop: spacing.xs,
        fontWeight: '500'
    }
});
