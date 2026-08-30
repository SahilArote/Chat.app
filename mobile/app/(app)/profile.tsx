import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Avatar, Card, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.replace('/(auth)');
    };

    return (
        <Screen scrollable>
            <Header title="My Profile" showBack={false} />

            <View style={styles.content}>
                {/* Avatar & User Details */}
                <View style={styles.profileHeader}>
                    <Avatar
                        uri={user?.avatar}
                        name={user?.username || 'User'}
                        size="xl"
                        status="online"
                    />
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.username}>
                        {user?.username}
                    </AppText>
                    <AppText variant="bodySmall" color={colors.textSecondary}>
                        {user?.email}
                    </AppText>
                    {user?.bio && (
                        <AppText variant="bodySmall" color={colors.textMuted} align="center" style={styles.bio}>
                            "{user.bio}"
                        </AppText>
                    )}
                </View>

                {/* Quick Info Card */}
                <Card variant="elevated" style={styles.card}>
                    <View style={styles.infoRow}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
                        <View style={styles.infoText}>
                            <AppText variant="bodySmall" color={colors.textPrimary} weight="600">
                                End-to-End Encryption Mock
                            </AppText>
                            <AppText variant="caption" color={colors.textMuted}>
                                Messages & media are isolated in design mode
                            </AppText>
                        </View>
                    </View>
                </Card>

                {/* Account Actions */}
                <View style={styles.actionSection}>
                    <AppButton
                        title="Edit Profile"
                        variant="secondary"
                        size="md"
                        fullWidth
                        style={styles.actionBtn}
                    />
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
        padding: spacing.xl
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    username: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    bio: {
        marginTop: spacing.sm,
        maxWidth: 260
    },
    card: {
        marginVertical: spacing.lg
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText: {
        marginLeft: spacing.md,
        flex: 1
    },
    actionSection: {
        marginTop: spacing.lg
    },
    actionBtn: {
        marginBottom: spacing.md
    }
});
