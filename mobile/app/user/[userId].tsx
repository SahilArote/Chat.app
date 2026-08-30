import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, AppText, Avatar, Card, AppButton } from '../../src/components';
import { colors, spacing, radius } from '../../src/theme';

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();

    return (
        <Screen scrollable>
            <Header title="Contact Info" />

            <View style={styles.content}>
                <View style={styles.profileHeader}>
                    <Avatar name="Sahil Arote" size="xl" status="online" />
                    <AppText variant="screenTitle" color={colors.textPrimary} style={styles.name}>
                        Sahil Arote
                    </AppText>
                    <AppText variant="bodySmall" color={colors.online} style={{ fontWeight: '600' }}>
                        Online Now
                    </AppText>
                </View>

                {/* Communication Actions */}
                <View style={styles.actionGrid}>
                    <View style={styles.actionItem}>
                        <Ionicons name="chatbubble-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Message
                        </AppText>
                    </View>
                    <View style={styles.actionItem}>
                        <Ionicons name="call-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Audio
                        </AppText>
                    </View>
                    <View style={styles.actionItem}>
                        <Ionicons name="videocam-outline" size={22} color={colors.primary} />
                        <AppText variant="caption" color={colors.textPrimary} style={{ marginTop: 4 }}>
                            Video
                        </AppText>
                    </View>
                </View>

                {/* About & Bio Card */}
                <Card variant="outlined" style={styles.card}>
                    <AppText variant="label" color={colors.textSecondary}>ABOUT & STATUS</AppText>
                    <AppText variant="body" color={colors.textPrimary} style={{ marginTop: 4 }}>
                        Building Pulse Chat React Native design architecture 🚀
                    </AppText>
                </Card>

                {/* Privacy & Safety Actions */}
                <View style={styles.safetySection}>
                    <AppButton
                        title="Block Contact"
                        variant="danger"
                        size="md"
                        fullWidth
                    />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: spacing.lg
    },
    name: {
        marginTop: spacing.md,
        marginBottom: 2
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg
    },
    actionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md
    },
    card: {
        marginBottom: spacing.lg
    },
    safetySection: {
        marginTop: spacing.sm
    }
});
