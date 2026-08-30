import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import AppText from './AppText';

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search messages, people, groups...',
    onClear,
    onCancel,
    showCancel = false,
    style
}) => {
    const handleClear = () => {
        onChangeText('');
        if (onClear) onClear();
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inputWrapper}>
                <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {value.length > 0 && (
                    <TouchableOpacity
                        onPress={handleClear}
                        style={styles.clearButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityLabel="Clear search"
                        accessibilityRole="button"
                    >
                        <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {showCancel && onCancel && (
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton} accessibilityRole="button">
                    <AppText variant="button" color={colors.primary}>
                        Cancel
                    </AppText>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingHorizontal: spacing.md,
        height: 42,
        borderWidth: 1,
        borderColor: colors.border
    },
    searchIcon: {
        marginRight: spacing.sm
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 14,
        paddingVertical: 0
    },
    clearButton: {
        padding: spacing.xs
    },
    cancelButton: {
        marginLeft: spacing.md,
        paddingVertical: spacing.xs
    }
});

export default SearchBar;
