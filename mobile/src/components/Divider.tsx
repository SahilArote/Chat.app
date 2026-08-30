import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';
import AppText from './AppText';

export interface DividerProps {
    label?: string;
    style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ label, style }) => {
    if (label) {
        return (
            <View style={[styles.labeledContainer, style]}>
                <View style={styles.line} />
                <AppText variant="caption" color={colors.textMuted} style={styles.label}>
                    {label}
                </AppText>
                <View style={styles.line} />
            </View>
        );
    }

    return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: colors.border,
        width: '100%',
        marginVertical: spacing.sm
    },
    labeledContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.md,
        width: '100%'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border
    },
    label: {
        marginHorizontal: spacing.md
    }
});

export default Divider;
