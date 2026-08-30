import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Switch } from '../../../src/components';
import { colors, spacing } from '../../../src/theme';

export default function PrivacySettingsScreen() {
    const [readReceipts, setReadReceipts] = useState(true);
    const [lastSeen, setLastSeen] = useState(true);

    return (
        <Screen scrollable>
            <Header title="Privacy" />

            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Read Receipts
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            If turned off, you won't send or receive read receipts
                        </AppText>
                    </View>
                    <Switch value={readReceipts} onValueChange={setReadReceipts} />
                </View>

                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Online Status
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            Allow your contacts to see when you are active
                        </AppText>
                    </View>
                    <Switch value={lastSeen} onValueChange={setLastSeen} />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.md
    }
});
