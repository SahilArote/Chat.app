import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import AppText from '../AppText';

export interface CallControlsProps {
    isMuted: boolean;
    isSpeaker: boolean;
    isVideoEnabled: boolean;
    onToggleMute: () => void;
    onToggleSpeaker: () => void;
    onToggleVideo: () => void;
    onFlipCamera: () => void;
    onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
    isMuted,
    isSpeaker,
    isVideoEnabled,
    onToggleMute,
    onToggleSpeaker,
    onToggleVideo,
    onFlipCamera,
    onEndCall
}) => {
    return (
        <View style={styles.container}>
            {/* Control Buttons Grid */}
            <View style={styles.controlRow}>
                {/* Mute Mic */}
                <TouchableOpacity
                    style={[styles.btn, isMuted && styles.btnActive]}
                    activeOpacity={0.8}
                    onPress={onToggleMute}
                >
                    <Ionicons
                        name={isMuted ? 'mic-off' : 'mic'}
                        size={22}
                        color={isMuted ? '#FFFFFF' : colors.textPrimary}
                    />
                </TouchableOpacity>

                {/* Video Camera Toggle */}
                <TouchableOpacity
                    style={[styles.btn, !isVideoEnabled && styles.btnActive]}
                    activeOpacity={0.8}
                    onPress={onToggleVideo}
                >
                    <Ionicons
                        name={isVideoEnabled ? 'videocam' : 'videocam-off'}
                        size={22}
                        color={!isVideoEnabled ? '#FFFFFF' : colors.textPrimary}
                    />
                </TouchableOpacity>

                {/* Speakerphone */}
                <TouchableOpacity
                    style={[styles.btn, isSpeaker && styles.btnActivePrimary]}
                    activeOpacity={0.8}
                    onPress={onToggleSpeaker}
                >
                    <Ionicons
                        name={isSpeaker ? 'volume-high' : 'volume-medium-outline'}
                        size={22}
                        color={isSpeaker ? '#FFFFFF' : colors.textPrimary}
                    />
                </TouchableOpacity>

                {/* Flip Camera */}
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.8}
                    onPress={onFlipCamera}
                >
                    <Ionicons name="camera-reverse-outline" size={22} color={colors.textPrimary} />
                </TouchableOpacity>

                {/* End Call Button */}
                <TouchableOpacity
                    style={styles.endCallBtn}
                    activeOpacity={0.85}
                    onPress={onEndCall}
                >
                    <Ionicons name="call" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(26, 32, 53, 0.85)',
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    btn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnActive: {
        backgroundColor: colors.error
    },
    btnActivePrimary: {
        backgroundColor: colors.primary
    },
    endCallBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.error,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CallControls;
