import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from '../Modal';
import AppText from '../AppText';
import Switch from '../Switch';
import AppButton from '../AppButton';
import { colors, spacing } from '../../theme';

export interface GroupPermissionsModalProps {
    visible: boolean;
    initialOnlyAdminsCanPost: boolean;
    initialOnlyAdminsCanEditInfo: boolean;
    onClose: () => void;
    onSave: (onlyAdminsCanPost: boolean, onlyAdminsCanEditInfo: boolean) => void;
}

export const GroupPermissionsModal: React.FC<GroupPermissionsModalProps> = ({
    visible,
    initialOnlyAdminsCanPost,
    initialOnlyAdminsCanEditInfo,
    onClose,
    onSave
}) => {
    const [onlyAdminsCanPost, setOnlyAdminsCanPost] = useState(initialOnlyAdminsCanPost);
    const [onlyAdminsCanEditInfo, setOnlyAdminsCanEditInfo] = useState(initialOnlyAdminsCanEditInfo);

    const handleSave = () => {
        onSave(onlyAdminsCanPost, onlyAdminsCanEditInfo);
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose} title="Group Permissions">
            <View style={styles.content}>
                {/* Channel / Broadcast Mode */}
                <View style={styles.permRow}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Channel Mode (Only Admins Post)
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            When enabled, regular members can only read messages
                        </AppText>
                    </View>
                    <Switch value={onlyAdminsCanPost} onValueChange={setOnlyAdminsCanPost} />
                </View>

                {/* Edit Group Info */}
                <View style={styles.permRow}>
                    <View style={styles.textContainer}>
                        <AppText variant="body" color={colors.textPrimary} weight="600">
                            Edit Group Info
                        </AppText>
                        <AppText variant="caption" color={colors.textSecondary}>
                            Only group admins can change the name, avatar, and description
                        </AppText>
                    </View>
                    <Switch value={onlyAdminsCanEditInfo} onValueChange={setOnlyAdminsCanEditInfo} />
                </View>

                <AppButton
                    title="Save Permissions"
                    size="md"
                    fullWidth
                    onPress={handleSave}
                    style={{ marginTop: spacing.lg }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    content: {
        width: '100%'
    },
    permRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.md
    }
});

export default GroupPermissionsModal;
