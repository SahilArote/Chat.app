import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Avatar } from '../../src/components';
import { colors, radius, spacing } from '../../src/theme';

export default function IncomingCallScreen() {
    const router = useRouter();

    const handleAccept = () => {
        router.replace({
            pathname: '/call/[callId]',
            params: { callId: 'call_live', type: 'video', contactName: 'Alex Rivera' }
        });
    };

    const handleDecline = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* ─── 1. TOP ENCRYPTION TAG ────────────────────────────── */}
            <View style={styles.topTag}>
                <Ionicons name="lock-closed" size={14} color={colors.online} style={{ marginRight: 4 }} />
                <AppText variant="caption" color={colors.textSecondary}>
                    End-to-End Encrypted Pulse Call
                </AppText>
            </View>

            {/* ─── 2. CALLER HERO INFO ──────────────────────────────── */}
            <View style={styles.callerSection}>
                <View style={styles.pulseOuter}>
                    <View style={styles.pulseInner}>
                        <Avatar name="Alex Rivera" size="xl" />
                    </View>
                </View>

                <AppText variant="screenTitle" color="#FFFFFF" align="center" style={styles.name}>
                    Alex Rivera
                </AppText>
                <AppText variant="body" color={colors.primary} align="center" style={styles.callType}>
                    Incoming Video Call...
                </AppText>
            </View>

            {/* ─── 3. ACCEPT / DECLINE ACTIONS ──────────────────────── */}
            <View style={styles.actionRow}>
                {/* Decline Button */}
                <TouchableOpacity
                    style={[styles.callBtn, styles.declineBtn]}
                    activeOpacity={0.8}
                    onPress={handleDecline}
                >
                    <Ionicons name="call" size={28} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
                    <AppText variant="caption" color="#FFFFFF" weight="700" style={styles.btnLabel}>
                        Decline
                    </AppText>
                </TouchableOpacity>

                {/* Accept Button */}
                <TouchableOpacity
                    style={[styles.callBtn, styles.acceptBtn]}
                    activeOpacity={0.8}
                    onPress={handleAccept}
                >
                    <Ionicons name="call" size={28} color="#FFFFFF" />
                    <AppText variant="caption" color="#FFFFFF" weight="700" style={styles.btnLabel}>
                        Accept
                    </AppText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0D14',
        justifyContent: 'space-between',
        paddingVertical: spacing.xl
    },
    topTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radius.full
    },
    callerSection: {
        alignItems: 'center'
    },
    pulseOuter: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl
    },
    pulseInner: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(99, 102, 241, 0.22)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        marginBottom: spacing.xs
    },
    callType: {
        fontWeight: '600'
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing['2xl'],
        paddingBottom: spacing.lg
    },
    callBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 72,
        height: 72,
        borderRadius: 36
    },
    declineBtn: {
        backgroundColor: colors.error
    },
    acceptBtn: {
        backgroundColor: colors.success
    },
    btnLabel: {
        marginTop: 4,
        fontSize: 11
    }
});
