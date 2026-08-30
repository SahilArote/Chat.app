import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../Avatar';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface SearchResultItemProps {
    type: 'person' | 'conversation' | 'message' | 'media' | 'file';
    title: string;
    subtitle?: string;
    meta?: string;
    avatarUri?: string;
    mediaUrl?: string;
    searchQuery: string;
    onPress: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
    type,
    title,
    subtitle,
    meta,
    avatarUri,
    mediaUrl,
    searchQuery,
    onPress
}) => {
    // Highlight matching text helper
    const renderHighlightedText = (fullText: string, query: string) => {
        if (!query.trim() || !fullText) {
            return <AppText variant="bodySmall" color={colors.textSecondary}>{fullText}</AppText>;
        }

        const index = fullText.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) {
            return <AppText variant="bodySmall" color={colors.textSecondary}>{fullText}</AppText>;
        }

        const before = fullText.substring(0, index);
        const match = fullText.substring(index, index + query.length);
        const after = fullText.substring(index + query.length);

        return (
            <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={1}>
                {before}
                <AppText variant="bodySmall" color={colors.primary} weight="700">
                    {match}
                </AppText>
                {after}
            </AppText>
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={onPress}
        >
            {/* Visual Media Slot */}
            {type === 'person' || type === 'conversation' ? (
                <Avatar uri={avatarUri} name={title} size="sm" />
            ) : type === 'media' && mediaUrl ? (
                <Image source={{ uri: mediaUrl }} style={styles.mediaThumb} />
            ) : type === 'file' ? (
                <View style={styles.fileIcon}>
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                </View>
            ) : (
                <View style={styles.messageIcon}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                </View>
            )}

            {/* Information Slot */}
            <View style={styles.info}>
                <View style={styles.topRow}>
                    <AppText variant="chatName" color={colors.textPrimary} numberOfLines={1} style={styles.title}>
                        {title}
                    </AppText>
                    {meta && (
                        <AppText variant="caption" color={colors.textMuted}>
                            {meta}
                        </AppText>
                    )}
                </View>

                {subtitle ? (
                    <View style={styles.subtitleRow}>
                        {renderHighlightedText(subtitle, searchQuery)}
                    </View>
                ) : null}
            </View>

            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
        marginRight: spacing.sm
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: '600',
        flex: 1,
        marginRight: spacing.xs
    },
    subtitleRow: {
        marginTop: 2
    },
    mediaThumb: {
        width: 36,
        height: 36,
        borderRadius: radius.sm
    },
    fileIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default SearchResultItem;
