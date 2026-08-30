import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import AudioMessage from './AudioMessage';
import FileMessage from './FileMessage';
import SystemMessage from './SystemMessage';
import SwipeableMessageRow from '../animations/SwipeableMessageRow';
import AnimatedReactionPop from '../animations/AnimatedReactionPop';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';
import { MockMessage } from '../../mock/messages';

export interface MessageBubbleProps {
    message: MockMessage;
    currentUserId: string;
    onImagePress?: (imageUrl: string) => void;
    onLongPress?: (message: MockMessage) => void;
    onReactionPress?: (messageId: string, emoji: string) => void;
    onSwipeReply?: (message: MockMessage) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    currentUserId,
    onImagePress,
    onLongPress,
    onReactionPress,
    onSwipeReply
}) => {
    // 1. System messages render centered with custom styling
    if (message.type === 'system') {
        return <SystemMessage text={message.text || ''} />;
    }

    const isOutgoing = message.senderId === currentUserId;

    // 2. Render specific message body based on type
    const renderContent = () => {
        switch (message.type) {
            case 'image':
                return (
                    <ImageMessage
                        mediaUrl={message.mediaUrl || ''}
                        caption={message.text}
                        isOutgoing={isOutgoing}
                        onPress={onImagePress || (() => {})}
                    />
                );
            case 'audio':
                return (
                    <AudioMessage
                        duration={message.audioDuration}
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
        <SwipeableMessageRow
            enabled={true}
            onSwipeReply={onSwipeReply ? () => onSwipeReply(message) : undefined}
        >
            <View
                style={[
                    styles.container,
                    isOutgoing ? styles.containerOutgoing : styles.containerIncoming
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => onLongPress && onLongPress(message)}
                    style={styles.touchable}
                >
                    {/* Quoted Reply Preview Header */}
                    {message.replyTo && (
                        <View
                            style={[
                                styles.replyPreview,
                                isOutgoing ? styles.replyPreviewOutgoing : styles.replyPreviewIncoming
                            ]}
                        >
                            <View style={styles.replyAccent} />
                            <View style={styles.replyContent}>
                                <AppText
                                    variant="caption"
                                    color={isOutgoing ? '#FFFFFF' : colors.primary}
                                    weight="700"
                                    numberOfLines={1}
                                >
                                    {message.replyTo.senderName}
                                </AppText>
                                <AppText
                                    variant="caption"
                                    color={isOutgoing ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary}
                                    numberOfLines={1}
                                >
                                    {message.replyTo.text}
                                </AppText>
                            </View>
                        </View>
                    )}

                    {/* Main Content Component */}
                    {renderContent()}

                    {/* Emoji Reactions List */}
                    {message.reactions && message.reactions.length > 0 && (
                        <View
                            style={[
                                styles.reactionsContainer,
                                isOutgoing ? styles.reactionsOutgoing : styles.reactionsIncoming
                            ]}
                        >
                            {message.reactions.map((r, i) => (
                                <AnimatedReactionPop key={`${r.emoji}-${i}`}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => onReactionPress && onReactionPress(message.id, r.emoji)}
                                        style={styles.reactionPill}
                                    >
                                        <AppText style={styles.reactionEmoji}>{r.emoji}</AppText>
                                        {r.count > 1 && (
                                            <AppText variant="caption" color={colors.textSecondary} style={styles.reactionCount}>
                                                {r.count}
                                            </AppText>
                                        )}
                                    </TouchableOpacity>
                                </AnimatedReactionPop>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SwipeableMessageRow>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: spacing.md,
        marginVertical: 3,
        flexDirection: 'row'
    },
    containerOutgoing: {
        justifyContent: 'flex-end'
    },
    containerIncoming: {
        justifyContent: 'flex-start'
    },
    touchable: {
        maxWidth: '82%',
        position: 'relative'
    },
    replyPreview: {
        flexDirection: 'row',
        padding: spacing.xs + 2,
        borderRadius: radius.sm,
        marginBottom: 4
    },
    replyPreviewOutgoing: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)'
    },
    replyPreviewIncoming: {
        backgroundColor: colors.surfaceElevated
    },
    replyAccent: {
        width: 3,
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        marginRight: spacing.xs + 2
    },
    replyContent: {
        flex: 1
    },
    reactionsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -10,
        zIndex: 10,
        gap: 4
    },
    reactionsOutgoing: {
        right: 8
    },
    reactionsIncoming: {
        left: 8
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    reactionEmoji: {
        fontSize: 12
    },
    reactionCount: {
        fontSize: 10,
        marginLeft: 3,
        fontWeight: '600'
    }
});

export default MessageBubble;
