import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    Screen,
    Header,
    AppText,
    Card,
    Switch,
    AppButton,
    Modal,
    Toast
} from '../../../src/components';
import { colors, spacing, radius } from '../../../src/theme';
import { useAuth } from '../../../src/context/AuthContext';

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const activeSessions = [
        {
            id: 'sess_1',
            device: 'Google Pixel 8 Pro',
            location: 'Mumbai, India',
            isCurrent: true,
            icon: 'phone-portrait-outline' as const
        },
        {
            id: 'sess_2',
            device: 'MacBook Pro 16" (M3)',
            location: 'Mumbai, India',
            isCurrent: false,
            icon: 'laptop-outline' as const
        }
    ];

    const handleTerminateOtherSessions = () => {
        setToastMessage('All other sessions terminated successfully');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(false);
        logout();
        router.replace('/(auth)');
    };

    return (
        <Screen scrollable>
            <Header title="Account" />

            <View style={styles.content}>
                {toastMessage ? (
                    <Toast type="success" message={toastMessage} style={{ marginBottom: spacing.md }} />
                ) : null}

                {/* ─── 1. ACCOUNT INFO ──────────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        PERSONAL INFO
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.infoRow}>
                            <AppText variant="caption" color={colors.textSecondary}>USERNAME</AppText>
                            <AppText variant="body" color={colors.textPrimary} weight="600" style={styles.infoVal}>
                                @{user?.username || 'sahil.arote'}
                            </AppText>
                        </View>
                        <View style={[styles.infoRow, { marginTop: spacing.md }]}>
                            <AppText variant="caption" color={colors.textSecondary}>EMAIL ADDRESS</AppText>
                            <AppText variant="body" color={colors.textPrimary} weight="600" style={styles.infoVal}>
                                {user?.email || 'sahil@example.com'}
                            </AppText>
                        </View>
                    </Card>
                </View>

                {/* ─── 2. TWO FACTOR AUTH ───────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        SECURITY
                    </AppText>
                    <Card variant="outlined">
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleText}>
                                <AppText variant="body" color={colors.textPrimary} weight="600">
                                    Two-Factor Authentication (2FA)
                                </AppText>
                                <AppText variant="caption" color={colors.textSecondary}>
                                    Require 6-digit confirmation code on new device sign-ins
                                </AppText>
                            </View>
                            <Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />
                        </View>
                    </Card>
                </View>

                {/* ─── 3. ACTIVE SESSIONS ───────────────────────────────── */}
                <View style={styles.section}>
                    <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
                        ACTIVE DEVICES ({activeSessions.length})
                    </AppText>
                    <Card variant="outlined" style={{ padding: 0 }}>
                        {activeSessions.map((sess) => (
                            <View key={sess.id} style={styles.sessionRow}>
                                <View style={styles.sessionIcon}>
                                    <Ionicons name={sess.icon} size={20} color={colors.primary} />
                                </View>
                                <View style={styles.sessionInfo}>
                                    <View style={styles.sessionTitleRow}>
                                        <AppText variant="bodySmall" color={colors.textPrimary} weight="600">
                                            {sess.device}
                                        </AppText>
                                        {sess.isCurrent && (
                                            <View style={styles.currentBadge}>
                                                <AppText variant="caption" color={colors.online} weight="700" style={{ fontSize: 9 }}>
                                                    THIS DEVICE
                                                </AppText>
                                            </View>
                                        )}
                                    </View>
                                    <AppText variant="caption" color={colors.textMuted}>
                                        {sess.location}
                                    </AppText>
                                </View>
                            </View>
                        ))}
                    </Card>

                    <AppButton
                        title="Log Out of All Other Devices"
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onPress={handleTerminateOtherSessions}
                        style={{ marginTop: spacing.sm }}
                    />
                </View>

                {/* ─── 4. DANGER ZONE ───────────────────────────────────── */}
                <View style={styles.dangerSection}>
                    <AppButton
                        title="Delete Account"
                        variant="danger"
                        size="md"
                        fullWidth
                        onPress={() => setShowDeleteModal(true)}
                    />
                </View>
            </View>

            {/* Delete Account Dialog Modal */}
            <Modal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Account"
            >
                <AppText variant="body" color={colors.textSecondary} style={{ marginBottom: spacing.lg }}>
                    Are you sure you want to permanently delete your Pulse account? All chat history and media will be erased.
                </AppText>
                <View style={styles.modalBtnRow}>
                    <AppButton
                        title="Cancel"
                        variant="ghost"
                        size="md"
                        onPress={() => setShowDeleteModal(false)}
                        style={{ flex: 1 }}
                    />
                    <AppButton
                        title="Delete"
                        variant="danger"
                        size="md"
                        onPress={handleDeleteAccount}
                        style={{ flex: 1, marginLeft: spacing.sm }}
                    />
                </View>
            </Modal>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing['4xl']
    },
    section: {
        marginVertical: spacing.xs
    },
    sectionHeader: {
        marginBottom: spacing.xs,
        marginLeft: spacing.xs
    },
    infoRow: {
        justifyContent: 'center'
    },
    infoVal: {
        marginTop: 2
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toggleText: {
        flex: 1,
        marginRight: spacing.md
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    sessionIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md
    },
    sessionInfo: {
        flex: 1
    },
    sessionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    currentBadge: {
        marginLeft: spacing.sm,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: radius.full
    },
    dangerSection: {
        marginTop: spacing.xl
    },
    modalBtnRow: {
        flexDirection: 'row'
    }
});
