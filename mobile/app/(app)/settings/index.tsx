import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText } from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';

export default function SettingsIndexScreen() {
    const router = useRouter();

    const settingItems = [
        {
            title: 'Account',
            subtitle: 'Security, email, change password',
            icon: 'person-outline' as const,
            route: '/(app)/settings/account'
        },
        {
            title: 'Privacy',
            subtitle: 'Last seen, profile photo, blocked users',
            icon: 'lock-closed-outline' as const,
            route: '/(app)/settings/privacy'
        },
        {
            title: 'Notifications',
            subtitle: 'Message tones, group alerts, preview',
            icon: 'notifications-outline' as const,
            route: '/(app)/settings/notifications'
        },
        {
            title: 'Appearance',
            subtitle: 'Theme, dark mode, chat wallpapers',
            icon: 'color-palette-outline' as const,
            route: '/(app)/settings/appearance'
        },
        {
            title: 'Storage & Data',
            subtitle: 'Network usage, auto-download media',
            icon: 'server-outline' as const,
            route: '/(app)/settings/storage'
        }
    ];

    return (
        <Screen scrollable>
            <Header title="Settings" showBack={false} />

            <View style={styles.content}>
                {settingItems.map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        style={styles.item}
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
                            <AppText variant="caption" color={colors.textSecondary}>
                                {item.subtitle}
                            </AppText>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
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
    }
});
