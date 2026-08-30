import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Avatar, Card, AppButton } from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';
import userRepository from '../../../src/repositories/UserRepository';
import { MockUserProfile } from '../../../src/mock/users';

export default function SettingsIndexScreen() {
    const router = useRouter();
    const { logout } = useAuth();
    const [user, setUser] = useState<MockUserProfile | null>(null);

    const loadUser = useCallback(async () => {
        const u = await userRepository.getCurrentUser();
        setUser(u);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const handleLogout = () => {
        logout();
        router.replace('/(auth)');
    };

    const settingItems = [
        {
            title: 'Account',
            subtitle: 'Email, phone, 2FA & active sessions',
            icon: 'person-outline' as const,
            route: '/(app)/settings/account'
        },
        {
            title: 'Privacy',
            subtitle: 'Last seen, read receipts, blocked contacts',
            icon: 'lock-closed-outline' as const,
            route: '/(app)/settings/privacy'
        },
        {
            title: 'Notifications',
            subtitle: 'Alert tones, previews, group notifications',
            icon: 'notifications-outline' as const,
            route: '/(app)/settings/notifications'
        },
        {
            title: 'Appearance',
            subtitle: 'Themes, accent colors & font size',
            icon: 'color-palette-outline' as const,
            route: '/(app)/settings/appearance'
        },
        {
            title: 'Storage & Data',
            subtitle: 'Media cache breakdown & auto-download',
            icon: 'server-outline' as const,
            route: '/(app)/settings/storage'
        },
        {
            title: 'Help & About',
            subtitle: 'App version 1.0.0, terms & licenses',
            icon: 'information-circle-outline' as const,
            route: '/(app)/settings/help'
        }
    ];

    return (
        <Screen scrollable>
            <Header title="Settings" showBack={false} />

            <View style={styles.content}>
                {/* ─── 1. USER PROFILE HERO CARD ────────────────────────── */}
                {user && (
                    <TouchableOpacity
                        style={styles.profileCard}
                        activeOpacity={0.8}
                        onPress={() => router.push('/(app)/profile')}
                    >
                        <Avatar
                            uri={user.avatar}
                            name={user.name}
                            size="lg"
                            status="online"
                        />
                        <View style={styles.profileInfo}>
                            <AppText variant="chatName" color={colors.textPrimary} style={styles.profileName}>
                                {user.name}
                            </AppText>
                            <AppText variant="caption" color={colors.textSecondary}>
                                @{user.username}
                            </AppText>
                            <AppText variant="caption" color={colors.primary} weight="600" style={{ marginTop: 2 }}>
                                View & Edit Profile →
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}

                {/* ─── 2. SETTINGS CATEGORY LIST ────────────────────────── */}
                <View style={styles.section}>
                    <Card variant="outlined" style={{ padding: 0 }}>
                        {settingItems.map((item, idx) => (
                            <TouchableOpacity
                                key={item.title}
                                style={[
                                    styles.menuItem,
                                    idx === settingItems.length - 1 && { borderBottomWidth: 0 }
                                ]}
                                activeOpacity={0.7}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={styles.iconCircle}>
                                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                                </View>

                                <View style={styles.itemText}>
                                    <AppText variant="chatName" color={colors.textPrimary}>
                                        {item.title}
                                    </AppText>
                                    <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
                                        {item.subtitle}
                                    </AppText>
                                </View>

                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </View>

                {/* ─── 3. LOG OUT BUTTON ────────────────────────────────── */}
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
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing['4xl']
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg
    },
    profileInfo: {
        flex: 1,
        marginLeft: spacing.md
    },
    profileName: {
        fontWeight: '700'
    },
    section: {
        marginBottom: spacing.lg
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border
    },
    itemText: {
        flex: 1,
        marginLeft: spacing.md
    },
    logoutSection: {
        marginTop: spacing.md
    }
});
