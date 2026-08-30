import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Switch } from '../../../src/components';
import { colors, spacing } from '../../../src/theme';

export default function NotificationsSettingsScreen() {
    const [messages, setMessages] = useState(true);
    const [preview, setPreview] = useState(true);

    return (
        <Screen scrollable>
            <Header title="Notifications" />

            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Message Alerts
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            Play sound and vibrate for incoming messages
                        </AppText>
                    </View>
                    <Switch value={messages} onValueChange={setMessages} />
                </View>

                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Show Message Preview
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            Display message content in system push notifications
                        </AppText>
                    </View>
                    <Switch value={preview} onValueChange={setPreview} />
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
