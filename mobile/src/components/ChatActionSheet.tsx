import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import BottomSheet from './BottomSheet';
import AppText from './AppText';
import { MockConversation } from '../mock/conversations';

export interface ChatActionSheetProps {
    conversation: MockConversation | null;
    visible: boolean;
    onClose: () => void;
    onTogglePin: (conv: MockConversation) => void;
    onToggleMute: (conv: MockConversation) => void;
    onToggleArchive: (conv: MockConversation) => void;
    onMarkRead: (conv: MockConversation) => void;
    onDelete: (conv: MockConversation) => void;
}

export const ChatActionSheet: React.FC<ChatActionSheetProps> = ({
    conversation,
    visible,
    onClose,
    onTogglePin,
    onToggleMute,
    onToggleArchive,
    onMarkRead,
    onDelete
}) => {
    if (!conversation) return null;

    const actionItems = [
        {
            label: conversation.isPinned ? 'Unpin Conversation' : 'Pin to Top',
            icon: (conversation.isPinned ? 'pin-outline' : 'pin') as keyof typeof Ionicons.glyphMap,
            action: () => onTogglePin(conversation),
            color: colors.textPrimary
        },
        {
            label: conversation.isMuted ? 'Unmute Notifications' : 'Mute Notifications',
            icon: (conversation.isMuted ? 'volume-high-outline' : 'volume-mute-outline') as keyof typeof Ionicons.glyphMap,
            action: () => onToggleMute(conversation),
            color: colors.textPrimary
        },
        {
            label: conversation.unreadCount > 0 ? 'Mark as Read' : 'Mark as Unread',
            icon: (conversation.unreadCount > 0 ? 'mail-open-outline' : 'mail-unread-outline') as keyof typeof Ionicons.glyphMap,
            action: () => onMarkRead(conversation),
            color: colors.textPrimary
        },
        {
            label: conversation.isArchived ? 'Unarchive Chat' : 'Archive Chat',
            icon: 'archive-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onToggleArchive(conversation),
            color: colors.textPrimary
        },
        {
            label: 'Delete Conversation',
            icon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onDelete(conversation),
            color: colors.error
        }
    ];

    return (
        <BottomSheet visible={visible} onClose={onClose} title={conversation.name}>
            <View style={styles.list}>
                {actionItems.map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.actionRow}
                        activeOpacity={0.7}
                        onPress={() => {
                            item.action();
                            onClose();
                        }}
                    >
                        <Ionicons name={item.icon} size={22} color={item.color} style={styles.icon} />
                        <AppText variant="body" color={item.color} weight="500">
                            {item.label}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingVertical: spacing.xs
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    icon: {
        marginRight: spacing.md,
        width: 24
    }
});

export default ChatActionSheet;
