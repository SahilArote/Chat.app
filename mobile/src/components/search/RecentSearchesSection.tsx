import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface RecentSearchesSectionProps {
    searches: string[];
    onSelectSearch: (query: string) => void;
    onRemoveSearch: (query: string) => void;
    onClearAll: () => void;
}

export const RecentSearchesSection: React.FC<RecentSearchesSectionProps> = ({
    searches,
    onSelectSearch,
    onRemoveSearch,
    onClearAll
}) => {
    if (searches.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AppText variant="label" color={colors.textSecondary}>
                    RECENT SEARCHES
                </AppText>
                <TouchableOpacity onPress={onClearAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <AppText variant="caption" color={colors.primary} weight="600">
                        Clear All
                    </AppText>
                </TouchableOpacity>
            </View>

            <View style={styles.chipContainer}>
                {searches.map((term) => (
                    <View key={term} style={styles.pill}>
                        <TouchableOpacity
                            onPress={() => onSelectSearch(term)}
                            style={styles.pillTextBtn}
                        >
                            <Ionicons name="time-outline" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
                            <AppText variant="bodySmall" color={colors.textPrimary}>
                                {term}
                            </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onRemoveSearch(term)}
                            style={styles.removeBtn}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                            <Ionicons name="close" size={14} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.xs
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.full,
        paddingLeft: spacing.md,
        paddingRight: spacing.xs + 2,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: colors.border
    },
    pillTextBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    removeBtn: {
        marginLeft: spacing.xs,
        padding: 2
    }
});

export default RecentSearchesSection;
