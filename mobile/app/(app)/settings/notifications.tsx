import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Header, AppText, Card, Switch } from '../../../src/components';
import { colors, spacing } from '../../../src/theme';

export default function NotificationsSettingsScreen() {
    const [msgSounds, setMsgSounds] = useState(true);
    const [msgVibrate, setMsgVibrate] = useState(true);
    const [msgPreview, setMsgPreview] = useState(true);

    const [grpSounds, setGrpSounds] = useState(true);
    const [grpMentionsOnly, setGrpMentionsOnly] = useState(false);

    const [inAppHaptics, setInAppHaptics] = useState(true);

    return (
        <Screen scrollable>
            <Header title="Notifications" />

            <View style={styles.content}>
                {/* ─── 1. DIRECT MESSAGES ───────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        DIRECT MESSAGES
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Message Sounds
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Play alert tone for incoming direct chats
                                </AppText>
                            </View>
                            <Switch value={msgSounds} onValueChange={setMsgSounds} />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Vibration
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Vibrate phone on incoming messages
                                </AppText>
                            </View>
                            <Switch value={msgVibrate} onValueChange={setMsgVibrate} />
                        </View>

                        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Show Message Preview
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Display message text in push notifications
                                </AppText>
                            </View>
                            <Switch value={msgPreview} onValueChange={setMsgPreview} />
                        </View>
                    </Card>
                </View>

                {/* ─── 2. GROUP CHATS ───────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        GROUP CHATS
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Group Sounds
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Play alert tone for group messages
                                </AppText>
                            </View>
                            <Switch value={grpSounds} onValueChange={setGrpSounds} />
                        </View>

                        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Notify for @Mentions Only
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Silence group alerts unless directly mentioned
                                </AppText>
                            </View>
                            <Switch value={grpMentionsOnly} onValueChange={setGrpMentionsOnly} />
                        </View>
                    </Card>
                </View>

                {/* ─── 3. IN-APP HAPTICS ────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        IN-APP FEEDBACK
                    </AppText>
                    <Card variant="outlined">
                        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.textCol}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Haptic Vibrations
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Tactile feedback when tapping reactions & long pressing
                                </AppText>
                            </View>
                            <Switch value={inAppHaptics} onValueChange={setInAppHaptics} />
                        </View>
                    </Card>
                </View>
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
    section: {
        marginVertical: spacing.xs
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    textCol: {
        flex: 1,
        marginRight: spacing.md
    }
});
