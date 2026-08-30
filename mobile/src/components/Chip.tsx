import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import { colors, radius, spacing } from '../theme';
import AppText from './AppText';

export interface ChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    selected = false,
    onPress,
    icon,
    style
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                selected && styles.chipSelected,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <AppText
                variant="bodySmall"
                color={selected ? colors.textPrimary : colors.textSecondary}
                weight={selected ? '600' : '400'}
            >
                {label}
            </AppText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderWidth: 1,
        borderColor: colors.border
    },
    chipSelected: {
        backgroundColor: colors.primarySubtle,
        borderColor: colors.primary
    },
    icon: {
        marginRight: spacing.xs
    }
});

export default Chip;
