import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../theme';

export const TypingIndicatorBubble: React.FC<{ userName?: string }> = () => {
    const dot1 = useSharedValue(0.3);
    const dot2 = useSharedValue(0.3);
    const dot3 = useSharedValue(0.3);

    useEffect(() => {
        const animConfig = { duration: 500, easing: Easing.inOut(Easing.ease) };
        dot1.value = withRepeat(withTiming(1, animConfig), -1, true);
        dot2.value = withDelay(180, withRepeat(withTiming(1, animConfig), -1, true));
        dot3.value = withDelay(360, withRepeat(withTiming(1, animConfig), -1, true));
    }, []);

    const style1 = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value }] }));
    const style2 = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value }] }));
    const style3 = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value }] }));

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Animated.View style={[styles.dot, style1]} />
                <Animated.View style={[styles.dot, style2]} />
                <Animated.View style={[styles.dot, style3]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginVertical: spacing.xs,
        paddingHorizontal: spacing.md
    },
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.messageIncoming,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.lg,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 6
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.primary
    }
});

export default TypingIndicatorBubble;
