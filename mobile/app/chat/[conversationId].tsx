import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    AppIconButton,
    MessageComposer,
    TypingIndicatorBubble,
    AttachmentPickerSheet,
    ScrollToBottomFab
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { MockMessage, MockMessageReply } from '../../src/mock/messages';
import messageRepository from '../../src/repositories/MessageRepository';
import conversationRepository from '../../src/repositories/ConversationRepository';
import { MockConversation } from '../../src/mock/conversations';

export default function ChatRoomScreen() {
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const router = useRouter();
    const flatListRef = useRef<FlatList<MockMessage>>(null);

    const [conversation, setConversation] = useState<MockConversation | null>(null);
    const [messages, setMessages] = useState<MockMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [activeReply, setActiveReply] = useState<MockMessageReply | null>(null);
    const [attachmentVisible, setAttachmentVisible] = useState(false);
    const [showScrollFab, setShowScrollFab] = useState(false);

    // Load conversation metadata & message history
    const loadData = useCallback(async () => {
        if (!conversationId) return;
        const conv = await conversationRepository.getConversationById(conversationId);
        if (conv) setConversation(conv);

        const list = await messageRepository.getMessages(conversationId);
        setMessages(list);
    }, [conversationId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSendMessage = async (text: string) => {
        if (!conversationId) return;

        const sent = await messageRepository.sendMessage(conversationId, {
            text,
            replyTo: activeReply || undefined
        });

        setMessages((prev) => [...prev, sent]);
        setActiveReply(null);

        // Auto-scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate interactive typing & echo response after 1.2s
        setIsTyping(true);
        setTimeout(async () => {
            setIsTyping(false);
            const echoMsg = await messageRepository.sendMessage(conversationId, {
                senderId: 'user_echo',
                senderName: conversation?.name || 'Teammate',
                text: `Got it! Responding to "${text.length > 24 ? text.slice(0, 24) + '...' : text}" 🚀`
            });
            setMessages((prev) => [...prev, echoMsg]);
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 1200);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;
        setShowScrollFab(!isCloseToBottom && contentSize.height > layoutMeasurement.height);
    };

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const handleSelectAttachment = async (type: string) => {
        if (!conversationId) return;
        let attachText = '📎 Attachment';
        let mediaUrl: string | undefined;

        if (type === 'gallery') {
            attachText = 'Shared a photo';
            mediaUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600';
        } else if (type === 'document') {
            attachText = '📄 Project_Design_Spec_v2.pdf (1.4 MB)';
        } else if (type === 'location') {
            attachText = '📍 Shared Live Location';
        } else if (type === 'contact') {
            attachText = '👤 Contact: Sahil Arote (+91 9876543210)';
        }

        const msg = await messageRepository.sendMessage(conversationId, {
            type: type === 'gallery' ? 'image' : 'text',
            text: attachText,
            mediaUrl
        });

        setMessages((prev) => [...prev, msg]);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleReaction = async (msgId: string, emoji: string) => {
        if (!conversationId) return;
        const updated = await messageRepository.toggleReaction(conversationId, msgId, emoji);
        setMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
    };

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

    return (
        <Screen style={styles.container}>
            {/* ─── 1. CHAT HEADER ───────────────────────────────────── */}
            <Header
                showBack
                title=""
                centerComponent={
                    <TouchableOpacity
                        style={styles.headerCenter}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (conversation?.type === 'group') {
                                router.push(`/group/${conversation.id}`);
                            } else {
                                router.push(`/user/user_sahil`);
                            }
                        }}
                    >
                        <Avatar
                            uri={conversation?.avatar}
                            name={conversation?.name || 'Chat'}
                            size="sm"
                            status={conversation?.type === 'direct' ? 'online' : undefined}
                        />
                        <View style={styles.headerText}>
                            <AppText variant="chatName" color={colors.textPrimary} numberOfLines={1}>
                                {conversation?.name || 'Pulse Chat'}
                            </AppText>
                            <AppText variant="caption" color={isTyping ? colors.online : colors.textMuted}>
                                {isTyping ? 'typing...' : conversation?.type === 'group' ? 'Tap for group info' : 'Online'}
                            </AppText>
                        </View>
                    </TouchableOpacity>
                }
                rightAction={
                    <View style={styles.headerRight}>
                        <AppIconButton
                            icon={<Ionicons name="videocam-outline" size={20} color={colors.textPrimary} />}
                            onPress={() => {}}
                        />
                        <AppIconButton
                            icon={<Ionicons name="call-outline" size={20} color={colors.textPrimary} />}
                            onPress={() => {}}
                        />
                    </View>
                }
            />

            {/* ─── 2. MESSAGE STREAM ────────────────────────────────── */}
            <View style={styles.chatBody}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.messageList}
                    ListHeaderComponent={
                        <View style={styles.dateBadge}>
                            <AppText variant="caption" color={colors.textMuted} weight="600">
                                TODAY
                            </AppText>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const isOutgoing = item.senderId === 'user_sahil';

                        return (
                            <View
                                style={[
                                    styles.messageRow,
                                    isOutgoing ? styles.outgoingRow : styles.incomingRow
                                ]}
                            >
                                <View
                                    style={[
                                        styles.bubble,
                                        isOutgoing ? styles.outgoingBubble : styles.incomingBubble
                                    ]}
                                >
                                    {/* Reply Quoted Preview */}
                                    {item.replyTo && (
                                        <View style={[styles.quotedContainer, isOutgoing && styles.quotedOutgoing]}>
                                            <AppText variant="caption" color={isOutgoing ? '#FFFFFF' : colors.primary} weight="700">
                                                {item.replyTo.senderName}
                                            </AppText>
                                            <AppText variant="caption" color={isOutgoing ? 'rgba(255,255,255,0.8)' : colors.textSecondary} numberOfLines={1}>
                                                {item.replyTo.text}
                                            </AppText>
                                        </View>
                                    )}

                                    {/* Media Image */}
                                    {item.mediaUrl && (
                                        <Image
                                            source={{ uri: item.mediaUrl }}
                                            style={styles.bubbleImage}
                                            resizeMode="cover"
                                        />
                                    )}

                                    {/* Message Text */}
                                    {item.text ? (
                                        <AppText
                                            variant="body"
                                            color={isOutgoing ? '#FFFFFF' : colors.textPrimary}
                                        >
                                            {item.text}
                                        </AppText>
                                    ) : null}

                                    {/* Timestamp & Delivery status */}
                                    <View style={styles.bubbleFooter}>
                                        <AppText
                                            variant="caption"
                                            color={isOutgoing ? 'rgba(255,255,255,0.7)' : colors.textMuted}
                                            style={styles.timeText}
                                        >
                                            {item.timestamp}
                                        </AppText>
                                        {isOutgoing && renderDeliveryStatus(item.status)}
                                    </View>

                                    {/* Reactions Pill */}
                                    {item.reactions && item.reactions.length > 0 && (
                                        <View style={styles.reactionsRow}>
                                            {item.reactions.map((r, i) => (
                                                <TouchableOpacity
                                                    key={i}
                                                    style={[styles.reactionPill, r.userReacted && styles.reactionActive]}
                                                    onPress={() => handleReaction(item.id, r.emoji)}
                                                >
                                                    <AppText style={{ fontSize: 11 }}>{r.emoji}</AppText>
                                                    <AppText variant="caption" color={colors.textPrimary} style={{ marginLeft: 3 }}>
                                                        {r.count}
                                                    </AppText>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                    ListFooterComponent={isTyping ? <TypingIndicatorBubble /> : null}
                />

                {/* Floating Scroll-To-Bottom FAB */}
                <ScrollToBottomFab visible={showScrollFab} onPress={scrollToBottom} />
            </View>

            {/* ─── 3. MESSAGE COMPOSER ──────────────────────────────── */}
            <MessageComposer
                replyTo={activeReply}
                onCancelReply={() => setActiveReply(null)}
                onSendMessage={handleSendMessage}
                onOpenAttachments={() => setAttachmentVisible(true)}
            />

            {/* ─── 4. ATTACHMENT PICKER MODAL ───────────────────────── */}
            <AttachmentPickerSheet
                visible={attachmentVisible}
                onClose={() => setAttachmentVisible(false)}
                onSelectOption={handleSelectAttachment}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '70%'
    },
    headerText: {
        marginLeft: spacing.sm
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    chatBody: {
        flex: 1,
        position: 'relative'
    },
    messageList: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md
    },
    dateBadge: {
        alignSelf: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: 3,
        borderRadius: radius.full,
        marginVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border
    },
    messageRow: {
        marginVertical: 4,
        flexDirection: 'row'
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
    bubbleImage: {
        width: 220,
        height: 140,
        borderRadius: radius.md,
        marginBottom: spacing.xs
    },
    bubbleFooter: {
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
    reactionActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySubtle
    }
});
