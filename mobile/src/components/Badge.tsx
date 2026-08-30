import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';
import AppText from './AppText';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

export interface BadgeProps {
    count?: number;
    text?: string;
    variant?: BadgeVariant;
    dot?: boolean;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    count,
    text,
    variant = 'primary',
    dot = false,
    style
}) => {
    const getBgColor = () => {
        switch (variant) {
            case 'success':
                return colors.success;
            case 'warning':
                return colors.warning;
            case 'error':
                return colors.error;
            case 'neutral':
                return colors.surfaceElevated;
            case 'primary':
            default:
                return colors.unread;
        }
    };

    if (dot) {
        return (
            <View
                style={[
                    styles.dot,
                    { backgroundColor: getBgColor() },
                    style
                ]}
            />
        );
    }

    const content = count !== undefined ? (count > 99 ? '99+' : count.toString()) : text;
    if (!content) return null;

    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: getBgColor() },
                style
            ]}
        >
            <AppText variant="caption" color={colors.textPrimary} style={styles.badgeText}>
                {content}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    dot: {
        width: 8,
        height: 8,
        borderRadius: radius.full
    },
    badge: {
        paddingHorizontal: spacing.xs + 2,
        paddingVertical: 2,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 14
    }
});

export default Badge;
