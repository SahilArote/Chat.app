import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import AppText from './AppText';
import AppButton from './AppButton';

export interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryTitle?: string;
    style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something Went Wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry,
    retryTitle = 'Try Again',
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconCircle}>
                <Ionicons name="cloud-offline-outline" size={38} color={colors.error} />
            </View>

            <AppText variant="sectionTitle" color={colors.textPrimary} align="center" style={styles.title}>
                {title}
            </AppText>

            <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.message}>
                {message}
            </AppText>

            {onRetry && (
                <AppButton
                    title={retryTitle}
                    onPress={onRetry}
                    variant="outline"
                    size="sm"
                    leftIcon={<Ionicons name="refresh" size={16} color={colors.textPrimary} />}
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
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.error
    },
    title: {
        marginBottom: spacing.xs
    },
    message: {
        maxWidth: 280,
        marginBottom: spacing.lg
    },
    button: {
        minWidth: 130
    }
});

export default ErrorState;
