import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import AppText from './AppText';

export interface HeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    centerComponent?: React.ReactNode;
    style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    showBack = true,
    onBackPress,
    leftAction,
    rightAction,
    centerComponent,
    style
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (router.canGoBack()) {
            router.back();
        }
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                )}
                {leftAction}
            </View>

            <View style={styles.centerContainer}>
                {centerComponent ? (
                    centerComponent
                ) : (
                    <>
                        {title && (
                            <AppText
                                variant="chatName"
                                color={colors.textPrimary}
                                numberOfLines={1}
                                style={styles.title}
                            >
                                {title}
                            </AppText>
                        )}
                        {subtitle && (
                            <AppText
                                variant="caption"
                                color={colors.textSecondary}
                                numberOfLines={1}
                            >
                                {subtitle}
                            </AppText>
                        )}
                    </>
                )}
            </View>

            <View style={styles.rightContainer}>{rightAction}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 40
    },
    backButton: {
        marginRight: spacing.sm,
        padding: spacing.xs
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.sm
    },
    title: {
        fontWeight: '700'
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 40
    }
});

export default Header;
