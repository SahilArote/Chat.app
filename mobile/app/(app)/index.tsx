import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    Badge,
    Chip,
    AppIconButton
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function ChatsListScreen() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState('All');

    const mockChats = [
        {
            id: 'conv_1',
            name: 'Sahil Arote',
            lastMessage: 'Hey! The new Phase 3 navigation structure is live 🚀',
            time: '12:45 PM',
            unreadCount: 2,
            online: true
        },
        {
            id: 'conv_2',
            name: 'Pulse Engineering Core',
            lastMessage: 'Alex: React Native Reanimated gestures look super smooth!',
            time: '11:30 AM',
            unreadCount: 0,
            online: false
        },
        {
            id: 'conv_3',
            name: 'Sarah Jenkins',
            lastMessage: 'Let me know once the design freeze is ready.',
            time: 'Yesterday',
            unreadCount: 0,
            online: true
        }
    ];

    return (
        <Screen scrollable>
            <Header
                title="Pulse Chat"
                showBack={false}
                leftAction={
                    <AppIconButton
                        icon={<Ionicons name="search-outline" size={20} color={colors.textPrimary} />}
                        onPress={() => router.push('/search')}
                    />
                }
                rightAction={
                    <AppIconButton
                        icon={<Ionicons name="add-circle-outline" size={24} color={colors.primary} />}
                        onPress={() => router.push('/group/create')}
                    />
                }
            />

            {/* Filter Chips */}
            <View style={styles.filterRow}>
                {['All', 'Direct', 'Groups', 'Unread'].map((filter) => (
                    <Chip
                        key={filter}
                        label={filter}
                        selected={selectedFilter === filter}
                        onPress={() => setSelectedFilter(filter)}
                    />
                ))}
            </View>

            {/* Conversation List */}
            <View style={styles.chatList}>
                {mockChats.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        style={styles.chatItem}
                        activeOpacity={0.75}
                        onPress={() => router.push(`/chat/${chat.id}`)}
                    >
                        <Avatar
                            name={chat.name}
                            size="md"
                            status={chat.online ? 'online' : 'offline'}
                        />

                        <View style={styles.chatInfo}>
                            <View style={styles.chatHeader}>
                                <AppText variant="chatName" numberOfLines={1} style={styles.name}>
                                    {chat.name}
                                </AppText>
                                <AppText variant="caption" color={colors.textMuted}>
                                    {chat.time}
                                </AppText>
                            </View>

                            <View style={styles.chatFooter}>
                                <AppText
                                    variant="bodySmall"
                                    color={chat.unreadCount > 0 ? colors.textPrimary : colors.textSecondary}
                                    numberOfLines={1}
                                    style={styles.lastMessage}
                                >
                                    {chat.lastMessage}
                                </AppText>

                                {chat.unreadCount > 0 && <Badge count={chat.unreadCount} />}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.sm
    },
    chatList: {
        paddingHorizontal: spacing.md
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    chatInfo: {
        flex: 1,
        marginLeft: spacing.md
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    name: {
        fontWeight: '600'
    },
    chatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    lastMessage: {
        flex: 1,
        marginRight: spacing.sm
    }
});
