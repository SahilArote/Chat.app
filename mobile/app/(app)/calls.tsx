import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    AppIconButton,
    Chip,
    EmptyState
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import callRepository from '../../src/repositories/CallRepository';
import { MockCall } from '../../src/mock/calls';

export default function CallsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'missed'>('all');
    const [calls, setCalls] = useState<MockCall[]>([]);

    const loadCalls = useCallback(async () => {
        const list = await callRepository.getCalls(filter);
        setCalls(list);
    }, [filter]);

    useEffect(() => {
        loadCalls();
    }, [loadCalls]);

    const handleStartCall = (call: MockCall) => {
        router.push({
            pathname: '/call/[callId]',
            params: { callId: call.id, type: call.type, contactName: call.contactName }
        });
    };

    const handleDemoIncoming = () => {
        router.push('/call/incoming');
    };

    const renderDirectionIcon = (call: MockCall) => {
        if (call.direction === 'missed') {
            return <Ionicons name="arrow-down-outline" size={14} color={colors.error} style={styles.dirIcon} />;
        }
        if (call.direction === 'incoming') {
            return <Ionicons name="arrow-down-outline" size={14} color={colors.success} style={styles.dirIcon} />;
        }
        return <Ionicons name="arrow-up-outline" size={14} color={colors.primary} style={styles.dirIcon} />;
    };

    return (
        <Screen style={styles.container}>
            {/* ─── 1. CALLS HEADER ──────────────────────────────────── */}
            <Header
                title="Calls"
                showBack={false}
                leftAction={
                    <TouchableOpacity
                        style={styles.demoRingPill}
                        onPress={handleDemoIncoming}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="notifications-outline" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                        <AppText variant="caption" color={colors.primary} weight="700">
                            Simulate Ring
                        </AppText>
                    </TouchableOpacity>
                }
                rightAction={
                    <AppIconButton
                        icon={<Ionicons name="call-outline" size={20} color={colors.primary} />}
                        onPress={() => router.push('/search')}
                        variant="filled"
                    />
                }
            />

            {/* ─── 2. CATEGORY FILTERS ──────────────────────────────── */}
            <View style={styles.filterSection}>
                <Chip
                    label="All Calls"
                    selected={filter === 'all'}
                    onPress={() => setFilter('all')}
                />
                <Chip
                    label="Missed"
                    selected={filter === 'missed'}
                    onPress={() => setFilter('missed')}
                />
            </View>

            {/* ─── 3. CALL LOG LIST ─────────────────────────────────── */}
            <FlatList
                data={calls}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.callRow}
                        activeOpacity={0.75}
                        onPress={() => handleStartCall(item)}
                    >
                        <Avatar name={item.contactName} size="md" uri={item.contactAvatar} />

                        <View style={styles.callInfo}>
                            <AppText
                                variant="chatName"
                                color={item.direction === 'missed' ? colors.error : colors.textPrimary}
                                style={styles.name}
                            >
                                {item.contactName}
                            </AppText>

                            <View style={styles.metaRow}>
                                {renderDirectionIcon(item)}
                                <AppText variant="caption" color={colors.textMuted}>
                                    {item.timestamp}
                                    {item.duration ? ` • ${item.duration}` : ''}
                                </AppText>
                            </View>
                        </View>

                        <AppIconButton
                            icon={
                                <Ionicons
                                    name={item.type === 'video' ? 'videocam-outline' : 'call-outline'}
                                    size={20}
                                    color={colors.primary}
                                />
                            }
                            onPress={() => handleStartCall(item)}
                            variant="ghost"
                        />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <EmptyState
                        icon="call-outline"
                        title="No Calls Yet"
                        description="You have no call history recorded."
                    />
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    demoRingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primarySubtle,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.primary
    },
    filterSection: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        gap: spacing.sm
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl']
    },
    callRow: {
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
    dirIcon: {
        marginRight: 4
    }
});
