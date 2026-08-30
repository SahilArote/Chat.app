import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    AppText,
    Avatar,
    CallControls
} from '../../src/components';
import { colors, radius, spacing } from '../../src/theme';

export default function ActiveCallScreen() {
    const { callId, type = 'audio', contactName = 'Alex Rivera' } = useLocalSearchParams<{
        callId: string;
        type?: string;
        contactName?: string;
    }>();
    const router = useRouter();

    const [isVideo, setIsVideo] = useState(type === 'video');
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaker, setIsSpeaker] = useState(type === 'video');
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleEndCall = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* ─── 1. TOP HEADER STATUS ─────────────────────────────── */}
            <View style={styles.topHeader}>
                <TouchableOpacity
                    style={styles.minBtn}
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.timerBadge}>
                    <Ionicons name="lock-closed" size={12} color={colors.online} style={{ marginRight: 4 }} />
                    <AppText variant="caption" color="#FFFFFF" weight="700">
                        {formatTimer(seconds)}
                    </AppText>
                </View>

                <View style={{ width: 32 }} />
            </View>

            {/* ─── 2. CALL BODY (AUDIO OR VIDEO) ────────────────────── */}
            {isVideo ? (
                <View style={styles.videoContainer}>
                    {/* Remote Video Feed */}
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' }}
                        style={styles.remoteVideo}
                        resizeMode="cover"
                    />

                    {/* Contact Name Tag */}
                    <View style={styles.contactOverlayTag}>
                        <AppText variant="bodySmall" color="#FFFFFF" weight="600">
                            {contactName}
                        </AppText>
                    </View>

                    {/* Local Self PIP Window */}
                    <View style={styles.pipWindow}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' }}
                            style={styles.pipImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.audioContainer}>
                    {/* Animated Pulsing Avatar Halo */}
                    <View style={styles.pulseHaloOuter}>
                        <View style={styles.pulseHaloInner}>
                            <Avatar name={contactName} size="xl" />
                        </View>
                    </View>

                    <AppText variant="screenTitle" color="#FFFFFF" align="center" style={styles.callerName}>
                        {contactName}
                    </AppText>
                    <AppText variant="bodySmall" color={colors.primary} align="center" style={styles.callSub}>
                        Pulse HD Audio Call • End-to-End Encrypted
                    </AppText>
                </View>
            )}

            {/* ─── 3. BOTTOM CALL CONTROLS ──────────────────────────── */}
            <CallControls
                isMuted={isMuted}
                isSpeaker={isSpeaker}
                isVideoEnabled={isVideo}
                onToggleMute={() => setIsMuted(!isMuted)}
                onToggleSpeaker={() => setIsSpeaker(!isSpeaker)}
                onToggleVideo={() => setIsVideo(!isVideo)}
                onFlipCamera={() => {}}
                onEndCall={handleEndCall}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0D14',
        justifyContent: 'space-between'
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        zIndex: 20
    },
    minBtn: {
        padding: spacing.xs
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radius.full
    },
    audioContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl
    },
    pulseHaloOuter: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl
    },
    pulseHaloInner: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(99, 102, 241, 0.18)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    callerName: {
        marginBottom: spacing.xs
    },
    callSub: {
        maxWidth: 240
    },
    videoContainer: {
        flex: 1,
        position: 'relative',
        marginHorizontal: spacing.md,
        marginVertical: spacing.md,
        borderRadius: radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border
    },
    remoteVideo: {
        width: '100%',
        height: '100%'
    },
    contactOverlayTag: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm
    },
    pipWindow: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 90,
        height: 130,
        borderRadius: radius.md,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    pipImage: {
        width: '100%',
        height: '100%'
    }
});
