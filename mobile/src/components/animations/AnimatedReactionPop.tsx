import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';

export interface AnimatedReactionPopProps {
    children: React.ReactNode;
}

export const AnimatedReactionPop: React.FC<AnimatedReactionPopProps> = ({ children }) => {
    const scale = useSharedValue(0.4);

    useEffect(() => {
        scale.value = withSpring(1, {
            damping: 10,
            stiffness: 200
        });
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default AnimatedReactionPop;
