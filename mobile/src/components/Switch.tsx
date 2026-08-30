import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ViewStyle
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import { colors, radius } from '../theme';

export interface SwitchProps {
    value: boolean;
    onValueChange: (val: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
    style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    disabled = false,
    activeColor = colors.primary,
    style
}) => {
    const translateX = useSharedValue(value ? 20 : 2);

    React.useEffect(() => {
        translateX.value = withTiming(value ? 20 : 2, { duration: 200 });
    }, [value]);

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <TouchableOpacity
            style={[
                styles.track,
                {
                    backgroundColor: value ? activeColor : colors.surfaceElevated,
                    opacity: disabled ? 0.5 : 1
                },
                style
            ]}
            onPress={() => !disabled && onValueChange(!value)}
            activeOpacity={0.8}
            accessibilityRole="switch"
            accessibilityState={{ checked: value, disabled }}
        >
            <Animated.View style={[styles.thumb, thumbStyle]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    track: {
        width: 48,
        height: 28,
        borderRadius: radius.full,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border
    },
    thumb: {
        width: 22,
        height: 22,
        borderRadius: radius.full,
        backgroundColor: '#FFFFFF'
    }
});

export default Switch;
