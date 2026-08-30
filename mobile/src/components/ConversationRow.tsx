import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import AppText from './AppText';
import Avatar from './Avatar';
import Badge from './Badge';
import { MockConversation, MessageDeliveryStatus } from '../mock/conversations';

export interface ConversationRowProps {
    conversation: MockConversation;
    onPress: (conv: MockConversation) => void;
    onLongPress?: (conv: MockConversation) => void;
}

export const ConversationRow: React.FC<ConversationRowProps> = ({
    conversation,
    onPress,
    onLongPress
}) => {
    const renderDeliveryStatus = (status?: MessageDeliveryStatus) => {
        if (!status) return null;
        switch (status) {
            case 'read':
                return <Ionicons name="checkmark-done" size={14} color={colors.primary} style={styles.statusTick} />;
            case 'delivered':
                return <Ionicons name="checkmark-done" size={14} color={colors.textMuted} style={styles.statusTick} />;
            case 'sent':
                return <Ionicons name="checkmark" size={14} color={colors.textMuted} style={styles.statusTick} />;
            case 'sending':
                return <Ionicons name="time-outline" size={13} color={colors.textMuted} style={styles.statusTick} />;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, conversation.isPinned && styles.pinnedContainer]}
            activeOpacity={0.7}
            onPress={() => onPress(conversation)}
            onLongPress={() => onLongPress && onLongPress(conversation)}
            delayLongPress={280}
        >
            {/* Avatar with Online presence for DMs */}
            <Avatar
                uri={conversation.avatar}
                name={conversation.name}
                size="md"
                status={conversation.type === 'direct' ? 'online' : undefined}
            />

            <View style={styles.content}>
                {/* Top Row: Name, Pin/Mute icons, Timestamp */}
                <View style={styles.topRow}>
                    <View style={styles.nameGroup}>
                        <AppText variant="chatName" color={colors.textPrimary} numberOfLines={1} style={styles.name}>
                            {conversation.name}
                        </AppText>
                        {conversation.isPinned && (
                            <Ionicons name="pin" size={13} color={colors.primary} style={styles.metaIcon} />
                        )}
                        {conversation.isMuted && (
                            <Ionicons name="volume-mute" size={14} color={colors.textMuted} style={styles.metaIcon} />
                        )}
                    </View>

                    <AppText
                        variant="caption"
                        color={conversation.unreadCount > 0 ? colors.primary : colors.textMuted}
                        weight={conversation.unreadCount > 0 ? '700' : '400'}
                    >
                        {conversation.lastMessageTimestamp}
                    </AppText>
                </View>

                {/* Bottom Row: Last message or Typing indicator + Unread badge */}
                <View style={styles.bottomRow}>
                    <View style={styles.messagePreview}>
                        {conversation.isTyping ? (
                            <View style={styles.typingContainer}>
                                <AppText variant="bodySmall" color={colors.online} weight="600">
                                    {conversation.typingUserName ? `${conversation.typingUserName} is typing...` : 'typing...'}
                                </AppText>
                            </View>
                        ) : (
                            <View style={styles.lastMessageRow}>
                                {conversation.type === 'direct' && renderDeliveryStatus(conversation.lastMessageStatus)}
                                <AppText
                                    variant="bodySmall"
                                    color={conversation.unreadCount > 0 ? colors.textPrimary : colors.textSecondary}
                                    weight={conversation.unreadCount > 0 ? '600' : '400'}
                                    numberOfLines={1}
                                    style={styles.messageText}
                                >
                                    {conversation.lastMessage}
                                </AppText>
                            </View>
                        )}
                    </View>

                    {conversation.unreadCount > 0 && (
                        <Badge count={conversation.unreadCount} variant="primary" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    pinnedContainer: {
        backgroundColor: 'rgba(99, 102, 241, 0.03)'
    },
    content: {
        flex: 1,
        marginLeft: spacing.md
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3
    },
    nameGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: spacing.sm
    },
    name: {
        fontWeight: '600',
        flexShrink: 1
    },
    metaIcon: {
        marginLeft: 6
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    messagePreview: {
        flex: 1,
        marginRight: spacing.sm
    },
    lastMessageRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTick: {
        marginRight: 4
    },
    messageText: {
        flex: 1
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default ConversationRow;
