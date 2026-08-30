import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';
import AppText from './AppText';

export interface LoaderProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
    fullScreen?: boolean;
    style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
    size = 'large',
    color = colors.primary,
    text,
    fullScreen = false,
    style
}) => {
    return (
        <View
            style={[
                styles.container,
                fullScreen && styles.fullScreen,
                style
            ]}
        >
            <ActivityIndicator size={size} color={color} />
            {text && (
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.text}>
                    {text}
                </AppText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background
    },
    text: {
        marginTop: spacing.sm
    }
});

export default Loader;
