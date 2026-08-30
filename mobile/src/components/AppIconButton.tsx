import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import AppText from './AppText';

export interface AppIconButtonProps extends TouchableOpacityProps {
    icon: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'ghost' | 'filled' | 'elevated' | 'danger';
    badgeCount?: number;
    disabled?: boolean;
}

export const AppIconButton: React.FC<AppIconButtonProps> = ({
    icon,
    size = 'md',
    variant = 'ghost',
    badgeCount,
    disabled = false,
    style,
    ...props
}) => {
    const sizeDimensions = {
        sm: { size: 32, iconSize: 16 },
        md: { size: 40, iconSize: 20 },
        lg: { size: 48, iconSize: 24 }
    };

    const getBgColor = () => {
        switch (variant) {
            case 'filled':
                return colors.surface;
            case 'elevated':
                return colors.surfaceElevated;
            case 'danger':
                return colors.error;
            case 'ghost':
            default:
                return 'transparent';
        }
    };

    const dim = sizeDimensions[size].size;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    width: dim,
                    height: dim,
                    borderRadius: radius.full,
                    backgroundColor: getBgColor(),
                    opacity: disabled ? 0.5 : 1
                },
                variant === 'filled' && styles.bordered,
                style as ViewStyle
            ]}
            activeOpacity={0.7}
            disabled={disabled}
            accessibilityRole="button"
            {...props}
        >
            {icon}
            {badgeCount !== undefined && badgeCount > 0 && (
                <View style={styles.badge}>
                    <AppText variant="caption" color={colors.textPrimary} style={styles.badgeText}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </AppText>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    bordered: {
        borderWidth: 1,
        borderColor: colors.border
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: colors.unread,
        borderRadius: radius.full,
        paddingHorizontal: 4,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        lineHeight: 12
    }
});

export default AppIconButton;
