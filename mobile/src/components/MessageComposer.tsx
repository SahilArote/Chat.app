import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import AnimatedSendButton from './animations/AnimatedSendButton';
import { colors, radius, spacing } from '../theme';
import { MockMessageReply } from '../mock/messages';

export interface MessageComposerProps {
    replyTo?: MockMessageReply | null;
    onCancelReply?: () => void;
    onSendMessage: (text: string) => void;
    onOpenAttachments: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
    replyTo,
    onCancelReply,
    onSendMessage,
    onOpenAttachments
}) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const handleSend = () => {
        if (!text.trim()) {
            // Voice mic trigger toggle
            setIsRecording(!isRecording);
            return;
        }
        onSendMessage(text.trim());
        setText('');
    };

    return (
        <View style={styles.container}>
            {/* ─── 1. QUOTED REPLY BANNER ───────────────────────────── */}
            {replyTo && (
                <View style={styles.replyBanner}>
                    <View style={styles.replyBar} />
                    <View style={styles.replyInfo}>
                        <AppText variant="caption" color={colors.primary} weight="700">
                            Replying to {replyTo.senderName}
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                            {replyTo.text}
                        </AppText>
                    </View>
                    <TouchableOpacity
                        onPress={onCancelReply}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={styles.closeReplyBtn}
                    >
                        <Ionicons name="close" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>
            )}

            {/* ─── 2. INPUT & ACTIONS ROW ───────────────────────────── */}
            <View style={styles.inputRow}>
                {/* Attachment Clip Button */}
                <TouchableOpacity
                    style={styles.iconBtn}
                    activeOpacity={0.7}
                    onPress={onOpenAttachments}
                >
                    <Ionicons name="add" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                {/* Main Text Input Field */}
                <View style={styles.inputWrapper}>
                    {isRecording ? (
                        <View style={styles.recordingRow}>
                            <View style={styles.recordingDot} />
                            <AppText variant="bodySmall" color={colors.error} weight="600">
                                0:04 • Recording Voice Note...
                            </AppText>
                        </View>
                    ) : (
                        <TextInput
                            style={styles.textInput}
                            placeholder="Message Pulse..."
                            placeholderTextColor={colors.textMuted}
                            value={text}
                            onChangeText={setText}
                            multiline
                            maxLength={1000}
                        />
                    )}

                    {/* Quick Emoji Trigger */}
                    <TouchableOpacity style={styles.inputEmojiBtn} activeOpacity={0.7}>
                        <Ionicons name="happy-outline" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Animated Send / Mic Button */}
                <AnimatedSendButton
                    hasText={text.trim().length > 0}
                    onPress={handleSend}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
        paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm
    },
    replyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.md,
        padding: spacing.xs + 2,
        marginBottom: spacing.xs
    },
    replyBar: {
        width: 3,
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        marginRight: spacing.sm
    },
    replyInfo: {
        flex: 1
    },
    closeReplyBtn: {
        padding: spacing.xs
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.xs
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        minHeight: 40,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.xs
    },
    textInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 14,
        paddingVertical: spacing.xs
    },
    recordingRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    recordingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
        marginRight: spacing.sm
    },
    inputEmojiBtn: {
        padding: 4
    }
});

export default MessageComposer;
