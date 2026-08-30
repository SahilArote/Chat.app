import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    TouchableOpacityProps
} from 'react-native';
import { colors, radius, spacing, shadows } from '../theme';

export type CardVariant = 'flat' | 'elevated' | 'outlined';

export interface CardProps extends TouchableOpacityProps {
    variant?: CardVariant;
    padding?: keyof typeof spacing;
    children: React.ReactNode;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    variant = 'flat',
    padding = 'lg',
    children,
    onPress,
    style,
    ...props
}) => {
    const getCardStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: radius.lg,
            padding: spacing[padding],
            backgroundColor: variant === 'elevated' ? colors.surfaceElevated : colors.surface
        };

        if (variant === 'outlined') {
            baseStyle.borderWidth = 1;
            baseStyle.borderColor = colors.border;
        } else if (variant === 'elevated') {
            Object.assign(baseStyle, shadows.md);
        }

        return baseStyle;
    };

    if (onPress) {
        return (
            <TouchableOpacity
                style={[getCardStyle(), style as ViewStyle]}
                onPress={onPress}
                activeOpacity={0.75}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[getCardStyle(), style as ViewStyle]}>{children}</View>;
};

export default Card;
