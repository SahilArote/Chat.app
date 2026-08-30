import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText';
import { colors, radius, spacing } from '../../theme';

export interface FileMessageProps {
    fileName?: string;
    fileSize?: string;
    isOutgoing: boolean;
}

export const FileMessage: React.FC<FileMessageProps> = ({
    fileName = 'Document.pdf',
    fileSize = '1.8 MB',
    isOutgoing
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: isOutgoing ? 'rgba(255,255,255,0.15)' : colors.surfaceElevated }
            ]}
            activeOpacity={0.8}
        >
            <View style={styles.iconCircle}>
                <Ionicons name="document-text" size={22} color={colors.primary} />
            </View>

            <View style={styles.fileInfo}>
                <AppText
                    variant="bodySmall"
                    color={isOutgoing ? '#FFFFFF' : colors.textPrimary}
                    weight="600"
                    numberOfLines={1}
                >
                    {fileName}
                </AppText>
                <AppText
                    variant="caption"
                    color={isOutgoing ? 'rgba(255,255,255,0.7)' : colors.textMuted}
                >
                    {fileSize}
                </AppText>
            </View>

            <View style={styles.downloadIcon}>
                <Ionicons
                    name="arrow-down-circle-outline"
                    size={20}
                    color={isOutgoing ? '#FFFFFF' : colors.textSecondary}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: radius.md,
        width: 220,
        marginBottom: 2
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm
    },
    fileInfo: {
        flex: 1
    },
    downloadIcon: {
        marginLeft: spacing.xs
    }
});

export default FileMessage;
