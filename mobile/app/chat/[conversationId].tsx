import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
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
    ScrollToBottomFab,
    MessageBubble,
    MessageActionModal,
    ImageLightboxModal,
    ChatRoomSkeleton,
    PermissionPromptModal,
    PermissionType
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
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [activeReply, setActiveReply] = useState<MockMessageReply | null>(null);
    const [attachmentVisible, setAttachmentVisible] = useState(false);
    const [showScrollFab, setShowScrollFab] = useState(false);

    // Modal state for Action Sheet, Lightbox, and Permissions
    const [selectedMessage, setSelectedMessage] = useState<MockMessage | null>(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
    const [permissionModalVisible, setPermissionModalVisible] = useState(false);
    const [permissionType, setPermissionType] = useState<PermissionType>('camera');

    const loadData = useCallback(async () => {
        if (!conversationId) return;
        setLoading(true);
        const conv = await conversationRepository.getConversationById(conversationId);
        if (conv) setConversation(conv);

        const list = await messageRepository.getMessages(conversationId);
        setMessages(list);
        setLoading(false);
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

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Echo simulation
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
        if (type === 'camera') {
            setPermissionType('camera');
            setPermissionModalVisible(true);
            return;
        }

        let attachText = '📎 Attachment';
        let mediaUrl: string | undefined;
        let msgType: MockMessage['type'] = 'text';

        if (type === 'gallery') {
            msgType = 'image';
            attachText = 'Check out this screenshot!';
            mediaUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
        } else if (type === 'document') {
            msgType = 'file';
            attachText = 'Pulse_Spec_Document.pdf';
        } else if (type === 'audio') {
            msgType = 'audio';
            attachText = '';
        }

        const msg = await messageRepository.sendMessage(conversationId, {
            type: msgType,
            text: attachText,
            mediaUrl,
            fileName: type === 'document' ? 'Pulse_Spec_Document.pdf' : undefined,
            fileSize: type === 'document' ? '1.8 MB' : undefined,
            audioDuration: type === 'audio' ? '0:15' : undefined
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

    const handleLongPressMessage = (msg: MockMessage) => {
        setSelectedMessage(msg);
        setActionModalVisible(true);
    };

    const handleReplyMessage = (msg: MockMessage) => {
        setActiveReply({
            messageId: msg.id,
            senderName: msg.senderName,
            text: msg.text || (msg.type === 'image' ? 'Photo' : 'Audio Note')
        });
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!conversationId) return;
        await messageRepository.deleteMessage(conversationId, msgId);
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
    };

    const handleStartCall = (type: 'audio' | 'video') => {
        router.push({
            pathname: '/call/[callId]',
            params: {
                callId: `call_${Date.now()}`,
                type,
                contactName: conversation?.name || 'Pulse Chat'
            }
        });
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
                            onPress={() => handleStartCall('video')}
                        />
                        <AppIconButton
                            icon={<Ionicons name="call-outline" size={20} color={colors.textPrimary} />}
                            onPress={() => handleStartCall('audio')}
                        />
                    </View>
                }
            />

            {/* ─── 2. MESSAGE STREAM / SKELETON ─────────────────────── */}
            <View style={styles.chatBody}>
                {loading ? (
                    <ChatRoomSkeleton />
                ) : (
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
                        renderItem={({ item }) => (
                            <MessageBubble
                                message={item}
                                currentUserId="user_sahil"
                                onImagePress={(url) => setLightboxImageUrl(url)}
                                onLongPress={handleLongPressMessage}
                                onReactionPress={handleReaction}
                                onSwipeReply={handleReplyMessage}
                            />
                        )}
                        ListFooterComponent={isTyping ? <TypingIndicatorBubble /> : null}
                    />
                )}

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

            {/* ─── 5. MESSAGE LONG-PRESS ACTION MODAL ───────────────── */}
            <MessageActionModal
                message={selectedMessage}
                visible={actionModalVisible}
                onClose={() => setActionModalVisible(false)}
                onReact={handleReaction}
                onReply={handleReplyMessage}
                onCopy={() => {}}
                onForward={() => {}}
                onStar={() => {}}
                onDelete={handleDeleteMessage}
            />

            {/* ─── 6. FULLSCREEN IMAGE LIGHTBOX ─────────────────────── */}
            <ImageLightboxModal
                visible={!!lightboxImageUrl}
                imageUrl={lightboxImageUrl}
                onClose={() => setLightboxImageUrl(null)}
            />

            {/* ─── 7. PERMISSION PROMPT MODAL ───────────────────────── */}
            <PermissionPromptModal
                visible={permissionModalVisible}
                type={permissionType}
                onClose={() => setPermissionModalVisible(false)}
                onAllow={() => {}}
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
        paddingVertical: spacing.sm
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
    }
});
