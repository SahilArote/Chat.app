import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';

export interface SwipeableMessageRowProps {
    children: React.ReactNode;
    onSwipeReply?: () => void;
    enabled?: boolean;
}

const SWIPE_THRESHOLD = 50;

export const SwipeableMessageRow: React.FC<SwipeableMessageRowProps> = ({
    children,
    onSwipeReply,
    enabled = true
}) => {
    const translateX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(enabled && !!onSwipeReply)
        .activeOffsetX([10, 100])
        .onUpdate((event) => {
            if (event.translationX > 0) {
                // Apply drag resistance
                translateX.value = Math.min(event.translationX * 0.6, SWIPE_THRESHOLD * 1.3);
            }
        })
        .onEnd(() => {
            if (translateX.value >= SWIPE_THRESHOLD) {
                if (onSwipeReply) {
                    runOnJS(onSwipeReply)();
                }
            }
            translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        };
    });

    const iconAnimatedStyle = useAnimatedStyle(() => {
        const scale = translateX.value / SWIPE_THRESHOLD;
        const opacity = translateX.value / (SWIPE_THRESHOLD * 0.7);
        return {
            opacity: Math.min(opacity, 1),
            transform: [{ scale: Math.min(Math.max(scale, 0.5), 1.1) }]
        };
    });

    if (!onSwipeReply || !enabled) {
        return <View>{children}</View>;
    }

    return (
        <View style={styles.container}>
            {/* Left Reply Icon Indicator */}
            <Animated.View style={[styles.replyIconContainer, iconAnimatedStyle]}>
                <View style={styles.replyCircle}>
                    <Ionicons name="arrow-undo" size={16} color="#FFFFFF" />
                </View>
            </Animated.View>

            {/* Gesture-dragged message content */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={animatedStyle}>{children}</Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%'
    },
    replyIconContainer: {
        position: 'absolute',
        left: spacing.sm,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: -1
    },
    replyCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default SwipeableMessageRow;
