import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    ActivityIndicator,
    StyleSheet,
    View,
    ViewStyle,
    TextStyle
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppText from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    style,
    ...props
}) => {
    const isInteractive = !loading && !disabled;

    const getContainerStyle = (): ViewStyle => {
        let bg: string = colors.primary;
        let borderColor: string = 'transparent';
        let borderWidth: number = 0;

        switch (variant) {
            case 'primary':
                bg = colors.primary;
                break;
            case 'secondary':
                bg = colors.surfaceElevated;
                break;
            case 'outline':
                bg = 'transparent';
                borderColor = colors.border;
                borderWidth = 1.5;
                break;
            case 'ghost':
                bg = 'transparent';
                break;
            case 'danger':
                bg = colors.error;
                break;
        }

        if (disabled) {
            bg = variant === 'ghost' || variant === 'outline' ? 'transparent' : colors.surface;
            borderColor = variant === 'outline' ? colors.border : 'transparent';
        }

        const sizePadding: Record<ButtonSize, { vertical: number; horizontal: number; height: number }> = {
            sm: { vertical: spacing.xs, horizontal: spacing.md, height: 36 },
            md: { vertical: spacing.sm + 2, horizontal: spacing.lg, height: 48 },
            lg: { vertical: spacing.md, horizontal: spacing.xl, height: 56 }
        };

        return {
            backgroundColor: bg,
            borderColor,
            borderWidth,
            borderRadius: radius.md,
            paddingVertical: sizePadding[size].vertical,
            paddingHorizontal: sizePadding[size].horizontal,
            minHeight: sizePadding[size].height,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            width: fullWidth ? '100%' : undefined,
            opacity: disabled ? 0.5 : 1
        };
    };

    const getTextColor = (): string => {
        if (disabled) return colors.textMuted;
        switch (variant) {
            case 'primary':
            case 'danger':
                return colors.textPrimary;
            case 'secondary':
                return colors.textPrimary;
            case 'outline':
                return colors.textPrimary;
            case 'ghost':
                return colors.primary;
            default:
                return colors.textPrimary;
        }
    };

    return (
        <TouchableOpacity
            style={[getContainerStyle(), style as ViewStyle]}
            disabled={!isInteractive}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isInteractive, busy: loading }}
            {...props}
        >
            {loading ? (
                <ActivityIndicator size="small" color={getTextColor()} />
            ) : (
                <View style={styles.contentRow}>
                    {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                    <AppText
                        variant={size === 'sm' ? 'bodySmall' : 'button'}
                        color={getTextColor()}
                        weight="600"
                    >
                        {title}
                    </AppText>
                    {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftIcon: {
        marginRight: spacing.sm
    },
    rightIcon: {
        marginLeft: spacing.sm
    }
});

export default AppButton;
