import React, { useState } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import AppText from './AppText';

export interface AppInputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isPassword?: boolean;
    containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    isPassword = false,
    containerStyle,
    style,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

    const hasError = !!error;

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <AppText variant="label" color={colors.textSecondary} style={styles.label}>
                    {label}
                </AppText>
            )}

            <View
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputFocused,
                    hasError && styles.inputError
                ]}
            >
                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

                <TextInput
                    style={[styles.input, style as TextStyle]}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />

                {isPassword ? (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                ) : (
                    rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>
                )}
            </View>

            {hasError ? (
                <AppText variant="caption" color={colors.error} style={styles.helperText}>
                    {error}
                </AppText>
            ) : helperText ? (
                <AppText variant="caption" color={colors.textMuted} style={styles.helperText}>
                    {helperText}
                </AppText>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: spacing.md
    },
    label: {
        marginBottom: spacing.xs
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        minHeight: 50
    },
    inputFocused: {
        borderColor: colors.borderFocus,
        backgroundColor: colors.surfaceElevated
    },
    inputError: {
        borderColor: colors.error
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 15,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    helperText: {
        marginTop: spacing.xs,
        marginLeft: spacing.xs
    }
});

export default AppInput;
