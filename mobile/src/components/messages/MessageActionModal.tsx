import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../BottomSheet';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';
import { MockMessage } from '../../mock/messages';

export interface MessageActionModalProps {
    message: MockMessage | null;
    visible: boolean;
    onClose: () => void;
    onReact: (msgId: string, emoji: string) => void;
    onReply: (msg: MockMessage) => void;
    onCopy: (text: string) => void;
    onForward: (msg: MockMessage) => void;
    onStar: (msg: MockMessage) => void;
    onDelete: (msgId: string) => void;
}

export const MessageActionModal: React.FC<MessageActionModalProps> = ({
    message,
    visible,
    onClose,
    onReact,
    onReply,
    onCopy,
    onForward,
    onStar,
    onDelete
}) => {
    if (!message) return null;

    const quickEmojis = ['👍', '❤️', '🔥', '😂', '😮', '😢', '🙏'];

    const actions = [
        {
            label: 'Reply',
            icon: 'arrow-undo-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onReply(message),
            color: colors.textPrimary
        },
        {
            label: 'Copy Text',
            icon: 'copy-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onCopy(message.text || ''),
            color: colors.textPrimary,
            hide: !message.text
        },
        {
            label: 'Forward Message',
            icon: 'arrow-redo-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onForward(message),
            color: colors.textPrimary
        },
        {
            label: 'Star Message',
            icon: 'star-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onStar(message),
            color: colors.textPrimary
        },
        {
            label: 'Delete Message',
            icon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
            action: () => onDelete(message.id),
            color: colors.error
        }
    ];

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Message Options">
            {/* Quick Emoji Reaction Pill Bar */}
            <View style={styles.emojiBar}>
                {quickEmojis.map((emoji) => (
                    <TouchableOpacity
                        key={emoji}
                        style={styles.emojiBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                            onReact(message.id, emoji);
                            onClose();
                        }}
                    >
                        <AppText style={styles.emojiText}>{emoji}</AppText>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Context Actions */}
            <View style={styles.actionList}>
                {actions
                    .filter((a) => !a.hide)
                    .map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.actionRow}
                            activeOpacity={0.7}
                            onPress={() => {
                                item.action();
                                onClose();
                            }}
                        >
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={item.color}
                                style={styles.actionIcon}
                            />
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
    emojiBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border
    },
    emojiBtn: {
        paddingHorizontal: 8,
        paddingVertical: 2
    },
    emojiText: {
        fontSize: 22
    },
    actionList: {
        paddingVertical: spacing.xs
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    actionIcon: {
        marginRight: spacing.md,
        width: 24
    }
});

export default MessageActionModal;
