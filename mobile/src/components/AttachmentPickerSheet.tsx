import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import BottomSheet from './BottomSheet';
import AppText from './AppText';

export interface AttachmentPickerSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelectOption: (type: 'camera' | 'gallery' | 'document' | 'audio' | 'contact' | 'location') => void;
}

export const AttachmentPickerSheet: React.FC<AttachmentPickerSheetProps> = ({
    visible,
    onClose,
    onSelectOption
}) => {
    const options = [
        {
            id: 'gallery' as const,
            label: 'Photos & Videos',
            icon: 'image' as keyof typeof Ionicons.glyphMap,
            bg: '#6366F1'
        },
        {
            id: 'camera' as const,
            label: 'Camera',
            icon: 'camera' as keyof typeof Ionicons.glyphMap,
            bg: '#EC4899'
        },
        {
            id: 'document' as const,
            label: 'Document',
            icon: 'document-text' as keyof typeof Ionicons.glyphMap,
            bg: '#3B82F6'
        },
        {
            id: 'audio' as const,
            label: 'Audio Note',
            icon: 'mic' as keyof typeof Ionicons.glyphMap,
            bg: '#10B981'
        },
        {
            id: 'contact' as const,
            label: 'Contact Card',
            icon: 'person' as keyof typeof Ionicons.glyphMap,
            bg: '#F59E0B'
        },
        {
            id: 'location' as const,
            label: 'Location',
            icon: 'location' as keyof typeof Ionicons.glyphMap,
            bg: '#8B5CF6'
        }
    ];

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Share Content">
            <View style={styles.grid}>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt.id}
                        style={styles.gridItem}
                        activeOpacity={0.7}
                        onPress={() => {
                            onSelectOption(opt.id);
                            onClose();
                        }}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: opt.bg }]}>
                            <Ionicons name={opt.icon} size={24} color="#FFFFFF" />
                        </View>
                        <AppText variant="caption" color={colors.textPrimary} align="center" style={styles.label}>
                            {opt.label}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        rowGap: spacing.lg
    },
    gridItem: {
        width: '30%',
        alignItems: 'center'
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs
    },
    label: {
        fontWeight: '500'
    }
});

export default AttachmentPickerSheet;
