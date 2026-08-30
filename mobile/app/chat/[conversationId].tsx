import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Avatar, AppIconButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function ChatRoomScreen() {
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
    const router = useRouter();
    const [messageText, setMessageText] = useState('');

    return (
        <Screen style={styles.container}>
            {/* Chat Room Header */}
            <Header
                title="Sahil Arote"
                subtitle="Online • typing..."
                centerComponent={
                    <TouchableOpacity
                        style={styles.headerCenter}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/user/user_sahil`)}
                    >
                        <Avatar name="Sahil Arote" size="sm" status="online" />
                        <View style={{ marginLeft: spacing.sm }}>
                            <AppText variant="chatName" color={colors.textPrimary}>
                                Sahil Arote
                            </AppText>
                            <AppText variant="caption" color={colors.online}>
                                Online
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

            {/* Mock Message Flow Area */}
            <View style={styles.messageArea}>
                <View style={styles.dateSeparator}>
                    <AppText variant="caption" color={colors.textMuted}>
                        TODAY
                    </AppText>
                </View>

                {/* Incoming Mock Bubble */}
                <View style={[styles.bubble, styles.incomingBubble]}>
                    <AppText variant="body" color={colors.textPrimary}>
                        Hey! The Expo Router dynamic routes and navigation stack are fully wired 🚀
                    </AppText>
                    <AppText variant="caption" color={colors.textMuted} style={styles.bubbleMeta}>
                        12:45 PM
                    </AppText>
                </View>

                {/* Outgoing Mock Bubble */}
                <View style={[styles.bubble, styles.outgoingBubble]}>
                    <AppText variant="body" color="#FFFFFF">
                        Awesome! Testing navigation between chat, group info, and user profiles.
                    </AppText>
                    <View style={styles.outgoingMeta}>
                        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{ marginRight: 4 }}>
                            12:46 PM
                        </AppText>
                        <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
                    </View>
                </View>
            </View>

            {/* Message Composer */}
            <View style={styles.composerContainer}>
                <AppIconButton
                    icon={<Ionicons name="add-circle-outline" size={24} color={colors.primary} />}
                    onPress={() => {}}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Message..."
                    placeholderTextColor={colors.textMuted}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                />

                {messageText.trim().length > 0 ? (
                    <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
                        <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                ) : (
                    <AppIconButton
                        icon={<Ionicons name="mic-outline" size={22} color={colors.textSecondary} />}
                        onPress={() => {}}
                    />
                )}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messageArea: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        justifyContent: 'flex-end'
    },
    dateSeparator: {
        alignSelf: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.lg,
        marginBottom: spacing.sm
    },
    incomingBubble: {
        alignSelf: 'flex-start',
        backgroundColor: colors.messageIncoming,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border
    },
    outgoingBubble: {
        alignSelf: 'flex-end',
        backgroundColor: colors.messageOutgoing,
        borderBottomRightRadius: 4
    },
    bubbleMeta: {
        alignSelf: 'flex-end',
        marginTop: 4
    },
    outgoingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 4
    },
    composerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        maxHeight: 100,
        color: colors.textPrimary,
        fontSize: 15,
        marginHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
