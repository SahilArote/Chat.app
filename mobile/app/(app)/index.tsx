import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    AppText,
    AppIconButton,
    Avatar,
    Chip,
    EmptyState,
    ErrorState,
    ConversationRow,
    ChatActionSheet,
    OfflineBanner,
    ChatListSkeleton
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { mockUsers } from '../../src/mock/users';
import { MockConversation } from '../../src/mock/conversations';
import conversationRepository from '../../src/repositories/ConversationRepository';

export default function ChatsListScreen() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [conversations, setConversations] = useState<MockConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedConv, setSelectedConv] = useState<MockConversation | null>(null);
    const [actionSheetVisible, setActionSheetVisible] = useState(false);

    const loadConversations = useCallback(async () => {
        try {
            setHasError(false);
            const list = await conversationRepository.getConversations(selectedFilter);
            setConversations(list);
        } catch (e) {
            setHasError(true);
        } finally {
            setLoading(false);
        }
    }, [selectedFilter]);

    useEffect(() => {
        // Initial simulated loading skeleton
        const timer = setTimeout(() => {
            loadConversations();
        }, 400);
        return () => clearTimeout(timer);
    }, [loadConversations]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadConversations();
        setRefreshing(false);
    };

    const handleOpenChat = (conv: MockConversation) => {
        router.push(`/chat/${conv.id}`);
    };

    const handleLongPress = (conv: MockConversation) => {
        setSelectedConv(conv);
        setActionSheetVisible(true);
    };

    const handleTogglePin = async (conv: MockConversation) => {
        await conversationRepository.togglePin(conv.id);
        loadConversations();
    };

    const handleToggleMute = async (conv: MockConversation) => {
        await conversationRepository.toggleMute(conv.id);
        loadConversations();
    };

    const handleToggleArchive = async (conv: MockConversation) => {
        await conversationRepository.toggleArchive(conv.id);
        loadConversations();
    };

    const handleMarkRead = async (conv: MockConversation) => {
        await conversationRepository.markAsRead(conv.id);
        loadConversations();
    };

    const handleDelete = async (conv: MockConversation) => {
        await conversationRepository.deleteConversation(conv.id);
        loadConversations();
    };

    const filters = ['All', 'Direct', 'Groups', 'Unread', 'Pinned'];

    return (
        <Screen style={styles.container}>
            {/* ─── 1. OFFLINE RECONNECTING BANNER ───────────────────── */}
            <OfflineBanner
                visible={isOffline}
                onRetry={() => setIsOffline(false)}
            />

            {/* ─── 2. TOP BRAND HEADER ──────────────────────────────── */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.pulseLogoBadge}>
                        <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.headerText}>
                        <AppText variant="screenTitle" color={colors.textPrimary} style={styles.brandTitle}>
                            Pulse
                        </AppText>
                        <TouchableOpacity onPress={() => setIsOffline(!isOffline)}>
                            <AppText
                                variant="caption"
                                color={isOffline ? colors.warning : colors.online}
                                style={styles.onlineBadge}
                            >
                                {isOffline ? '● Offline (Tap to connect)' : '● Connected'}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <AppIconButton
                        icon={<Ionicons name="search-outline" size={20} color={colors.textPrimary} />}
                        onPress={() => router.push('/search')}
                        variant="filled"
                        style={styles.actionBtn}
                    />
                    <AppIconButton
                        icon={<Ionicons name="add" size={24} color="#FFFFFF" />}
                        onPress={() => router.push('/group/create')}
                        variant="filled"
                        style={[styles.actionBtn, styles.newChatBtn]}
                    />
                </View>
            </View>

            {/* ─── 3. ACTIVE CONTACTS STORY CAROUSEL ────────────────── */}
            <View style={styles.storiesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.storiesScroll}
                >
                    <TouchableOpacity
                        style={styles.storyItem}
                        activeOpacity={0.7}
                        onPress={() => router.push('/group/create')}
                    >
                        <View style={styles.addStoryCircle}>
                            <Ionicons name="add" size={22} color={colors.primary} />
                        </View>
                        <AppText variant="caption" color={colors.textSecondary} style={styles.storyName}>
                            New Group
                        </AppText>
                    </TouchableOpacity>

                    {mockUsers.map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            style={styles.storyItem}
                            activeOpacity={0.7}
                            onPress={() => router.push(`/user/${user.id}`)}
                        >
                            <View style={[styles.avatarRing, user.status === 'online' && styles.avatarRingOnline]}>
                                <Avatar
                                    uri={user.avatar}
                                    name={user.name}
                                    size="md"
                                    status={user.status}
                                />
                            </View>
                            <AppText
                                variant="caption"
                                color={colors.textPrimary}
                                numberOfLines={1}
                                style={styles.storyName}
                            >
                                {user.name.split(' ')[0]}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* ─── 4. FILTER CHIPS ──────────────────────────────────── */}
            <View style={styles.filterSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {filters.map((filter) => (
                        <Chip
                            key={filter}
                            label={filter}
                            selected={selectedFilter === filter}
                            onPress={() => setSelectedFilter(filter)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* ─── 5. STATE MATRIX: SKELETON / ERROR / FLATLIST ─────── */}
            {loading ? (
                <ChatListSkeleton />
            ) : hasError ? (
                <ErrorState
                    title="Failed to Load Chats"
                    message="Unable to retrieve conversation list. Please check your network."
                    onRetry={() => {
                        setLoading(true);
                        loadConversations();
                    }}
                />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ConversationRow
                            conversation={item}
                            onPress={handleOpenChat}
                            onLongPress={handleLongPress}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <EmptyState
                            icon="chatbubbles-outline"
                            title="No Conversations Found"
                            description={`There are no chats matching the "${selectedFilter}" category filter.`}
                            actionTitle="Start New Chat"
                            onAction={() => router.push('/group/create')}
                            style={styles.emptyState}
                        />
                    }
                    contentContainerStyle={conversations.length === 0 ? styles.emptyListContent : styles.listContent}
                />
            )}

            {/* ─── 6. LONG PRESS CHAT ACTION SHEET ─────────────────── */}
            <ChatActionSheet
                conversation={selectedConv}
                visible={actionSheetVisible}
                onClose={() => setActionSheetVisible(false)}
                onTogglePin={handleTogglePin}
                onToggleMute={handleToggleMute}
                onToggleArchive={handleToggleArchive}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pulseLogoBadge: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm
    },
    headerText: {
        justifyContent: 'center'
    },
    brandTitle: {
        fontWeight: '800',
        lineHeight: 22
    },
    onlineBadge: {
        fontSize: 10,
        fontWeight: '600',
        lineHeight: 12
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs
    },
    actionBtn: {
        width: 38,
        height: 38
    },
    newChatBtn: {
        backgroundColor: colors.primary
    },
    storiesSection: {
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    storiesScroll: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        alignItems: 'center'
    },
    storyItem: {
        alignItems: 'center',
        width: 58
    },
    addStoryCircle: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4
    },
    avatarRing: {
        padding: 2,
        borderRadius: radius.full
    },
    avatarRingOnline: {
        borderWidth: 1.5,
        borderColor: colors.primary
    },
    storyName: {
        fontSize: 11,
        marginTop: 2
    },
    filterSection: {
        paddingVertical: spacing.sm
    },
    filterScroll: {
        paddingHorizontal: spacing.lg,
        gap: spacing.xs
    },
    listContent: {
        paddingBottom: spacing['4xl']
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    emptyState: {
        paddingVertical: spacing['3xl']
    }
});
