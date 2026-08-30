import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadows } from '../theme';
import AppText from './AppText';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type?: ToastType;
    style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    style
}) => {
    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle' as const,
                    color: colors.success,
                    border: colors.success
                };
            case 'error':
                return {
                    icon: 'alert-circle' as const,
                    color: colors.error,
                    border: colors.error
                };
            case 'warning':
                return {
                    icon: 'warning' as const,
                    color: colors.warning,
                    border: colors.warning
                };
            case 'info':
            default:
                return {
                    icon: 'information-circle' as const,
                    color: colors.primary,
                    border: colors.borderFocus
                };
        }
    };

    const config = getConfig();

    return (
        <View style={[styles.container, { borderLeftColor: config.border }, shadows.lg, style]}>
            <Ionicons name={config.icon} size={20} color={config.color} style={styles.icon} />
            <AppText variant="bodySmall" color={colors.textPrimary} style={styles.message}>
                {message}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        marginHorizontal: spacing.md
    },
    icon: {
        marginRight: spacing.sm
    },
    message: {
        flex: 1,
        fontWeight: '500'
    }
});

export default Toast;
