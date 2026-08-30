import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface AudioMessageProps {
    duration?: string;
    isOutgoing: boolean;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({
    duration = '0:14',
    isOutgoing
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState<'1x' | '1.5x' | '2x'>('1x');

    const toggleSpeed = () => {
        if (speed === '1x') setSpeed('1.5x');
        else if (speed === '1.5x') setSpeed('2x');
        else setSpeed('1x');
    };

    // Simulated waveform bar heights
    const waveform = [12, 18, 8, 24, 16, 28, 20, 14, 26, 18, 10, 22, 14, 8, 16];

    return (
        <View style={styles.container}>
            <View style={styles.playerRow}>
                {/* Play / Pause Circular Button */}
                <TouchableOpacity
                    style={[
                        styles.playButton,
                        { backgroundColor: isOutgoing ? '#FFFFFF' : colors.primary }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={16}
                        color={isOutgoing ? colors.primary : '#FFFFFF'}
                        style={{ marginLeft: isPlaying ? 0 : 2 }}
                    />
                </TouchableOpacity>

                {/* Waveform Bar Graphic */}
                <View style={styles.waveformContainer}>
                    {waveform.map((height, i) => (
                        <View
                            key={i}
                            style={[
                                styles.waveBar,
                                {
                                    height,
                                    backgroundColor: isOutgoing
                                        ? i < 6
                                            ? '#FFFFFF'
                                            : 'rgba(255, 255, 255, 0.4)'
                                        : i < 6
                                        ? colors.primary
                                        : colors.borderLight
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Speed Multiplier Pill */}
                <TouchableOpacity
                    style={[
                        styles.speedPill,
                        { backgroundColor: isOutgoing ? 'rgba(255,255,255,0.2)' : colors.surfaceElevated }
                    ]}
                    onPress={toggleSpeed}
                >
                    <AppText
                        variant="caption"
                        color={isOutgoing ? '#FFFFFF' : colors.textPrimary}
                        weight="700"
                        style={{ fontSize: 10 }}
                    >
                        {speed}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Duration Display */}
            <AppText
                variant="caption"
                color={isOutgoing ? 'rgba(255,255,255,0.7)' : colors.textMuted}
                style={styles.duration}
            >
                {duration}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 220,
        paddingVertical: 2
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    playButton: {
        width: 34,
        height: 34,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center'
    },
    waveformContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: spacing.sm,
        height: 30
    },
    waveBar: {
        width: 3,
        borderRadius: 2
    },
    speedPill: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: radius.full
    },
    duration: {
        marginTop: 2,
        marginLeft: 42,
        fontSize: 10
    }
});

export default AudioMessage;
