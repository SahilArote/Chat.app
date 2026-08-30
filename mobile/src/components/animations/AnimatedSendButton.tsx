import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

export interface AnimatedSendButtonProps {
    hasText: boolean;
    onPress: () => void;
    onLongPress?: () => void;
}

export const AnimatedSendButton: React.FC<AnimatedSendButtonProps> = ({
    hasText,
    onPress,
    onLongPress
}) => {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withSpring(1.15, { damping: 10, stiffness: 200 }, () => {
            scale.value = withSpring(1);
        });
    }, [hasText, scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                style={[styles.btn, hasText && styles.sendBtn]}
                activeOpacity={0.8}
                onPress={onPress}
                onLongPress={onLongPress}
            >
                <Ionicons
                    name={hasText ? 'arrow-up' : 'mic'}
                    size={22}
                    color="#FFFFFF"
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    btn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendBtn: {
        backgroundColor: colors.primary
    }
});

export default AnimatedSendButton;
