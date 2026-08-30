import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import AppText from './AppText';
import AppIconButton from './AppIconButton';
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
        if (!text.trim()) return;
        onSendMessage(text.trim());
        setText('');
    };

    const handleToggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
        } else {
            setIsRecording(false);
            onSendMessage('🎤 Voice Message (0:08)');
        }
    };

    return (
        <View style={styles.container}>
            {/* ─── 1. ACTIVE REPLY BANNER ──────────────────────────── */}
            {replyTo && (
                <View style={styles.replyBanner}>
                    <View style={styles.replyBarAccent} />
                    <View style={styles.replyContent}>
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
                        style={styles.cancelReply}
                    >
                        <Ionicons name="close" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            )}

            {/* ─── 2. INPUT BAR / VOICE RECORDING ──────────────────── */}
            {isRecording ? (
                <View style={styles.recordingRow}>
                    <View style={styles.recordingDot} />
                    <AppText variant="bodySmall" color={colors.error} weight="600" style={styles.recText}>
                        Recording Audio... (0:05)
                    </AppText>
                    <TouchableOpacity
                        style={styles.cancelRecBtn}
                        onPress={() => setIsRecording(false)}
                    >
                        <AppText variant="caption" color={colors.textSecondary}>
                            Cancel
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.stopRecBtn}
                        onPress={handleToggleRecording}
                    >
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.inputRow}>
                    {/* Attachment Clip Button */}
                    <AppIconButton
                        icon={<Ionicons name="attach" size={22} color={colors.textSecondary} />}
                        onPress={onOpenAttachments}
                        style={styles.attachBtn}
                    />

                    {/* Text Field */}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.textMuted}
                        value={text}
                        onChangeText={setText}
                        multiline
                    />

                    {/* Send or Voice Record Button */}
                    {text.trim().length > 0 ? (
                        <TouchableOpacity
                            style={styles.sendButton}
                            activeOpacity={0.8}
                            onPress={handleSend}
                        >
                            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    ) : (
                        <AppIconButton
                            icon={<Ionicons name="mic-outline" size={22} color={colors.textSecondary} />}
                            onPress={handleToggleRecording}
                            style={styles.micBtn}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    replyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    replyBarAccent: {
        width: 3,
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        marginRight: spacing.sm
    },
    replyContent: {
        flex: 1
    },
    cancelReply: {
        padding: spacing.xs
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm
    },
    attachBtn: {
        marginRight: spacing.xs
    },
    textInput: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        maxHeight: 110,
        color: colors.textPrimary,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.border
    },
    sendButton: {
        width: 38,
        height: 38,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.xs
    },
    micBtn: {
        marginLeft: spacing.xs
    },
    recordingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md
    },
    recordingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.error,
        marginRight: spacing.sm
    },
    recText: {
        flex: 1
    },
    cancelRecBtn: {
        paddingHorizontal: spacing.md
    },
    stopRecBtn: {
        width: 36,
        height: 36,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default MessageComposer;
