import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface SystemMessageProps {
    text: string;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.pill}>
                <AppText variant="caption" color={colors.textMuted} align="center" style={styles.text}>
                    {text}
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: spacing.sm,
        paddingHorizontal: spacing.xl
    },
    pill: {
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: colors.border
    },
    text: {
        fontSize: 11
    }
});

export default SystemMessage;
