import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    Card,
    AppButton,
    Switch,
    SharedMediaGrid
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { MockUserProfile } from '../../src/mock/users';
import userRepository from '../../src/repositories/UserRepository';

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();

    const [user, setUser] = useState<MockUserProfile | null>(null);
    const [muted, setMuted] = useState(false);

    const loadUser = useCallback(async () => {
        if (!userId) return;
        const u = await userRepository.getUserById(userId);
        if (u) {
            setUser(u);
        } else {
            // Fallback for user_sahil or other mock ids
            const me = await userRepository.getCurrentUser();
            setUser(me);
        }
    }, [userId]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const handleBlock = async () => {
        if (!user) return;
        await userRepository.blockUser(user.id);
        router.back();
    };

    const handleReport = async () => {
        if (!user) return;
        await userRepository.reportUser(user.id, 'Spam');
        router.back();
    };

    if (!user) {
        return (
            <Screen>
                <Header title="Contact Info" />
                <View style={styles.loading}>
                    <AppText variant="body" color={colors.textSecondary}>
                        Loading contact details...
                    </AppText>
                </View>
            </Screen>
        );
    }

    return (
        <Screen scrollable>
            <Header title="Contact Info" />

            <View style={styles.content}>
                {/* ─── 1. HERO AVATAR & PRESENCE ────────────────────────── */}
                <View style={styles.hero}>
                    <Avatar
                        uri={user.avatar}
                        name={user.name}
                        size="xl"
                        status={user.status}
                    />
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.name}>
                        {user.name}
                    </AppText>
                    <View style={styles.presenceRow}>
                        <View
                            style={[
                                styles.presenceDot,
                                { backgroundColor: user.status === 'online' ? colors.online : colors.textMuted }
                            ]}
                        />
                        <AppText
                            variant="bodySmall"
                            color={user.status === 'online' ? colors.online : colors.textMuted}
                            weight="600"
                        >
                            {user.status === 'online' ? 'Online Now' : user.lastSeen ? `Last seen ${user.lastSeen}` : 'Offline'}
                        </AppText>
                    </View>
                    <AppText variant="caption" color={colors.textMuted} style={styles.username}>
                        @{user.username}
                    </AppText>
                </View>

                {/* ─── 2. COMMUNICATION ACTIONS ─────────────────────────── */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.gridBtn}
                        activeOpacity={0.7}
                        onPress={() => router.push('/chat/conv_1')}
                    >
                        <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Message
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridBtn} activeOpacity={0.7}>
                        <Ionicons name="call-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Audio
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridBtn} activeOpacity={0.7}>
                        <Ionicons name="videocam-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Video
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* ─── 3. ABOUT & BIO ───────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        ABOUT
                    </AppText>
                    <Card variant="outlined">
                        <AppText variant="body" color={colors.textPrimary} style={{ lineHeight: 22 }}>
                            {user.bio || 'Available on Pulse Chat'}
                        </AppText>
                    </Card>
                </View>

                {/* ─── 4. NOTIFICATIONS SETTINGS ────────────────────────── */}
                <View style={styles.section}>
                    <Card variant="outlined">
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1, marginRight: spacing.md }}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Mute Notifications
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Silence message alerts from this contact
                                </AppText>
                            </View>
                            <Switch value={muted} onValueChange={setMuted} />
                        </View>
                    </Card>
                </View>

                {/* ─── 5. SHARED MEDIA & DOCS ───────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        SHARED CONTENT
                    </AppText>
                    <SharedMediaGrid />
                </View>

                {/* ─── 6. SAFETY & MODERATION ───────────────────────────── */}
                <View style={styles.safetySection}>
                    <AppButton
                        title="Block Contact"
                        variant="secondary"
                        size="md"
                        fullWidth
                        onPress={handleBlock}
                        style={{ marginBottom: spacing.sm }}
                    />
                    <AppButton
                        title="Report Contact"
                        variant="danger"
                        size="md"
                        fullWidth
                        onPress={handleReport}
                    />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl']
    },
    hero: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    name: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    presenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },
    presenceDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6
    },
    username: {
        marginTop: 2
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md
    },
    gridBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg
    },
    section: {
        marginVertical: spacing.xs
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    safetySection: {
        marginTop: spacing.xl
    }
});
