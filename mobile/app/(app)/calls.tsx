import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Avatar, AppIconButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function CallsScreen() {
    const mockCalls = [
        {
            id: 'call_1',
            name: 'Sahil Arote',
            type: 'video' as const,
            direction: 'incoming' as const,
            time: 'Today, 2:15 PM',
            missed: false
        },
        {
            id: 'call_2',
            name: 'Sarah Jenkins',
            type: 'audio' as const,
            direction: 'missed' as const,
            time: 'Yesterday, 8:40 PM',
            missed: true
        }
    ];

    return (
        <Screen scrollable>
            <Header
                title="Calls"
                showBack={false}
                rightAction={
                    <AppIconButton
                        icon={<Ionicons name="call-outline" size={20} color={colors.primary} />}
                        onPress={() => {}}
                    />
                }
            />

            <View style={styles.content}>
                <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                    RECENT CALLS
                </AppText>

                {mockCalls.map((call) => (
                    <View key={call.id} style={styles.callItem}>
                        <Avatar name={call.name} size="md" />

                        <View style={styles.callInfo}>
                            <AppText
                                variant="chatName"
                                color={call.missed ? colors.error : colors.textPrimary}
                                style={styles.name}
                            >
                                {call.name}
                            </AppText>
                            <View style={styles.metaRow}>
                                <Ionicons
                                    name={call.direction === 'missed' ? 'arrow-down-outline' : 'arrow-up-outline'}
                                    size={14}
                                    color={call.missed ? colors.error : colors.success}
                                />
                                <AppText variant="caption" color={colors.textMuted} style={styles.time}>
                                    {call.time}
                                </AppText>
                            </View>
                        </View>

                        <AppIconButton
                            icon={
                                <Ionicons
                                    name={call.type === 'video' ? 'videocam-outline' : 'call-outline'}
                                    size={20}
                                    color={colors.primary}
                                />
                            }
                            onPress={() => {}}
                        />
                    </View>
                ))}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md
    },
    sectionHeader: {
        marginBottom: spacing.sm,
        marginLeft: spacing.xs
    },
    callItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    callInfo: {
        flex: 1,
        marginLeft: spacing.md
    },
    name: {
        fontWeight: '600'
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },
    time: {
        marginLeft: spacing.xs
    }
});
