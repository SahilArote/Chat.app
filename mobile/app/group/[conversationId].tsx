import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Header, AppText, Avatar, Card, AppButton } from '../../src/components';
import { colors, spacing } from '../../src/theme';

export default function GroupInfoScreen() {
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();

    const mockMembers = [
        { id: '1', name: 'Sahil Arote', role: 'Admin', online: true },
        { id: '2', name: 'Alex Rivera', role: 'Member', online: false },
        { id: '3', name: 'Sarah Jenkins', role: 'Member', online: true }
    ];

    return (
        <Screen scrollable>
            <Header title="Group Info" />

            <View style={styles.content}>
                <View style={styles.groupHeader}>
                    <Avatar name="Pulse Engineering" size="xl" />
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.name}>
                        Pulse Engineering
                    </AppText>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        Group • {mockMembers.length} Members
                    </AppText>
                </View>

                {/* Members Section */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionTitle}>
                        MEMBERS
                    </AppText>

                    <Card variant="outlined">
                        {mockMembers.map((member) => (
                            <View key={member.id} style={styles.memberRow}>
                                <Avatar
                                    name={member.name}
                                    size="sm"
                                    status={member.online ? 'online' : 'offline'}
                                />
                                <View style={styles.memberInfo}>
                                    <AppText variant="chatName" color={colors.textPrimary}>
                                        {member.name}
                                    </AppText>
                                    <AppText variant="caption" color={colors.textMuted}>
                                        {member.role}
                                    </AppText>
                                </View>
                            </View>
                        ))}
                    </Card>
                </View>

                <AppButton
                    title="Leave Group"
                    variant="danger"
                    size="md"
                    fullWidth
                    style={styles.leaveBtn}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    groupHeader: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    name: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    section: {
        marginVertical: spacing.md
    },
    sectionTitle: {
        marginBottom: spacing.sm,
        marginLeft: spacing.xs
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm
    },
    memberInfo: {
        marginLeft: spacing.md,
        flex: 1
    },
    leaveBtn: {
        marginTop: spacing.xl
    }
});
