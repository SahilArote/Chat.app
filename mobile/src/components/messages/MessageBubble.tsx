import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import AppText from '../AppText';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import AudioMessage from './AudioMessage';
import FileMessage from './FileMessage';
import SystemMessage from './SystemMessage';
import { MockMessage } from '../../mock/messages';

export interface MessageBubbleProps {
    message: MockMessage;
    currentUserId: string;
    onImagePress: (url: string) => void;
    onLongPress: (message: MockMessage) => void;
    onReactionPress: (msgId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    currentUserId,
    onImagePress,
    onLongPress,
    onReactionPress
}) => {
    const isOutgoing = message.senderId === currentUserId;

    if (message.type === ('system' as any)) {
        return <SystemMessage text={message.text || ''} />;
    }

    const renderDeliveryStatus = (status: MockMessage['status']) => {
        switch (status) {
            case 'read':
                return <Ionicons name="checkmark-done" size={14} color="#FFFFFF" style={{ marginLeft: 3 }} />;
            case 'delivered':
                return <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 3 }} />;
            case 'sent':
                return <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.7)" style={{ marginLeft: 3 }} />;
            case 'sending':
                return <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.7)" style={{ marginLeft: 3 }} />;
        }
    };

    const renderMessageContent = () => {
        switch (message.type) {
            case 'image':
                return (
                    <ImageMessage
                        mediaUrl={message.mediaUrl || ''}
                        caption={message.text}
                        isOutgoing={isOutgoing}
                        onPress={onImagePress}
                    />
                );
            case 'audio':
                return (
                    <AudioMessage
                        duration={message.audioDuration || '0:12'}
                        isOutgoing={isOutgoing}
                    />
                );
            case 'file':
                return (
                    <FileMessage
                        fileName={message.fileName}
                        fileSize={message.fileSize}
                        isOutgoing={isOutgoing}
                    />
                );
            case 'text':
            default:
                return (
                    <TextMessage
                        text={message.text || ''}
                        isOutgoing={isOutgoing}
                    />
                );
        }
    };

    return (
        <View
            style={[
                styles.rowContainer,
                isOutgoing ? styles.outgoingRow : styles.incomingRow
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.85}
                onLongPress={() => onLongPress(message)}
                delayLongPress={280}
                style={[
                    styles.bubble,
                    isOutgoing ? styles.outgoingBubble : styles.incomingBubble
                ]}
            >
                {/* Quoted Reply */}
                {message.replyTo && (
                    <View style={[styles.quotedContainer, isOutgoing && styles.quotedOutgoing]}>
                        <AppText
                            variant="caption"
                            color={isOutgoing ? '#FFFFFF' : colors.primary}
                            weight="700"
                        >
                            {message.replyTo.senderName}
                        </AppText>
                        <AppText
                            variant="caption"
                            color={isOutgoing ? 'rgba(255,255,255,0.8)' : colors.textSecondary}
                            numberOfLines={1}
                        >
                            {message.replyTo.text}
                        </AppText>
                    </View>
                )}

                {/* Specific Message Type Content */}
                {renderMessageContent()}

                {/* Footer: Timestamp & Delivery Status */}
                <View style={styles.footerRow}>
                    <AppText
                        variant="caption"
                        color={isOutgoing ? 'rgba(255,255,255,0.7)' : colors.textMuted}
                        style={styles.timeText}
                    >
                        {message.timestamp}
                    </AppText>
                    {isOutgoing && renderDeliveryStatus(message.status)}
                </View>

                {/* Emoji Reaction Badges */}
                {message.reactions && message.reactions.length > 0 && (
                    <View style={styles.reactionsRow}>
                        {message.reactions.map((r, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.reactionPill,
                                    r.userReacted && styles.reactionPillActive
                                ]}
                                onPress={() => onReactionPress(message.id, r.emoji)}
                                activeOpacity={0.7}
                            >
                                <AppText style={{ fontSize: 11 }}>{r.emoji}</AppText>
                                <AppText
                                    variant="caption"
                                    color={colors.textPrimary}
                                    style={{ marginLeft: 3 }}
                                >
                                    {r.count}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        paddingHorizontal: spacing.md
    },
    incomingRow: {
        justifyContent: 'flex-start'
    },
    outgoingRow: {
        justifyContent: 'flex-end'
    },
    bubble: {
        maxWidth: '82%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg
    },
    incomingBubble: {
        backgroundColor: colors.messageIncoming,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border
    },
    outgoingBubble: {
        backgroundColor: colors.messageOutgoing,
        borderBottomRightRadius: 4
    },
    quotedContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        paddingHorizontal: spacing.xs + 2,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: spacing.xs
    },
    quotedOutgoing: {
        borderLeftColor: '#FFFFFF',
        backgroundColor: 'rgba(255,255,255,0.15)'
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4
    },
    timeText: {
        fontSize: 10
    },
    reactionsRow: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 4
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border
    },
    reactionPillActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySubtle
    }
});

export default MessageBubble;
