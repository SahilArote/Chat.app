import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Avatar,
    Card,
    AppButton,
    StatusSelectorModal,
    EditProfileModal
} from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import userRepository, { UserPresence } from '../../src/repositories/UserRepository';
import { MockUserProfile } from '../../src/mock/users';

export default function ProfileScreen() {
    const router = useRouter();
    const { logout } = useAuth();

    const [user, setUser] = useState<MockUserProfile | null>(null);
    const [presence, setPresence] = useState<UserPresence>({
        status: 'online',
        customStatus: 'Building Pulse Chat 🚀',
        customEmoji: '⚡'
    });

    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const loadUser = useCallback(async () => {
        const u = await userRepository.getCurrentUser();
        const p = await userRepository.getPresence();
        setUser(u);
        setPresence(p);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const handleSaveStatus = async (newPresence: UserPresence) => {
        setPresence(newPresence);
        const updated = await userRepository.updatePresence(newPresence);
        setUser(updated);
    };

    const handleSaveProfile = async (name: string, username: string, bio: string) => {
        const updated = await userRepository.updateProfile({ name, username, bio });
        setUser(updated);
    };

    const handleLogout = () => {
        logout();
        router.replace('/(auth)');
    };

    const getStatusIndicator = () => {
        switch (presence.status) {
            case 'online':
                return { color: colors.online, label: 'Online' };
            case 'away':
                return { color: colors.warning, label: 'Away' };
            case 'dnd':
                return { color: colors.error, label: 'Do Not Disturb' };
            case 'offline':
            default:
                return { color: colors.textMuted, label: 'Invisible' };
        }
    };

    const statusInd = getStatusIndicator();

    if (!user) return null;

    return (
        <Screen scrollable>
            <Header
                title="My Profile"
                showBack={false}
                rightAction={
                    <TouchableOpacity
                        onPress={() => setEditModalVisible(true)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <AppText variant="button" color={colors.primary}>
                            Edit
                        </AppText>
                    </TouchableOpacity>
                }
            />

            <View style={styles.content}>
                {/* ─── 1. AVATAR & USER IDENTITY ────────────────────────── */}
                <View style={styles.heroSection}>
                    <View style={styles.avatarWrapper}>
                        <Avatar
                            uri={user.avatar}
                            name={user.name}
                            size="xl"
                            status={presence.status === 'offline' ? undefined : 'online'}
                        />
                        <TouchableOpacity
                            style={styles.editAvatarBtn}
                            activeOpacity={0.8}
                            onPress={() => setEditModalVisible(true)}
                        >
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.name}>
                        {user.name}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                        @{user.username} • {user.email}
                    </AppText>
                </View>

                {/* ─── 2. CUSTOM STATUS PILL ───────────────────────────── */}
                <TouchableOpacity
                    style={styles.statusPill}
                    activeOpacity={0.75}
                    onPress={() => setStatusModalVisible(true)}
                >
                    <View style={styles.statusPillLeft}>
                        <AppText style={styles.statusEmoji}>
                            {presence.customEmoji || '⚡'}
                        </AppText>
                        <View style={styles.statusPillText}>
                            <AppText variant="bodySmall" color={colors.textPrimary} weight="600">
                                {presence.customStatus || 'Set a custom status...'}
                            </AppText>
                            <View style={styles.presenceRow}>
                                <View style={[styles.presenceDot, { backgroundColor: statusInd.color }]} />
                                <AppText variant="caption" color={colors.textMuted}>
                                    {statusInd.label}
                                </AppText>
                            </View>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>

                {/* ─── 3. BIO CARD ──────────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        ABOUT
                    </AppText>
                    <Card variant="outlined">
                        <AppText variant="body" color={colors.textPrimary} style={{ lineHeight: 22 }}>
                            {user.bio || 'No bio provided yet.'}
                        </AppText>
                    </Card>
                </View>

                {/* ─── 4. SECURITY & DATA BADGE ─────────────────────────── */}
                <Card variant="elevated" style={styles.secCard}>
                    <View style={styles.secRow}>
                        <Ionicons name="shield-checkmark" size={22} color={colors.success} />
                        <View style={styles.secText}>
                            <AppText variant="bodySmall" color={colors.textPrimary} weight="600">
                                End-to-End Encryption
                            </AppText>
                            <AppText variant="caption" color={colors.textMuted}>
                                Keys are securely stored on device.
                            </AppText>
                        </View>
                    </View>
                </Card>

                {/* ─── 5. QUICK SHORTCUTS ───────────────────────────────── */}
                <View style={styles.section}>
                    <Card variant="outlined">
                        <TouchableOpacity
                            style={styles.navRow}
                            activeOpacity={0.7}
                            onPress={() => router.push('/(app)/settings/account')}
                        >
                            <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.navIcon} />
                            <AppText variant="body" color={colors.textPrimary} style={styles.navLabel}>
                                Account & Security
                            </AppText>
                            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.navRow, { borderBottomWidth: 0 }]}
                            activeOpacity={0.7}
                            onPress={() => router.push('/(app)/settings/privacy')}
                        >
                            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.navIcon} />
                            <AppText variant="body" color={colors.textPrimary} style={styles.navLabel}>
                                Privacy Settings
                            </AppText>
                            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* ─── 6. SIGN OUT ACTION ───────────────────────────────── */}
                <View style={styles.logoutSection}>
                    <AppButton
                        title="Sign Out"
                        variant="danger"
                        size="md"
                        fullWidth
                        onPress={handleLogout}
                    />
                </View>
            </View>

            {/* Modals */}
            <StatusSelectorModal
                visible={statusModalVisible}
                initialPresence={presence}
                onClose={() => setStatusModalVisible(false)}
                onSave={handleSaveStatus}
            />

            <EditProfileModal
                visible={editModalVisible}
                initialUser={user}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveProfile}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl']
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    avatarWrapper: {
        position: 'relative'
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background
    },
    name: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md
    },
    statusPillLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    statusEmoji: {
        fontSize: 22,
        marginRight: spacing.md
    },
    statusPillText: {
        flex: 1
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
    section: {
        marginVertical: spacing.xs
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    secCard: {
        marginVertical: spacing.sm
    },
    secRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    secText: {
        marginLeft: spacing.md,
        flex: 1
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    navIcon: {
        marginRight: spacing.md
    },
    navLabel: {
        flex: 1
    },
    logoutSection: {
        marginTop: spacing.xl
    }
});
