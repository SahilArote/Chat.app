import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import AppText from './AppText';
import AppButton from './AppButton';

export interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionTitle?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'chatbubbles-outline',
    title,
    description,
    actionTitle,
    onAction,
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconCircle}>
                <Ionicons name={icon} size={40} color={colors.primary} />
            </View>

            <AppText variant="sectionTitle" color={colors.textPrimary} align="center" style={styles.title}>
                {title}
            </AppText>

            {description && (
                <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.description}>
                    {description}
                </AppText>
            )}

            {actionTitle && onAction && (
                <AppButton
                    title={actionTitle}
                    onPress={onAction}
                    size="sm"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['2xl']
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border
    },
    title: {
        marginBottom: spacing.xs
    },
    description: {
        maxWidth: 280,
        marginBottom: spacing.lg
    },
    button: {
        minWidth: 140
    }
});

export default EmptyState;
