import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { colors, radius } from '../theme';

export interface SkeletonProps {
    width?: number | `${number}%` | '100%';
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = radius.sm,
    style
}) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height,
                    borderRadius
                },
                animatedStyle,
                style
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: colors.surfaceElevated
    }
});

export default Skeleton;
