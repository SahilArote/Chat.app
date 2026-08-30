import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing } from '../theme';
import Badge from './Badge';

export interface ScrollToBottomFabProps {
    visible: boolean;
    onPress: () => void;
    unreadCount?: number;
}

export const ScrollToBottomFab: React.FC<ScrollToBottomFabProps> = ({
    visible,
    onPress,
    unreadCount
}) => {
    if (!visible) return null;

    return (
        <TouchableOpacity
            style={[styles.fab, shadows.lg]}
            activeOpacity={0.85}
            onPress={onPress}
            accessibilityLabel="Scroll to newest messages"
            accessibilityRole="button"
        >
            <Ionicons name="chevron-down" size={22} color={colors.primary} />
            {unreadCount !== undefined && unreadCount > 0 && (
                <View style={styles.badgeWrapper}>
                    <Badge count={unreadCount} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 80,
        right: spacing.lg,
        width: 44,
        height: 44,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
    },
    badgeWrapper: {
        position: 'absolute',
        top: -6,
        right: -6
    }
});

export default ScrollToBottomFab;
