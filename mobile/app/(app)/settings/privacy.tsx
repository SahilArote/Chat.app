import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Card,
    Switch,
    AppButton,
    Avatar
} from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';

export default function PrivacySettingsScreen() {
    const [readReceipts, setReadReceipts] = useState(true);
    const [lastSeenChoice, setLastSeenChoice] = useState<'Everyone' | 'Contacts' | 'Nobody'>('Everyone');
    const [blockedList, setBlockedList] = useState([
        { id: 'blk_1', name: 'Spam Bot 3000', username: 'spambot' }
    ]);

    const handleUnblock = (id: string) => {
        setBlockedList(blockedList.filter((b) => b.id !== id));
    };

    return (
        <Screen scrollable>
            <Header title="Privacy" />

            <View style={styles.content}>
                {/* ─── 1. VISIBILITY SETTINGS ───────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        WHO CAN SEE MY INFO
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Last Seen & Online Status
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Currently: {lastSeenChoice}
                                </AppText>
                            </View>
                            <View style={styles.chipChoices}>
                                {(['Everyone', 'Contacts', 'Nobody'] as const).map((opt) => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={[
                                            styles.miniChip,
                                            lastSeenChoice === opt && styles.miniChipActive
                                        ]}
                                        onPress={() => setLastSeenChoice(opt)}
                                    >
                                        <AppText
                                            variant="caption"
                                            color={lastSeenChoice === opt ? '#FFFFFF' : colors.textMuted}
                                            weight="600"
                                            style={{ fontSize: 10 }}
                                        >
                                            {opt}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={[styles.settingRow, { borderBottomWidth: 0, paddingTop: spacing.md }]}>
                            <View style={{ flex: 1, marginRight: spacing.md }}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Read Receipts
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Show double blue checkmarks when messages are viewed
                                </AppText>
                            </View>
                            <Switch value={readReceipts} onValueChange={setReadReceipts} />
                        </View>
                    </Card>
                </View>

                {/* ─── 2. DISAPPEARING MESSAGES ─────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        EPHEMERAL MESSAGING
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Default Message Timer
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Start new chats with disappearing messages
                                </AppText>
                            </View>
                            <AppText variant="bodySmall" color={colors.primary} weight="600">
                                Off
                            </AppText>
                        </View>
                    </Card>
                </View>

                {/* ─── 3. BLOCKED CONTACTS ──────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        BLOCKED CONTACTS ({blockedList.length})
                    </AppText>
                    <Card variant="outlined" style={{ padding: 0 }}>
                        {blockedList.length === 0 ? (
                            <AppText
                                variant="caption"
                                color={colors.textMuted}
                                align="center"
                                style={{ padding: spacing.md }}
                            >
                                You have not blocked any contacts.
                            </AppText>
                        ) : (
                            blockedList.map((blocked) => (
                                <View key={blocked.id} style={styles.blockedRow}>
                                    <Avatar name={blocked.name} size="sm" />
                                    <View style={styles.blockedInfo}>
                                        <AppText variant="chatName" color={colors.textPrimary}>
                                            {blocked.name}
                                        </AppText>
                                        <AppText variant="caption" color={colors.textMuted}>
                                            @{blocked.username}
                                        </AppText>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleUnblock(blocked.id)}
                                        style={styles.unblockBtn}
                                    >
                                        <AppText variant="caption" color={colors.primary} weight="700">
                                            Unblock
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
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
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    chipChoices: {
        flexDirection: 'row',
        gap: 4
    },
    miniChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border
    },
    miniChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    blockedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    blockedInfo: {
        flex: 1,
        marginLeft: spacing.md
    },
    unblockBtn: {
        paddingVertical: 4,
        paddingHorizontal: spacing.sm
    }
});
