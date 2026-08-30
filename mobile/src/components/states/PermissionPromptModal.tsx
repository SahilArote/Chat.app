import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../Modal';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { colors, radius, spacing } from '../../theme';

export type PermissionType = 'camera' | 'microphone' | 'notifications' | 'storage';

export interface PermissionPromptModalProps {
    visible: boolean;
    type: PermissionType;
    onClose: () => void;
    onAllow: () => void;
}

export const PermissionPromptModal: React.FC<PermissionPromptModalProps> = ({
    visible,
    type,
    onClose,
    onAllow
}) => {
    const getPermissionConfig = () => {
        switch (type) {
            case 'camera':
                return {
                    icon: 'camera' as const,
                    title: 'Allow Camera Access',
                    desc: 'Pulse Chat needs access to your camera so you can take photos, record video messages, and start HD video calls.'
                };
            case 'microphone':
                return {
                    icon: 'mic' as const,
                    title: 'Allow Microphone Access',
                    desc: 'Pulse Chat needs access to your microphone so you can record voice notes and make audio & video calls.'
                };
            case 'notifications':
                return {
                    icon: 'notifications' as const,
                    title: 'Enable Push Notifications',
                    desc: 'Stay connected with your team and never miss important messages or call alerts.'
                };
            case 'storage':
            default:
                return {
                    icon: 'folder' as const,
                    title: 'Allow Storage Access',
                    desc: 'Pulse Chat needs permission to save received photos, documents, and media cache to your device.'
                };
        }
    };

    const config = getPermissionConfig();

    return (
        <Modal visible={visible} onClose={onClose} title={config.title}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name={config.icon} size={36} color={colors.primary} />
                </View>

                <AppText variant="body" color={colors.textSecondary} align="center" style={styles.desc}>
                    {config.desc}
                </AppText>

                <View style={styles.btnRow}>
                    <AppButton
                        title="Not Now"
                        variant="ghost"
                        size="md"
                        onPress={onClose}
                        style={{ flex: 1 }}
                    />
                    <AppButton
                        title="Allow Access"
                        variant="primary"
                        size="md"
                        onPress={() => {
                            onAllow();
                            onClose();
                        }}
                        style={{ flex: 1, marginLeft: spacing.sm }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingVertical: spacing.xs
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md
    },
    desc: {
        lineHeight: 20,
        marginBottom: spacing.lg
    },
    btnRow: {
        flexDirection: 'row',
        width: '100%'
    }
});

export default PermissionPromptModal;
